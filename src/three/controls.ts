import * as THREE from "three";
import type { Box2D } from "./collision";
import { resolveCollisions } from "./collision";

const EYE_HEIGHT = 1.65;
const PLAYER_RADIUS = 0.32;
const MOVE_SPEED = 3.0;
const KEY_TURN_SPEED = 2.0; // radians/sec, continuous mode
const SNAP_TURN_RADIANS = Math.PI / 6; // 30 degrees, reduced-motion mode
const BASE_MOUSE_SENSITIVITY = 0.0022;
const MAX_PITCH = THREE.MathUtils.degToRad(85);

export class FirstPersonControls {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;

  x = 0;
  z = 0;
  yaw = 0;
  pitch = 0;

  reducedMotion = false;
  pointerLocked = false;
  /** Multiplier on the base mouse sensitivity, adjustable in Settings (0.5–2.0). */
  sensitivityMultiplier = 1;
  private keys = new Set<string>();
  private snapEdge = new Set<string>();

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    this.snapEdge.delete(e.code);
  };
  private onMouseMove = (e: MouseEvent) => {
    if (!this.pointerLocked) return;
    const sens = BASE_MOUSE_SENSITIVITY * this.sensitivityMultiplier;
    this.yaw -= e.movementX * sens;
    this.pitch -= e.movementY * sens;
    this.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this.pitch));
  };
  private onPointerLockChange = () => {
    this.pointerLocked = document.pointerLockElement === this.domElement;
  };
  private onClick = () => {
    if (!this.pointerLocked) {
      this.domElement.requestPointerLock?.();
    }
  };

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
  }

  enable() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.addEventListener("click", this.onClick);
  }

  disable() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.removeEventListener("click", this.onClick);
    this.keys.clear();
    if (document.pointerLockElement === this.domElement) document.exitPointerLock();
  }

  /** Suspends key/mouse tracking while a modal/panel is open, without tearing down listeners. */
  clearHeldKeys() {
    this.keys.clear();
  }

  teleport(x: number, z: number, yawDegrees: number) {
    this.x = x;
    this.z = z;
    this.yaw = THREE.MathUtils.degToRad(yawDegrees);
    this.pitch = 0;
  }

  getPosition() {
    return { x: this.x, z: this.z };
  }

  update(dt: number, colliders: Box2D[]) {
    // Continuous keyboard turning (or discrete snap-turns under reduced motion).
    if (this.reducedMotion) {
      if (this.keys.has("ArrowLeft") && !this.snapEdge.has("ArrowLeft")) {
        this.yaw += SNAP_TURN_RADIANS;
        this.snapEdge.add("ArrowLeft");
      }
      if (this.keys.has("ArrowRight") && !this.snapEdge.has("ArrowRight")) {
        this.yaw -= SNAP_TURN_RADIANS;
        this.snapEdge.add("ArrowRight");
      }
    } else {
      if (this.keys.has("ArrowLeft")) this.yaw += KEY_TURN_SPEED * dt;
      if (this.keys.has("ArrowRight")) this.yaw -= KEY_TURN_SPEED * dt;
    }

    // Movement, relative to facing direction.
    let forward = 0;
    let strafe = 0;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) forward += 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) forward -= 1;
    if (this.keys.has("KeyD")) strafe += 1;
    if (this.keys.has("KeyA")) strafe -= 1;

    if (forward !== 0 || strafe !== 0) {
      const len = Math.hypot(forward, strafe) || 1;
      forward /= len;
      strafe /= len;
      // Must match the camera's actual facing direction for rotation.y = yaw
      // (camera.rotation.y rotates the default -Z forward vector to
      // (-sin(yaw), -cos(yaw)) — using sin/cos directly here, without the
      // negation, would silently decouple movement from what's on screen).
      const dirX = -Math.sin(this.yaw);
      const dirZ = -Math.cos(this.yaw);
      const rightX = Math.cos(this.yaw);
      const rightZ = -Math.sin(this.yaw);
      const dx = (dirX * forward + rightX * strafe) * MOVE_SPEED * dt;
      const dz = (dirZ * forward + rightZ * strafe) * MOVE_SPEED * dt;
      const resolved = resolveCollisions(this.x + dx, this.z + dz, PLAYER_RADIUS, colliders);
      this.x = resolved.x;
      this.z = resolved.z;
    }

    this.camera.position.set(this.x, EYE_HEIGHT, this.z);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}
