import type { FlavorDetail } from "./types";

// Small environmental details — not evidence, not tracked in the notebook.
// These exist to make the rooms feel lived-in, per the brief's note about
// an empty frame, marks where shelves stood, or a box with two labels.
export const FLAVOR: FlavorDetail[] = [
  {
    id: "flavor-rr-frame",
    room: "reading",
    label: "Empty frame by the door",
    text: "An empty frame hangs by the door, glass intact, backing board bare. No one has written down what it used to hold.",
  },
  {
    id: "flavor-rr-window",
    room: "reading",
    label: "The reception window",
    text: "A tall window over the corner bench. One pane, upper right, has a long diagonal crack, taped over from the inside — it has looked like this for years.",
  },
  {
    id: "flavor-ar-corkboard",
    room: "reading",
    label: "Corkboard",
    text: "A corkboard thick with drawing pins and the ghosts of paper long since taken down. Only the current schedule is still pinned up straight.",
  },
  {
    id: "flavor-pr-wall",
    room: "photograph",
    label: "Marks on the wallpaper",
    text: "Faint rectangular outlines on the wallpaper, lighter than the paper around them, where other frames hung for a long time before someone took them down.",
  },
  {
    id: "flavor-lr-shelf",
    room: "listening",
    label: "Blank spine labels",
    text: "A row of blank adhesive labels on the tape shelf, cut and ready, waiting for handwriting that never arrived.",
  },
  {
    id: "flavor-sr-box",
    room: "storage",
    label: "A box with two labels",
    text: "A packing box has two labels, one peeling under the other. Underneath, in pencil, faded: “DO NOT DISCARD.” On top, printed and new: “RELOCATE — PRIORITY 2.”",
  },
  {
    id: "flavor-sr-shelfmarks",
    room: "storage",
    label: "Marks on the floor",
    text: "Four rectangular dust-free patches on the floor, evenly spaced, where a shelving unit stood until recently.",
  },
];

export function getFlavor(id: string): FlavorDetail | undefined {
  return FLAVOR.find((f) => f.id === id);
}
