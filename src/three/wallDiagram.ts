import * as THREE from "three";
import type { CanvasLabel, PhotoPlane, WallDiagram, WallpaperMarks } from "../data/types";

const textureLoader = new THREE.TextureLoader();

// Purely decorative wall art: a diagram drawn onto a 2D canvas and applied as
// a texture on a flat plane. No raycast target, no "Press E" — the whole
// point is that it's readable just by looking, like a real board on a wall.
// Kept out of roomBuilder.ts's main loop since canvas drawing is a distinct
// concern from geometry/collision.

const CANVAS_W = 1024;
const CANVAS_H = 640;

function drawDiagram(ctx: CanvasRenderingContext2D, diagram: WallDiagram) {
  ctx.fillStyle = "#e7dcc3";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // A soft border, like a mounted board rather than a bare rectangle.
  ctx.strokeStyle = "#8a7452";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, CANVAS_W - 10, CANVAS_H - 10);

  ctx.fillStyle = "#3a2c1e";
  ctx.font = "bold 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(diagram.title, CANVAS_W / 2, 60);

  const nodeById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const margin = 90;
  const top = 110;
  const toPx = (nx: number, ny: number): [number, number] => [
    margin + nx * (CANVAS_W - margin * 2),
    top + ny * (CANVAS_H - top - 60),
  ];

  // Edges first, so node boxes sit on top of the lines.
  for (const edge of diagram.edges) {
    const a = nodeById.get(edge.from);
    const b = nodeById.get(edge.to);
    if (!a || !b) continue;
    const [ax, ay] = toPx(a.x, a.y);
    const [bx, by] = toPx(b.x, b.y);
    ctx.strokeStyle = "#6b5638";
    ctx.lineWidth = 3;
    ctx.setLineDash(edge.style === "dashed" ? [10, 8] : []);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#4a3826";
    ctx.font = "italic 20px Georgia, serif";
    ctx.textAlign = "center";
    const midX = (ax + bx) / 2;
    const midY = (ay + by) / 2;
    // Small backing so the label reads over the line.
    const labelW = ctx.measureText(edge.label).width + 16;
    ctx.fillStyle = "#e7dcc3";
    ctx.fillRect(midX - labelW / 2, midY - 15, labelW, 26);
    ctx.fillStyle = "#4a3826";
    ctx.fillText(edge.label, midX, midY + 5);
  }

  // Nodes on top.
  for (const node of diagram.nodes) {
    const [px, py] = toPx(node.x, node.y);
    const boxW = 190;
    const boxH = node.subtitle ? 62 : 44;
    ctx.fillStyle = "#3a2c1e";
    ctx.fillRect(px - boxW / 2, py - boxH / 2, boxW, boxH);
    ctx.strokeStyle = "#c9963f";
    ctx.lineWidth = 2;
    ctx.strokeRect(px - boxW / 2, py - boxH / 2, boxW, boxH);

    ctx.fillStyle = "#f0e6cf";
    ctx.font = "bold 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(node.name, px, py - (node.subtitle ? 6 : -8));
    if (node.subtitle) {
      ctx.fillStyle = "#cbb98a";
      ctx.font = "16px Georgia, serif";
      ctx.fillText(node.subtitle, px, py + 18);
    }
  }
}

export function buildWallDiagram(group: THREE.Group, diagram: WallDiagram) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d")!;
  drawDiagram(ctx, diagram);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.5,
    roughness: 0.9,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(diagram.width, diagram.height), mat);
  mesh.position.set(diagram.pos[0], diagram.pos[1], diagram.pos[2]);
  if (diagram.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(diagram.rotationY);
  group.add(mesh);
}

/** A short text label (e.g. "START HERE" printed on an object's surface), same technique as buildWallDiagram but for plain text on any face — not just walls, via the rotation fields. */
export function buildCanvasLabel(group: THREE.Group, label: CanvasLabel) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = label.bg ?? "#e8dcc0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = label.fg ?? "#3a2c1e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 72px Georgia, serif";
  ctx.fillText(label.text, canvas.width / 2, label.subtext ? canvas.height / 2 - 34 : canvas.height / 2);
  if (label.subtext) {
    ctx.font = "30px Georgia, serif";
    ctx.fillText(label.subtext, canvas.width / 2, canvas.height / 2 + 40);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.45,
    roughness: 0.9,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(label.width, label.height), mat);
  mesh.position.set(label.pos[0], label.pos[1], label.pos[2]);
  if (label.rotationX) mesh.rotation.x = THREE.MathUtils.degToRad(label.rotationX);
  if (label.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(label.rotationY);
  if (label.rotationZ) mesh.rotation.z = THREE.MathUtils.degToRad(label.rotationZ);
  group.add(mesh);
}

/** An aged-wallpaper patch with lighter rectangular "ghost" outlines where frames used to hang — makes a flavor description like "marks on the wallpaper" actually visible instead of just a flat color block. Purely decorative, not raycast-interactive; pair it with a matching InteractiveMarker at (roughly) the same spot for the "Press E" hitbox. */
export function buildWallpaperMarks(group: THREE.Group, marks: WallpaperMarks) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const base = marks.baseColor ?? "#4a463c";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint grain so it reads as an aged surface, not a flat digital fill.
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)";
    ctx.fillRect(x, y, 2, 2);
  }

  // Ghost rectangles: lighter than the surrounding wallpaper, where frames
  // protected the paper underneath from fading.
  const mark = marks.markColor ?? "#6d6a5a";
  ctx.fillStyle = mark;
  ctx.fillRect(canvas.width * 0.14, canvas.height * 0.12, canvas.width * 0.34, canvas.height * 0.4);
  ctx.fillRect(canvas.width * 0.56, canvas.height * 0.42, canvas.width * 0.3, canvas.height * 0.34);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(marks.width, marks.height), mat);
  mesh.position.set(marks.pos[0], marks.pos[1], marks.pos[2]);
  if (marks.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(marks.rotationY);
  group.add(mesh);
}

/** A real photo (loaded from EVIDENCE_PHOTOS), displayed directly on a plane in the 3D scene — meant to sit just in front of a matching InteractiveMarker's box, so the box reads as a picture frame around it. If the image fails to load, three.js just leaves the plane an untextured white — no crash, no visible error. */
export function buildPhotoPlane(group: THREE.Group, photo: PhotoPlane) {
  const texture = textureLoader.load(photo.src);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(photo.width, photo.height), mat);
  mesh.position.set(photo.pos[0], photo.pos[1], photo.pos[2]);
  if (photo.rotationY) mesh.rotation.y = THREE.MathUtils.degToRad(photo.rotationY);
  group.add(mesh);
}
