import type { RoomId } from "./data/types";

const SAVE_KEY = "incomplete-archive:save:v1";

export interface Connection {
  a: string;
  b: string;
  note: string;
}

export interface GameState {
  discovered: string[];
  visitedRooms: RoomId[];
  connections: Connection[];
  /** Topic id -> selected option ids. Single-select topics hold at most one; multiSelect topics may hold several. */
  accountSelections: Record<string, string[]>;
  accountFinishedOnce: boolean;
  currentRoom: RoomId;
  muted: boolean;
  reducedMotion: boolean;
  textScale: number; // 1 = default, 1.15, 1.3
  mouseSensitivity: number; // 0.5 - 2.0, multiplier on the base sensitivity
  graphicsQuality: "standard" | "high";
}

function defaultState(): GameState {
  return {
    discovered: [],
    visitedRooms: [],
    connections: [],
    accountSelections: {},
    accountFinishedOnce: false,
    currentRoom: "reading",
    muted: false,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    textScale: 1,
    mouseSensitivity: 1,
    graphicsQuality: "high",
  };
}

let state: GameState = load();

function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota) — game still works, just won't persist.
  }
}

export function getState(): Readonly<GameState> {
  return state;
}

export function resetState() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
  state = defaultState();
  persist();
}

export function discover(id: string) {
  if (!state.discovered.includes(id)) {
    state.discovered = [...state.discovered, id];
    persist();
  }
}

export function isDiscovered(id: string): boolean {
  return state.discovered.includes(id);
}

export function visitRoom(id: RoomId) {
  state.currentRoom = id;
  if (!state.visitedRooms.includes(id)) {
    state.visitedRooms = [...state.visitedRooms, id];
  }
  persist();
}

export function addConnection(a: string, b: string, note: string) {
  state.connections = [...state.connections, { a, b, note }];
  persist();
}

export function removeConnection(index: number) {
  state.connections = state.connections.filter((_, i) => i !== index);
  persist();
}

export function getAccountSelections(topicId: string): string[] {
  const v = state.accountSelections[topicId];
  return Array.isArray(v) ? v : [];
}

export function toggleAccountOption(topicId: string, optionId: string, multiSelect: boolean) {
  const current = getAccountSelections(topicId);
  let next: string[];
  if (multiSelect) {
    next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
  } else {
    next = current.includes(optionId) ? [] : [optionId];
  }
  state.accountSelections = { ...state.accountSelections, [topicId]: next };
  persist();
}

export function markAccountFinished() {
  state.accountFinishedOnce = true;
  persist();
}

export function setMuted(muted: boolean) {
  state.muted = muted;
  persist();
}

export function setReducedMotion(value: boolean) {
  state.reducedMotion = value;
  persist();
}

export function setTextScale(value: number) {
  state.textScale = value;
  persist();
}

export function setMouseSensitivity(value: number) {
  state.mouseSensitivity = value;
  persist();
}

export function setGraphicsQuality(value: "standard" | "high") {
  state.graphicsQuality = value;
  persist();
}

