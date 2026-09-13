import { ROOMS } from "../data/rooms";
import { getState, isDiscovered } from "../state";
import { escapeHtml } from "../utils";
import { DISCOVERIES } from "../data/discoveries";
import { EVIDENCE } from "../data/evidence";

function unlockedDiscoveryCount(): number {
  return DISCOVERIES.filter((d) => d.requires.every((id) => isDiscovered(id))).length;
}

export function renderTopbar(): string {
  const state = getState();
  const discCount = unlockedDiscoveryCount();
  return `
  <header class="topbar">
    <span class="game-title">The Incomplete Archive</span>
    <nav class="room-nav" aria-label="Rooms">
      ${ROOMS.map(
        (r) => `
        <button class="room-tab" data-action="goto-room" data-room="${r.id}" aria-current="${r.id === state.currentRoom}">
          ${escapeHtml(r.shortName)}
        </button>`
      ).join("")}
    </nav>
    <div class="topbar-actions">
      <button class="icon-btn has-badge" data-action="open-notebook">
        Notebook (${state.discovered.length}/${EVIDENCE.length})
        ${discCount > 0 ? '<span class="badge-dot" aria-hidden="true"></span>' : ""}
      </button>
      <button class="icon-btn" data-action="toggle-mute">${state.muted ? "Unmute" : "Mute"}</button>
      <button class="icon-btn" data-action="open-settings">Settings</button>
    </div>
  </header>`;
}
