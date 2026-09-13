import type { Room } from "./types";

// Metadata only — geometry, furniture, and interactive markers for the 3D
// scenes live in rooms3d.ts, kept separate so this file stays about the
// writing (names, intro text) and can be edited without touching geometry.
//
// Four rooms (originally six — Activity folded into Reception, Catalog
// folded into Storage — merged per feedback that six felt like too many to
// navigate for a 10–15 room's-worth of content).
export const ROOMS: Room[] = [
  {
    id: "reading",
    name: "Reception & Activity Room",
    shortName: "Reception",
    intro:
      "The reception area still smells like the radiator, even though it's off for the summer. A bench sits under the window, its arm worn pale, the pane above it cracked and taped. Past the tables where the recording sessions used to happen, a corkboard still holds a schedule nobody's taken down. Somewhere in here is a folder with your name on it.",
  },
  {
    id: "photograph",
    name: "Photograph Gallery",
    shortName: "Gallery",
    intro:
      "A narrow gallery of a room, one long wall given over to framed prints from years of programs. Most are already wrapped in packing paper. A few are still up, waiting their turn.",
  },
  {
    id: "listening",
    name: "Listening Room",
    shortName: "Listening",
    intro:
      "A small, carpeted nook, built for headphones and quiet. A listening station sits under a reading lamp, and a shelf holds tape boxes going back further than you expected.",
  },
  {
    id: "storage",
    name: "Storage & Catalog Room",
    shortName: "Storage",
    intro:
      "Boxes, mostly, stacked higher than the shelving that used to hold them. Card drawers and binders are stacked along one wall, too — this is where the archive keeps track of itself, waiting for a truck in the morning. Somewhere in here is an ordinary Tuesday in September.",
  },
];

export function getRoom(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
