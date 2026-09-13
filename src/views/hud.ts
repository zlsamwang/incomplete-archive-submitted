import { ui } from "../uiState";
import { escapeHtml } from "../utils";

export function renderHud(): string {
  const overlayOpen = !!ui.modal || ui.notebookOpen || ui.settingsOpen || ui.deskOpen || ui.epilogueOpen;
  const marker = ui.focusedMarker;

  const promptHtml =
    marker && !overlayOpen
      ? marker.isSign
        ? `<div class="interact-prompt sign-prompt">${escapeHtml(marker.label)}</div>`
        : `<div class="interact-prompt">Press <kbd>E</kbd> to inspect &mdash; ${escapeHtml(marker.label)}</div>`
      : "";

  const lockHintHtml =
    !ui.pointerLocked && !overlayOpen
      ? `<div class="lock-hint">Click to look around &middot; WASD or Arrow keys to move &middot; Arrow Left/Right or mouse to turn &middot; E to interact</div>`
      : "";

  const bannerHtml = ui.roomBanner && !overlayOpen ? `<div class="room-banner">${escapeHtml(ui.roomBanner.text)}</div>` : "";

  return `
    <div class="crosshair" aria-hidden="true"></div>
    ${promptHtml}
    ${lockHintHtml}
    ${bannerHtml}
  `;
}
