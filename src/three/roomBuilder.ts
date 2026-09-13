import * as THREE from "three";
import type { DoorDef, FurniturePiece, Room3D, Shape } from "../data/types";
import { getRoom } from "../data/rooms";
import type { Box2D } from "./collision";
import { boxFromCenter } from "./collision";
import { buildCanvasLabel, buildPhotoPlane, buildWallDiagram, buildWallpaperMarks } from "./wallDiagram";

const WALL_THK = 0.25;
const SIGN_COLOR = "#c9963f";

export interface BuiltRoom {
  group: THREE.Group;
  colliders: Box2D[];
  doorTriggers: { box: Box2D; door: DoorDef }[];
  markerMeshes: THREE.Mesh[];
  markersByEvidenceId: Map<string, THREE.Mesh>;
}

function wallMaterial(color: string) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0.02 });
}

function geometryFor(shape: Shape, w: number, h: number, d: number): THREE.BufferGeometry {
  switch (shape) {
    case "cylinder":
      // size convention: [radius, height, radius] — d is ignored, w is the radius.
      return new THREE.CylinderGeometry(Math.max(w, 0.01), Math.max(w, 0.01), Math.max(h, 0.01), 16);
    case "cone":
      return new THREE.ConeGeometry(Math.max(w, 0.01), Math.max(h, 0.01), 16);
    case "sphere":
      return new THREE.SphereGeometry(Math.max(w, 0.01), 16, 12);
    case "box":
    default:
      return new THREE.BoxGeometry(Math.max(w, 0.01), Math.max(h, 0.01), Math.max(d, 0.01));
  }
}

function addMesh(
  group: THREE.Group,
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  shape: Shape = "box"
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometryFor(shape, w, h, d), material);
  mesh.position.set(cx, cy, cz);
  group.add(mesh);
  return mesh;
}

function addBoxMesh(
  group: THREE.Group,
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  material: THREE.Material
): THREE.Mesh {
  return addMesh(group, cx, cy, cz, w, h, d, material, "box");
}

function buildWallNS(
  group: THREE.Group,
  fixedZ: number,
  length: number,
  height: number,
  material: THREE.Material,
  colliders: Box2D[],
  door?: DoorDef
) {
  if (!door) {
    addBoxMesh(group, 0, height / 2, fixedZ, length, height, WALL_THK, material);
    colliders.push(boxFromCenter(0, fixedZ, length, WALL_THK));
    return;
  }
  const half = door.width / 2;
  const leftLen = door.offset - half - -length / 2;
  const rightLen = length / 2 - (door.offset + half);
  if (leftLen > 0.01) {
    const cx = -length / 2 + leftLen / 2;
    addBoxMesh(group, cx, height / 2, fixedZ, leftLen, height, WALL_THK, material);
    colliders.push(boxFromCenter(cx, fixedZ, leftLen, WALL_THK));
  }
  if (rightLen > 0.01) {
    const cx = door.offset + half + rightLen / 2;
    addBoxMesh(group, cx, height / 2, fixedZ, rightLen, height, WALL_THK, material);
    colliders.push(boxFromCenter(cx, fixedZ, rightLen, WALL_THK));
  }
  const headerH = height - door.height;
  if (headerH > 0.01) {
    addBoxMesh(group, door.offset, door.height + headerH / 2, fixedZ, door.width, headerH, WALL_THK, material);
  }
}

function buildWallEW(
  group: THREE.Group,
  fixedX: number,
  length: number,
  height: number,
  material: THREE.Material,
  colliders: Box2D[],
  door?: DoorDef
) {
  if (!door) {
    addBoxMesh(group, fixedX, height / 2, 0, WALL_THK, height, length, material);
    colliders.push(boxFromCenter(fixedX, 0, WALL_THK, length));
    return;
  }
  const half = door.width / 2;
  const nearLen = door.offset - half - -length / 2;
  const farLen = length / 2 - (door.offset + half);
  if (nearLen > 0.01) {
    const cz = -length / 2 + nearLen / 2;
    addBoxMesh(group, fixedX, height / 2, cz, WALL_THK, height, nearLen, material);
    colliders.push(boxFromCenter(fixedX, cz, WALL_THK, nearLen));
  }
  if (farLen > 0.01) {
    const cz = door.offset + half + farLen / 2;
    addBoxMesh(group, fixedX, height / 2, cz, WALL_THK, height, farLen, material);
    colliders.push(boxFromCenter(fixedX, cz, WALL_THK, farLen));
  }
  const headerH = height - door.height;
  if (headerH > 0.01) {
    addBoxMesh(group, fixedX, door.height + headerH / 2, door.offset, WALL_THK, headerH, door.width, material);
  }
}

/** Where a door's sign should sit: just inside the room, centered on the doorway, mounted above head height. */
// rotationY values are chosen so the sign PLANE's front face (default
// normal +Z) ends up pointing back into the room, toward whoever is
// walking past it — not just an arbitrary "matches the doorway" angle. A
// flat single-sided plane (unlike the box this used to be) is invisible
// from its back, so getting this backwards silently hides the sign.
function signPositionFor(room: Room3D, door: DoorDef): { pos: [number, number, number]; rotationY: number; width: number } {
  const signY = Math.min(door.height - 0.15, room.height - 0.3);
  const signW = Math.min(door.width * 0.85, 1.3);
  const inset = WALL_THK + 0.06;
  switch (door.wall) {
    case "north":
      return { pos: [door.offset, signY, -room.depth / 2 + inset], rotationY: 0, width: signW };
    case "south":
      return { pos: [door.offset, signY, room.depth / 2 - inset], rotationY: 180, width: signW };
    case "east":
      return { pos: [room.width / 2 - inset, signY, door.offset], rotationY: -90, width: signW };
    default:
      return { pos: [-room.width / 2 + inset, signY, door.offset], rotationY: 90, width: signW };
  }
}

// The destination name is baked directly onto the sign as a texture (not
// just shown on hover) so a player can read where a door leads just by
// glancing at it while walking past, without needing to aim the crosshair.
function signTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = SIGN_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8a6a2e";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

  ctx.fillStyle = "#2a2013";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let fontSize = 56;
  const maxWidth = canvas.width - 48;
  do {
    ctx.font = `bold ${fontSize}px Georgia, serif`;
    fontSize -= 2;
  } while (ctx.measureText(text).width > maxWidth && fontSize > 20);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildDoorSign(group: THREE.Group, room: Room3D, door: DoorDef, markerMeshes: THREE.Mesh[]) {
  const dest = getRoom(door.toRoom);
  const label = dest ? dest.name : door.toRoom;
  const { pos, rotationY, width } = signPositionFor(room, door);
  const texture = signTexture(label);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.4,
    roughness: 0.5,
    metalness: 0.2,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.32), mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.y = THREE.MathUtils.degToRad(rotationY);
  mesh.userData = { label, isSign: true };
  markerMeshes.push(mesh);
  group.add(mesh);
}

export function buildRoom(room: Room3D, isDiscovered: (id: string) => boolean): BuiltRoom {
  const group = new THREE.Group();
  const colliders: Box2D[] = [];
  const doorTriggers: { box: Box2D; door: DoorDef }[] = [];

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(room.width, room.depth),
    new THREE.MeshStandardMaterial({ color: room.floorColor, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  group.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(room.width, room.depth),
    new THREE.MeshStandardMaterial({ color: room.ceilingColor, roughness: 0.95, side: THREE.DoubleSide })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, room.height, 0);
  group.add(ceiling);

  // Walls
  const wallMat = wallMaterial(room.wallColor);
  const doorFor = (wall: DoorDef["wall"]) => room.doors.find((d) => d.wall === wall);
  buildWallNS(group, -room.depth / 2, room.width, room.height, wallMat, colliders, doorFor("north"));
  buildWallNS(group, room.depth / 2, room.width, room.height, wallMat, colliders, doorFor("south"));
  buildWallEW(group, room.width / 2, room.depth, room.height, wallMat, colliders, doorFor("east"));
  buildWallEW(group, -room.width / 2, room.depth, room.height, wallMat, colliders, doorFor("west"));

  // Door trigger volumes (a shallow zone just past each doorway) and a
  // visible sign naming the destination room, so players never have to
  // guess what's through a doorway before walking into it.
  const markerMeshes: THREE.Mesh[] = [];
  for (const door of room.doors) {
    const TRIGGER_DEPTH = 0.7;
    if (door.wall === "north") {
      doorTriggers.push({ box: boxFromCenter(door.offset, -room.depth / 2 - TRIGGER_DEPTH / 2, door.width, TRIGGER_DEPTH), door });
    } else if (door.wall === "south") {
      doorTriggers.push({ box: boxFromCenter(door.offset, room.depth / 2 + TRIGGER_DEPTH / 2, door.width, TRIGGER_DEPTH), door });
    } else if (door.wall === "east") {
      doorTriggers.push({ box: boxFromCenter(room.width / 2 + TRIGGER_DEPTH / 2, door.offset, TRIGGER_DEPTH, door.width), door });
    } else {
      doorTriggers.push({ box: boxFromCenter(-room.width / 2 - TRIGGER_DEPTH / 2, door.offset, TRIGGER_DEPTH, door.width), door });
    }
    buildDoorSign(group, room, door, markerMeshes);
  }

  for (const diagram of room.wallDiagrams ?? []) {
    buildWallDiagram(group, diagram);
  }
  for (const label of room.canvasLabels ?? []) {
    buildCanvasLabel(group, label);
  }
  for (const marks of room.wallpaperMarks ?? []) {
    buildWallpaperMarks(group, marks);
  }
  for (const photo of room.photoPlanes ?? []) {
    buildPhotoPlane(group, photo);
  }

  // Furniture (collidable unless very thin/flat, e.g. a rug)
  for (const f of room.furniture as FurniturePiece[]) {
    if (f.hideWhenDiscovered && isDiscovered(f.hideWhenDiscovered)) continue;
    const shape = f.shape ?? "box";
    const mat = new THREE.MeshStandardMaterial({
      color: f.color,
      roughness: f.roughness ?? 0.85,
      metalness: f.metalness ?? 0.05,
      emissive: f.emissiveIntensity ? new THREE.Color(f.color) : undefined,
      emissiveIntensity: f.emissiveIntensity ?? 0,
    });
    const mesh = addMesh(group, f.pos[0], f.pos[1], f.pos[2], f.size[0], f.size[1], f.size[2], mat, shape);
    if (f.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(f.rotationY);
    if (f.rotationX) mesh.rotation.x = THREE.MathUtils.degToRad(f.rotationX);
    if (!f.noCollide && f.size[1] > 0.1) {
      // Radial shapes report size[0] as a radius; approximate their footprint as a diameter square for collision.
      const footprintW = shape === "box" ? f.size[0] : f.size[0] * 2;
      const footprintD = shape === "box" ? f.size[2] : f.size[0] * 2;
      colliders.push(boxFromCenter(f.pos[0], f.pos[2], footprintW, footprintD));
    }
  }

  // Interactive markers (evidence + flavor + special actions)
  const markersByEvidenceId = new Map<string, THREE.Mesh>();
  for (const m of room.markers) {
    const discovered = m.evidenceId ? isDiscovered(m.evidenceId) : false;
    // Undiscovered evidence gets a low, warm glow that main.ts's render
    // loop pulses gently over time — a subtle "look here" cue so nothing
    // requires pixel-hunting. Discovered items get a steadier teal tint.
    // Flavor details and the desk action have no such cue; they're either
    // always available (the desk) or purely atmospheric (flavor).
    const undiscoveredEvidence = !!m.evidenceId && !discovered;
    // Signs (like door signs) get a steady low glow in their own color, no
    // pulse. The desk action is always available, never "found," but is
    // important enough to read as more than a plain prop, so it also gets a
    // steady (non-pulsing) glow instead of staying unlit like flavor props.
    const mat = new THREE.MeshStandardMaterial({
      color: m.color,
      roughness: m.isSign ? 0.45 : 0.7,
      metalness: m.isSign ? 0.35 : 0,
      emissive: m.isSign
        ? new THREE.Color(m.color)
        : discovered
          ? new THREE.Color("#3a6b5c")
          : undiscoveredEvidence
            ? new THREE.Color("#d9963f")
            : m.action === "desk"
              ? new THREE.Color(m.color)
              : new THREE.Color("#000000"),
      emissiveIntensity: m.isSign ? 0.12 : discovered ? 0.35 : undiscoveredEvidence ? 0.12 : m.action === "desk" ? 0.22 : 0,
    });
    const mesh = addMesh(group, m.pos[0], m.pos[1], m.pos[2], m.size[0], m.size[1], m.size[2], mat, m.shape ?? "box");
    if (m.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(m.rotationY);
    mesh.userData = {
      label: m.label,
      evidenceId: m.evidenceId,
      flavorId: m.flavorId,
      action: m.action,
      isSign: m.isSign,
      pulses: undiscoveredEvidence,
    };
    markerMeshes.push(mesh);
    if (m.evidenceId) markersByEvidenceId.set(m.evidenceId, mesh);
  }

  return { group, colliders, doorTriggers, markerMeshes, markersByEvidenceId };
}

export function setMarkerDiscovered(mesh: THREE.Mesh) {
  const mat = mesh.material as THREE.MeshStandardMaterial;
  mat.emissive = new THREE.Color("#3a6b5c");
  mat.emissiveIntensity = 0.35;
  mesh.userData.pulses = false;
}
