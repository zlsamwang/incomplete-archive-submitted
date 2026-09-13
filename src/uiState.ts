// Transient, per-session UI state — never persisted. Save/reset only touches
// src/state.ts (the actual game progress).

export type ModalState =
  | { kind: "evidence"; id: string }
  | { kind: "flavor"; id: string }
  | { kind: "assembled" }
  | null;

export type NotebookTab = "evidence" | "compare" | "connections" | "discoveries" | "timeline";

export interface RecordingPlayback {
  playing: boolean;
  lineIndex: number;
  timerId: number | null;
}

export interface FocusedMarker {
  label: string;
  evidenceId?: string;
  flavorId?: string;
  action?: "desk";
  isSign?: boolean;
}

export interface UiState {
  screen: "intro" | "game";
  modal: ModalState;
  notebookOpen: boolean;
  notebookTab: NotebookTab;
  compareSelection: [string | null, string | null];
  settingsOpen: boolean;
  deskOpen: boolean;
  epilogueOpen: boolean;
  playback: RecordingPlayback;
  toast: { text: string; token: number } | null;
  focusedMarker: FocusedMarker | null;
  pointerLocked: boolean;
  roomBanner: { text: string; token: number } | null;
  /** How many hint tiers (0–3) have been revealed per discovery id. */
  hintsRevealed: Record<string, number>;
  /** Which evidence items are currently showing their back side. */
  flippedEvidence: Record<string, boolean>;
}

export const ui: UiState = {
  screen: "intro",
  modal: null,
  notebookOpen: false,
  notebookTab: "evidence",
  compareSelection: [null, null],
  settingsOpen: false,
  deskOpen: false,
  epilogueOpen: false,
  playback: { playing: false, lineIndex: -1, timerId: null },
  toast: null,
  focusedMarker: null,
  pointerLocked: false,
  roomBanner: null,
  hintsRevealed: {},
  flippedEvidence: {},
};
