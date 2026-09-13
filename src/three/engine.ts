import * as THREE from "three";
import type { RoomId } from "../data/types";
import { getRoom3D } from "../data/rooms3d";
import { buildRoom, setMarkerDiscovered, type BuiltRoom } from "./roomBuilder";
import { pointInBox } from "./collision";
import { FirstPersonControls } from "./controls";

const INTERACT_DISTANCE = 3.4;

export interface MarkerInfo {
  label: string;
  evidenceId?: string;
  flavorId?: string;
  action?: "desk";
  isSign?: boolean;
}

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: FirstPersonControls;
  private container: HTMLElement;
  private raycaster = new THREE.Raycaster();

  private currentRoomId: RoomId = "reading";
  private currentBuilt: BuiltRoom | null = null;
  private paused = false;
  private lastTime = 0;
  private focusedMarker: THREE.Mesh | null = null;
  private rafId: number | null = null;
  private isDiscovered: (id: string) => boolean;

  onFocusChange: ((info: MarkerInfo | null) => void) | null = null;
  onInteract: ((info: MarkerInfo) => void) | null = null;
  onDoorTrigger: ((toRoom: RoomId, spawn: { x: number; z: number; yaw: number }) => void) | null = null;
  onPointerLockChange: ((locked: boolean) => void) | null = null;

  constructor(container: HTMLElement, isDiscovered: (id: string) => boolean) {
    this.container = container;
    this.isDiscovered = isDiscovered;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    // A near-black void beyond doorways (rooms are only built when entered).
    // Kept clearly darker than any in-room surface (even a dim, unlit
    // corner) so a real wall never gets lost against the background.
    this.scene.background = new THREE.Color("#050402");

    this.camera = new THREE.PerspectiveCamera(72, 1, 0.1, 100);
    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.controls.enable();

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleInteractKey);
    document.addEventListener("pointerlockchange", this.handlePointerLockChange);

    this.handleResize();
  }

  private handleResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
  };

  private handlePointerLockChange = () => {
    this.onPointerLockChange?.(this.controls.pointerLocked);
  };

  private handleInteractKey = (e: KeyboardEvent) => {
    if (this.paused) return;
    if (e.code === "KeyE" || e.code === "Enter") {
      if (this.focusedMarker) {
        const d = this.focusedMarker.userData as MarkerInfo;
        this.onInteract?.(d);
      }
    }
  };

  setReducedMotion(value: boolean) {
    this.controls.reducedMotion = value;
  }

  setMouseSensitivity(multiplier: number) {
    this.controls.sensitivityMultiplier = multiplier;
  }

  /** "standard" caps the render pixel ratio at 1x for weaker hardware; "high" allows up to 2x. */
  setGraphicsQuality(quality: "standard" | "high") {
    const cap = quality === "high" ? 2 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, cap));
  }

  /** Call after the container becomes visible (e.g. leaving a `hidden` state) so the renderer picks up its real size. */
  refreshSize() {
    this.handleResize();
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    if (paused) {
      this.controls.clearHeldKeys();
    }
  }

  loadRoom(roomId: RoomId, spawnOverride?: { x: number; z: number; yaw: number }) {
    if (this.currentBuilt) {
      this.scene.remove(this.currentBuilt.group);
      disposeGroup(this.currentBuilt.group);
    }
    const def = getRoom3D(roomId);
    const built = buildRoom(def, this.isDiscovered);

    const ambient = new THREE.AmbientLight(new THREE.Color(def.ambientColor), def.ambientIntensity);
    built.group.add(ambient);
    for (const l of def.lights) {
      const light = new THREE.PointLight(new THREE.Color(l.color), l.intensity, l.distance);
      light.position.set(l.pos[0], l.pos[1], l.pos[2]);
      built.group.add(light);
    }

    this.scene.add(built.group);
    this.currentBuilt = built;
    this.currentRoomId = roomId;

    const spawn = spawnOverride ?? def.defaultSpawn;
    this.controls.teleport(spawn.x, spawn.z, spawn.yaw);
    this.focusedMarker = null;
    this.onFocusChange?.(null);
  }

  markDiscovered(evidenceId: string) {
    const mesh = this.currentBuilt?.markersByEvidenceId.get(evidenceId);
    if (mesh) setMarkerDiscovered(mesh);
  }

  getCurrentRoomId(): RoomId {
    return this.currentRoomId;
  }

  requestPointerLock() {
    this.renderer.domElement.requestPointerLock?.();
  }

  start() {
    this.lastTime = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - this.lastTime) / 1000, 0.1);
      this.lastTime = t;

      if (!this.paused && this.currentBuilt) {
        this.controls.update(dt, this.currentBuilt.colliders);

        // Raycast from screen center to find what the player is looking at.
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const hits = this.raycaster.intersectObjects(this.currentBuilt.markerMeshes, false);
        const hit = hits.find((h) => h.distance <= INTERACT_DISTANCE) ?? null;
        const mesh = (hit?.object as THREE.Mesh) ?? null;
        if (mesh !== this.focusedMarker) {
          this.focusedMarker = mesh;
          this.onFocusChange?.(mesh ? (mesh.userData as MarkerInfo) : null);
        }

        // Door triggers.
        const pos = this.controls.getPosition();
        for (const trigger of this.currentBuilt.doorTriggers) {
          if (pointInBox(pos.x, pos.z, trigger.box)) {
            this.onDoorTrigger?.(trigger.door.toRoom, trigger.door.spawn);
            break;
          }
        }

        // A gentle "look here" glow on undiscovered evidence, so nothing
        // requires pixel-hunting. Left as a steady low glow (no animation)
        // under reduced motion rather than skipped outright, so the cue
        // itself doesn't disappear for those players.
        if (!this.controls.reducedMotion) {
          const phase = t / 1000;
          for (const mesh of this.currentBuilt.markerMeshes) {
            if (!mesh.userData.pulses) continue;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0.12 + 0.1 * (0.5 + 0.5 * Math.sin(phase * 2.2 + mesh.id));
          }
        }
      } else {
        // Keep the camera matrix valid even while paused, without moving the player.
        this.camera.position.set(this.controls.x, this.camera.position.y, this.controls.z);
      }

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  dispose() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleInteractKey);
    document.removeEventListener("pointerlockchange", this.handlePointerLockChange);
    this.controls.disable();
    if (this.currentBuilt) disposeGroup(this.currentBuilt.group);
    this.renderer.dispose();
    this.container.innerHTML = "";
  }
}

function disposeGroup(group: THREE.Group) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
}
