// Shared data model for the game. Keeping story content (src/data/*) separate
// from rendering code (src/ui/*) so the writing can be edited without touching
// interaction logic, and vice versa.

export type RoomId = "reading" | "photograph" | "listening" | "storage";

export type Medium =
  | "note"
  | "photograph"
  | "document"
  | "recording"
  | "ledger"
  | "object";

export interface Evidence {
  id: string;
  title: string;
  room: RoomId;
  medium: Medium;
  /** Short line shown on the hotspot / notebook list. */
  summary: string;
  /** Full visible content the player reads when they inspect the item. */
  content: string[];
  /** Specific, concrete things a careful look reveals — not new content, but framing. */
  details: string[];
  /** IDs of other evidence this item meaningfully relates to. */
  connections: string[];
  /** Plain statements the surviving material actually supports. */
  establishes: string[];
  /** Statements the material hints at but does not prove. */
  suggests: string[];
  /** For items with a clock time attached to the day in question, used by the notebook's Timeline tab. */
  time?: { label: string; sortKey: number };
  /** Content on the reverse side, for documents with something written on the back ("Turn over"). */
  backContent?: string[];
}

export interface FlavorDetail {
  id: string;
  room: RoomId;
  label: string;
  text: string;
}

export interface Room {
  id: RoomId;
  name: string;
  shortName: string;
  intro: string;
}

// --------------------------------------------------------------- 3D scene data
// Coordinates are room-local: X = width (east+), Z = depth (north-), Y = up.
// Each room is rebuilt fresh when entered, so coordinates never need to
// share a single world space across rooms.

export type Wall = "north" | "south" | "east" | "west";

export type Shape = "box" | "cylinder" | "sphere" | "cone";

export interface FurniturePiece {
  pos: [number, number, number];
  /** For box: [width, height, depth]. For cylinder/cone: [radius, height, radius] (radius reused for both entries). For sphere: [radius, radius, radius]. */
  size: [number, number, number];
  color: string;
  rotationY?: number;
  /** Tilts the piece around the X axis — used to lay a cone on its side, e.g. for a floor arrowhead that should point forward rather than straight up. */
  rotationX?: number;
  /** Defaults to "box" — set to vary the room's silhouette beyond flat-sided furniture. */
  shape?: Shape;
  roughness?: number;
  metalness?: number;
  /** Self-illumination independent of the room's ambient tint — use for lampshades/bulbs so they read as warm even in a cool-ambient room. */
  emissiveIntensity?: number;
  /** Skip the automatic floor collider — for anything mounted above head height (pendant lamps, wall fixtures) that shouldn't block movement underneath it. */
  noCollide?: boolean;
  /** Omit this piece entirely once the given evidence id has been found — for guidance decor (e.g. floor arrows) that should fade once its purpose is served. */
  hideWhenDiscovered?: string;
}

export interface InteractiveMarker {
  pos: [number, number, number];
  size: [number, number, number];
  label: string;
  color: string;
  evidenceId?: string;
  flavorId?: string;
  action?: "desk";
  rotationY?: number;
  shape?: Shape;
  /** Non-interactive signage (like a door label): shows a plain hover label, no "Press E", never counts as evidence/flavor/action. */
  isSign?: boolean;
}

export interface DoorDef {
  wall: Wall;
  /** Offset of the doorway's center along the wall, from the wall's own center. */
  offset: number;
  width: number;
  height: number;
  toRoom: RoomId;
  spawn: { x: number; z: number; yaw: number };
}

export interface PointLightDef {
  pos: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
}

export interface Room3D {
  id: RoomId;
  width: number;
  depth: number;
  height: number;
  floorColor: string;
  wallColor: string;
  ceilingColor: string;
  ambientColor: string;
  ambientIntensity: number;
  lights: PointLightDef[];
  furniture: FurniturePiece[];
  markers: InteractiveMarker[];
  doors: DoorDef[];
  defaultSpawn: { x: number; z: number; yaw: number };
  /** Purely visual wall-mounted diagrams (e.g. a cast-of-characters board), drawn on a canvas texture. No interaction, no "Press E" — always readable just by looking. */
  wallDiagrams?: WallDiagram[];
  /** Purely visual short text labels (e.g. "START HERE" printed on an object), drawn on a canvas texture. No interaction, no "Press E" — always readable just by looking. */
  canvasLabels?: CanvasLabel[];
  /** Purely visual aged-wallpaper patches with lighter "ghost" rectangles where frames used to hang, drawn on a canvas texture — layered in front of a matching flavor marker so the described detail is actually visible, not just described. */
  wallpaperMarks?: WallpaperMarks[];
  /** A real photo (from EVIDENCE_PHOTOS) displayed directly in the 3D scene, layered in front of a matching InteractiveMarker so the marker's box reads as a frame around it. Purely visual, not raycast-interactive. */
  photoPlanes?: PhotoPlane[];
}

export interface PhotoPlane {
  pos: [number, number, number];
  width: number;
  height: number;
  rotationY?: number;
  src: string;
}

export interface WallpaperMarks {
  pos: [number, number, number];
  width: number;
  height: number;
  rotationY?: number;
  baseColor?: string;
  markColor?: string;
}

export interface CanvasLabel {
  pos: [number, number, number];
  width: number;
  height: number;
  text: string;
  subtext?: string;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  bg?: string;
  fg?: string;
}

export interface RelationshipNode {
  id: string;
  name: string;
  subtitle?: string;
  /** Normalized 0-1 position within the diagram's canvas. */
  x: number;
  y: number;
}

export interface RelationshipEdge {
  from: string;
  to: string;
  label: string;
  style?: "solid" | "dashed";
}

export interface WallDiagram {
  pos: [number, number, number];
  width: number;
  height: number;
  rotationY?: number;
  title: string;
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

export interface RecordingLine {
  speaker: string;
  text: string;
  /** Approximate seconds this line takes to say aloud, used to pace the text-playback. */
  seconds: number;
}

export interface RecordingSegment {
  label: string;
  lineIndex: number;
}

export type AccountOptionKind = "fact" | "interpretation" | "overreach" | "unresolved" | "omit";

export interface AccountOption {
  id: string;
  kind: AccountOptionKind;
  /** Sentence(s) inserted into the final paragraph if chosen. Omit has none. */
  sentence?: string;
  /** Evidence IDs a reader can inspect to verify a fact option. */
  citesEvidence?: string[];
  /** Shown when the player selects (or hovers) an overreach option, before committing. */
  gapNote?: string;
  /** Evidence that must be discovered before this option is available. */
  requiresEvidence?: string[];
}

export interface AccountTopic {
  id: string;
  title: string;
  prompt: string;
  options: AccountOption[];
  /** When true, more than one option may be selected at once (e.g. combinable feelings). */
  multiSelect?: boolean;
}
