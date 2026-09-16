import type { FurniturePiece, Room3D } from "./types";
import { asset } from "../utils";

// Geometry only. Coordinates are room-local (each room is rebuilt fresh when
// entered): X = east(+)/west(-), Z = south(+)/north(-), Y = up. Doors carry
// the spawn point and facing angle the player lands at in the destination
// room.
//
// Four rooms — Reception (folds in the old Activity Room) and Storage
// (folds in the old Catalog Office) — after feedback that six separate
// rooms felt like too many to navigate. All 21 evidence items kept their
// content; only their physical room changed (AR-* and CO-* items moved
// into "reading" and "storage" respectively — see evidence.ts).
//
// yaw convention: matches THREE's camera.rotation.y directly (forward vector
// is (-sin(yaw), -cos(yaw))): 0 = facing north (-Z), 90 = west (-X),
// 180 = south (+Z), 270 = east (+X). (Not the more "intuitive" 90=east —
// verify any new yaw value against this formula, not against intuition.)
//
// Convention for arrival spawns: when a door lands the player in a room,
// they face AWAY from the wall they just came through (further into the
// room), never straight into it.

// ---- Reusable decorative helpers -------------------------------------
// So every light has a visible fixture instead of floating in midair, and
// so the opening moment can point the player at something concrete.

function pendantLamp(x: number, z: number, ceilingY: number, lightY: number, shadeColor: string, radius = 0.2): FurniturePiece[] {
  return [
    { pos: [x, ceilingY - 0.05, z], size: [0.12, 0.1, 0.12], color: "#241f19", shape: "cylinder", metalness: 0.4, roughness: 0.4, noCollide: true },
    { pos: [x, (ceilingY + lightY) / 2, z], size: [0.02, Math.max(ceilingY - lightY, 0.1), 0.02], color: "#241f19", shape: "cylinder", metalness: 0.5, noCollide: true },
    { pos: [x, lightY - 0.06, z], size: [radius, 0.22, radius], color: shadeColor, shape: "cone", roughness: 0.55, noCollide: true, emissiveIntensity: 0.5 },
  ];
}

function standLamp(x: number, z: number, baseY: number, lightY: number, shadeColor: string): FurniturePiece[] {
  return [
    { pos: [x, baseY + 0.03, z], size: [0.15, 0.06, 0.15], color: "#241f19", shape: "cylinder", metalness: 0.4, roughness: 0.4 },
    { pos: [x, (baseY + lightY) / 2, z], size: [0.025, Math.max(lightY - baseY, 0.1), 0.025], color: "#7a6042", shape: "cylinder", metalness: 0.3, noCollide: true },
    { pos: [x, lightY + 0.06, z], size: [0.19, 0.22, 0.19], color: shadeColor, shape: "cone", roughness: 0.6, noCollide: true, emissiveIntensity: 0.5 },
  ];
}

/** A short dashed line + arrowhead on the floor from (x,zFrom) toward (x,zTo), pointing north (-Z). Fades once `hideId` is discovered. */
function floorArrowNorth(x: number, zFrom: number, zTo: number, hideId: string): FurniturePiece[] {
  const dashes: FurniturePiece[] = [];
  const steps = 3;
  for (let i = 0; i < steps; i++) {
    const z = zFrom + ((zTo - zFrom) * (i + 0.5)) / (steps + 1);
    dashes.push({
      pos: [x, 0.03, z],
      size: [0.18, 0.03, 0.34],
      color: "#e8ac52",
      emissiveIntensity: 0.7,
      noCollide: true,
      hideWhenDiscovered: hideId,
    });
  }
  const headZ = zFrom + ((zTo - zFrom) * (steps + 0.75)) / (steps + 1);
  dashes.push({
    // A cone lying on its side, tip forward: rotate -90° around X so its
    // axis (normally +Y) points along -Z (north) instead of straight up.
    // Once rotated, the mesh's vertical extent is governed by its radius
    // (size[0]), not its height — so it sits on the floor at y = radius.
    pos: [x, 0.16, headZ],
    size: [0.16, 0.4, 0.16],
    color: "#e8ac52",
    shape: "cone",
    rotationX: -90,
    emissiveIntensity: 0.75,
    noCollide: true,
    hideWhenDiscovered: hideId,
  });
  return dashes;
}

export const ROOMS_3D: Record<string, Room3D> = {
  reading: {
    id: "reading",
    width: 12,
    depth: 15,
    height: 3.2,
    floorColor: "#4a3826",
    wallColor: "#3a2c1e",
    ceilingColor: "#2a2013",
    ambientColor: "#e8c99a",
    ambientIntensity: 2.2,
    lights: [
      { pos: [3.5, 1.7, 3], color: "#ffbb66", intensity: 14, distance: 8 },
      { pos: [0, 2.8, 5.5], color: "#fff2d9", intensity: 10, distance: 12 },
      { pos: [-4, 1.8, 6.5], color: "#ffcf8a", intensity: 8, distance: 6 },
      { pos: [0, 2.6, -3], color: "#f0dca0", intensity: 14, distance: 10 },
    ],
    furniture: [
      // --- Reception zone (south half, near spawn) ---
      { pos: [0, 0.45, 5.2], size: [0.55, 0.9, 0.4], color: "#4a3220", rotationY: 0 }, // welcome lectern
      { pos: [4.2, 0.4, 3], size: [2.2, 0.8, 1.0], color: "#5a4530" }, // writing desk
      { pos: [4.2, 0.91, 3.19], size: [0.3, 0.18, 0.05], color: "#efe6cf", rotationY: -10, noCollide: true }, // notebook pages, peeking from the cover
      { pos: [4.85, 0.95, 2.75], size: [0.03, 0.3, 0.03], color: "#3a2c1e", shape: "cylinder", noCollide: true }, // small sign post
      { pos: [-4, 0.35, 2], size: [1.2, 0.7, 0.8], color: "#5a4530" }, // side table (folder)
      { pos: [-4, 0.45, 5], size: [2.0, 0.9, 0.8], color: "#4a3220" }, // reception counter (duty log)
      { pos: [4, 0.45, 1.2], size: [0.9, 0.9, 0.7], color: "#5a4530" }, // cassette table
      { pos: [-4.6, 0.25, 6.6], size: [1.4, 0.5, 0.6], color: "#6f5a3c" }, // corner bench
      ...standLamp(4.6, 3.2, 0.8, 1.7, "#f0dca0"), // desk lamp
      ...pendantLamp(0, 5.5, 3.2, 2.8, "#f0dca0", 0.22), // reception pendant
      ...standLamp(-3.2, 6.8, 0, 1.8, "#f0dca0"), // floor lamp by the bench
      { pos: [5.2, 0.25, -0.5], size: [0.28, 0.5, 0.28], color: "#4a3220", shape: "cylinder" }, // plant pot
      { pos: [5.2, 0.75, -0.5], size: [0.38, 0.38, 0.38], color: "#4a5a2e", shape: "sphere", noCollide: true },
      ...floorArrowNorth(0, 6.3, 5.4, "RR-01"),
      // --- Activity zone (north half) ---
      { pos: [0, 0.35, -2.2], size: [3.5, 0.7, 1.0], color: "#5a4530" },
      { pos: [0, 0.35, -4.6], size: [3.5, 0.7, 1.0], color: "#5a4530" },
      { pos: [3.6, 0.4, -6], size: [0.8, 0.8, 0.6], color: "#4a3220" }, // note cabinet
      { pos: [-3.6, 0.4, -0.4], size: [0.5, 0.8, 0.5], color: "#5a4530" }, // sign-in stand
      ...pendantLamp(0, -3.4, 3.2, 2.7, "#f0dca0", 0.22),
      { pos: [-3.6, 0.25, -1.0], size: [0.22, 0.5, 0.22], color: "#6f5a3c", shape: "cylinder" }, // stool
      // Bare drawing pins left on the corkboard from papers long since taken down.
      { pos: [-3.8, 2.05, -1.0], size: [0.022, 0.022, 0.022], color: "#a83232", shape: "sphere", noCollide: true },
      { pos: [-3.8, 2.05, 0.2], size: [0.022, 0.022, 0.022], color: "#3a5aa8", shape: "sphere", noCollide: true },
      { pos: [-3.8, 0.95, -1.05], size: [0.022, 0.022, 0.022], color: "#c9a83a", shape: "sphere", noCollide: true },
      { pos: [-3.8, 0.95, 0.25], size: [0.022, 0.022, 0.022], color: "#3a7a4a", shape: "sphere", noCollide: true },
      { pos: [-3.8, 1.9, -0.75], size: [0.022, 0.022, 0.022], color: "#a83232", shape: "sphere", noCollide: true },
      { pos: [-3.8, 1.3, -0.7], size: [0.022, 0.022, 0.022], color: "#3a5aa8", shape: "sphere", noCollide: true },
      { pos: [-3.8, 2.0, -0.35], size: [0.022, 0.022, 0.022], color: "#c9a83a", shape: "sphere", noCollide: true },
      { pos: [-3.8, 1.1, 0.05], size: [0.022, 0.022, 0.022], color: "#a83232", shape: "sphere", noCollide: true },
    ],
    markers: [
      // Welcome book, right where the player is guided on waking up.
      { pos: [0, 0.95, 5.2], size: [0.35, 0.06, 0.26], color: "#e8dcc0", label: "A note, left open for you", evidenceId: "RR-01" },
      { pos: [4.2, 0.91, 3], size: [0.32, 0.22, 0.44], color: "#7a2f28", rotationY: -10, label: "Write the note — a notebook, always open to you", action: "desk" },
      { pos: [4.85, 1.22, 2.75], size: [0.34, 0.22, 0.04], color: "#c9963f", rotationY: -10, label: "Write your note here", isSign: true },
      { pos: [-4, 0.75, 2], size: [0.35, 0.05, 0.25], color: "#c9b48a", label: "Folder with your name on it", evidenceId: "RR-02" },
      { pos: [4, 0.95, 1.2], size: [0.5, 0.2, 0.4], color: "#241f19", label: "Reception cassette player", evidenceId: "RR-03" },
      { pos: [-4, 0.95, 5], size: [0.45, 0.1, 0.35], color: "#efe6cf", label: "Front desk duty log", evidenceId: "RR-04" },
      { pos: [-4.6, 0.55, 6.6], size: [1.2, 0.15, 0.5], color: "#7a6544", label: "The corner bench", evidenceId: "RR-05" },
      { pos: [-5.94, 1.8, 6.6], size: [0.06, 1.8, 2.0], color: "#c98a3a", label: "Reception window", flavorId: "flavor-rr-window" },
      { pos: [5.94, 1.6, 4.5], size: [0.06, 1.0, 0.7], color: "#7a6042", label: "Empty frame", flavorId: "flavor-rr-frame" },
      { pos: [-3.85, 1.5, -0.4], size: [0.06, 1.4, 1.6], color: "#8a7452", label: "Corkboard", flavorId: "flavor-ar-corkboard" },
      { pos: [-3.6, 1.6, -0.4], size: [0.4, 0.5, 0.06], color: "#efe6cf", label: "Activity schedule", evidenceId: "AR-01" },
      { pos: [-3.6, 0.85, -1.0], size: [0.35, 0.06, 0.25], color: "#ece3d0", label: "Session sign-in sheet", evidenceId: "AR-02" },
      { pos: [3.6, 0.85, -6], size: [0.3, 0.05, 0.22], color: "#e8dcc0", label: "Advance note from a parent", evidenceId: "AR-03" },
    ],
    doors: [
      { wall: "south", offset: 0, width: 1.6, height: 2.4, toRoom: "photograph", spawn: { x: 0, z: 2.5, yaw: 0 } },
      { wall: "east", offset: 0, width: 1.6, height: 2.4, toRoom: "listening", spawn: { x: -2.5, z: 0, yaw: 270 } },
      { wall: "west", offset: 0, width: 1.6, height: 2.4, toRoom: "storage", spawn: { x: 3.5, z: 0, yaw: 90 } },
    ],
    defaultSpawn: { x: 0, z: 6.5, yaw: 0 },
    canvasLabels: [
      {
        pos: [0, 0.982, 5.2],
        width: 0.3,
        height: 0.2,
        text: "START HERE",
        rotationX: -90,
        bg: "#e8dcc0",
        fg: "#7a2f28",
      },
    ],
    wallDiagrams: [
      {
        pos: [0, 1.7, -7.3],
        width: 3.6,
        height: 2.25,
        title: "People in This Story",
        nodes: [
          { id: "jamie", name: "You (Jamie)", subtitle: "eight years old, that day", x: 0.5, y: 0.55 },
          { id: "elena", name: "Elena", subtitle: "your mother", x: 0.2, y: 0.2 },
          { id: "grandma", name: "Grandmother", subtitle: "R. Cortez, listed contact", x: 0.8, y: 0.2 },
          { id: "mara", name: "Mara Doyle", subtitle: "ran the recording program", x: 0.5, y: 0.85 },
        ],
        edges: [
          { from: "jamie", to: "elena", label: "mother" },
          { from: "jamie", to: "grandma", label: "grandmother" },
          { from: "jamie", to: "mara", label: "program leader" },
        ],
      },
    ],
  },

  photograph: {
    id: "photograph",
    width: 8,
    depth: 7,
    height: 3.0,
    floorColor: "#33312a",
    wallColor: "#4a463c",
    ceilingColor: "#26241f",
    ambientColor: "#cfc9b8",
    ambientIntensity: 2.2,
    lights: [
      { pos: [-1, 2.6, -2.8], color: "#fff0d0", intensity: 9, distance: 7 },
      { pos: [3, 2.3, 1], color: "#f5e7c8", intensity: 7, distance: 6 },
    ],
    furniture: [
      { pos: [3.0, 0.5, 1.5], size: [1.4, 1.0, 0.8], color: "#5a4530" },
      { pos: [2.5, 0.6, 3], size: [0.5, 1.2, 0.5], color: "#8a7452" },
      { pos: [-2.5, 0.6, 3], size: [0.5, 1.2, 0.5], color: "#7a6544" },
      ...pendantLamp(-1, -2.8, 3.0, 2.6, "#fff0d0", 0.2),
      ...pendantLamp(3, 1, 3.0, 2.3, "#f5e7c8", 0.18),
      { pos: [-3.2, 0.3, -2.5], size: [0.3, 0.6, 0.3], color: "#4a463c", shape: "cylinder" },
    ],
    markers: [
      { pos: [-1.8, 1.5, -3.4], size: [0.9, 0.6, 0.08], color: "#3a2c1e", label: "Event photo, framed", evidenceId: "PR-01" },
      { pos: [-0.2, 1.5, -3.4], size: [0.9, 0.6, 0.08], color: "#3a2c1e", label: "Group activity photo", evidenceId: "PR-02" },
      { pos: [3.0, 0.55, 1.95], size: [0.5, 0.3, 0.1], color: "#efe6cf", label: "Contact sheet, in a drawer", evidenceId: "PR-03" },
      { pos: [-3.85, 1.6, 0], size: [0.06, 1.4, 1.2], color: "#5a564a", label: "Marks on the wallpaper", flavorId: "flavor-pr-wall" },
    ],
    doors: [{ wall: "south", offset: 0, width: 1.6, height: 2.4, toRoom: "reading", spawn: { x: 0, z: 6.5, yaw: 0 } }],
    defaultSpawn: { x: 0, z: 3, yaw: 0 },
    wallpaperMarks: [
      { pos: [-3.8, 1.6, 0], width: 1.2, height: 1.4, rotationY: 90, baseColor: "#4a463c" },
    ],
    photoPlanes: [
      { pos: [-1.8, 1.5, -3.35], width: 0.82, height: 0.52, src: asset("photos/pr01-event-photo.png") },
      { pos: [-0.2, 1.5, -3.35], width: 0.82, height: 0.52, src: asset("photos/pr02-group-activity-photo.png") },
    ],
  },

  listening: {
    id: "listening",
    width: 7,
    depth: 7,
    height: 3.0,
    floorColor: "#16262a",
    wallColor: "#1e2f30",
    ceilingColor: "#101c1f",
    ambientColor: "#5f7a7c",
    ambientIntensity: 1.9,
    lights: [{ pos: [0, 1.9, -1.0], color: "#ffcf8a", intensity: 11, distance: 6.5 }],
    furniture: [
      { pos: [0, 0.45, -1.0], size: [1.4, 0.9, 0.9], color: "#3a2c1e" },
      { pos: [-2.5, 1.0, -2.6], size: [1.0, 2.0, 0.5], color: "#5a4530" },
      { pos: [-2.0, 0.4, 0.8], size: [0.6, 0.8, 0.6], color: "#5a4530" },
      { pos: [0, 0.02, 0.6], size: [3.5, 0.02, 3.0], color: "#5a3336" },
      ...standLamp(0.95, -1.0, 0, 1.9, "#ffcf8a"),
    ],
    markers: [
      { pos: [0, 0.96, -1.0], size: [0.4, 0.15, 0.3], color: "#1b1410", label: "Listening station — master reel", evidenceId: "LR-01" },
      { pos: [-2.0, 0.85, 0.8], size: [0.3, 0.05, 0.25], color: "#e8dcc0", label: "Listening room log", evidenceId: "LR-02" },
      { pos: [-2.5, 1.65, -2.6], size: [0.9, 0.25, 0.4], color: "#7a6042", label: "Blank spine labels", flavorId: "flavor-lr-shelf" },
    ],
    doors: [{ wall: "west", offset: 0, width: 1.6, height: 2.4, toRoom: "reading", spawn: { x: 5, z: 0, yaw: 90 } }],
    defaultSpawn: { x: 2.5, z: 0, yaw: 90 },
  },

  storage: {
    id: "storage",
    width: 10,
    depth: 15,
    height: 3.2,
    floorColor: "#332c22",
    wallColor: "#3d342a",
    ceilingColor: "#241f19",
    ambientColor: "#9c8a68",
    ambientIntensity: 2.4,
    lights: [
      { pos: [0, 2.7, 4], color: "#f0dca0", intensity: 16, distance: 10 },
      { pos: [-3, 2.2, 6], color: "#e8c98a", intensity: 8, distance: 8 },
      { pos: [3, 2.0, 5], color: "#e8c98a", intensity: 8, distance: 8 },
      { pos: [0, 2.5, -3], color: "#f0dca0", intensity: 14, distance: 10 },
    ],
    furniture: [
      // --- Storage zone (south half, near spawn) ---
      { pos: [-3, 1.0, 6.2], size: [1.4, 2.0, 0.5], color: "#5a4530" },
      { pos: [0, 0.4, 4.5], size: [0.9, 0.8, 0.9], color: "#83693f" },
      { pos: [2.0, 0.4, 6], size: [0.7, 0.8, 0.6], color: "#5a4530" },
      { pos: [3.2, 0.35, 4], size: [0.7, 0.7, 0.7], color: "#75603d" },
      { pos: [-3.5, 0.5, 3.3], size: [1.0, 1.0, 1.0], color: "#9c7f52" },
      { pos: [-1, 0.9, 6.7], size: [1.6, 1.8, 1.0], color: "#6f5a3c" },
      { pos: [3.4, 0.7, 2.3], size: [1.2, 1.4, 1.0], color: "#7a6544" },
      { pos: [1.5, 0.4, 1.6], size: [0.16, 0.8, 0.16], color: "#5a3336", shape: "cylinder" },
      // --- Catalog zone (north half) ---
      { pos: [-2.5, 0.6, -5], size: [1.2, 1.2, 0.6], color: "#5a4530" },
      { pos: [2.5, 0.4, -5], size: [1.2, 0.8, 0.7], color: "#4a3220" },
      { pos: [0, 0.4, -1], size: [1.6, 0.8, 0.9], color: "#5a4530" },
      { pos: [3.3, 1.0, -2], size: [0.5, 1.6, 0.5], color: "#6f5a3c" },
      { pos: [3.0, 0.2, -3.8], size: [0.18, 0.4, 0.18], color: "#4a3220", shape: "cylinder" },
    ],
    markers: [
      { pos: [-3, 1.0, 6.45], size: [1.3, 1.8, 0.4], color: "#efe6cf", label: "Storage shelf C-2", evidenceId: "SR-04" },
      { pos: [2.0, 0.83, 6], size: [0.25, 0.05, 0.18], color: "#ece3d0", label: "Visitor sign-in log", evidenceId: "SR-01" },
      { pos: [3.2, 0.73, 4], size: [0.3, 0.06, 0.25], color: "#ece3d0", label: "Phone message slip", evidenceId: "SR-02" },
      { pos: [0, 0.85, 4.5], size: [0.35, 0.06, 0.28], color: "#f4ecd8", label: "Transit diversion notice", evidenceId: "SR-03" },
      { pos: [-3.0, 0.6, 3.3], size: [0.15, 0.35, 0.35], color: "#b89a68", label: "A box with two labels", flavorId: "flavor-sr-box" },
      { pos: [3.5, 0.02, 6.7], size: [0.6, 0.02, 1.0], color: "#3a3226", label: "Marks on the floor", flavorId: "flavor-sr-shelfmarks" },
      { pos: [-2.5, 1.05, -5], size: [0.3, 0.06, 0.22], color: "#efe6cf", label: "Catalog card — reel MC-0914", evidenceId: "CO-01" },
      { pos: [2.5, 0.85, -5], size: [0.35, 0.06, 0.25], color: "#f4ecd8", label: "Tape duplication record", evidenceId: "CO-02" },
      { pos: [0, 0.85, -1], size: [0.5, 0.06, 0.4], color: "#ece3d0", label: "Relocation inventory", evidenceId: "CO-03" },
      { pos: [3.3, 1.5, -2], size: [0.35, 0.4, 0.06], color: "#e8dcc0", label: "Archive policy memo", evidenceId: "CO-04" },
    ],
    doors: [{ wall: "east", offset: 0, width: 1.6, height: 2.4, toRoom: "reading", spawn: { x: -5, z: 0, yaw: 270 } }],
    defaultSpawn: { x: 0, z: 5, yaw: 0 },
  },
};

export function getRoom3D(id: string): Room3D {
  const room = ROOMS_3D[id];
  if (!room) throw new Error(`Unknown room id: ${id}`);
  return room;
}
