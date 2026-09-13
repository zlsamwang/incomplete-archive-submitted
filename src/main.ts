import "./style.css";
import {
  getState,
  resetState,
  discover,
  visitRoom,
  addConnection,
  removeConnection,
  toggleAccountOption,
  markAccountFinished,
  setMuted,
  setReducedMotion,
  setTextScale,
  setMouseSensitivity,
  setGraphicsQuality,
} from "./state";
import type { RoomId } from "./data/types";
import { getRoom } from "./data/rooms";
import { ACCOUNT_TOPICS } from "./data/account";
import { ui } from "./uiState";
import type { FocusedMarker } from "./uiState";
import { renderIntro } from "./views/intro";
import { renderTopbar } from "./views/room";
import { renderHud } from "./views/hud";
import { renderEvidenceModal, renderFlavorModal } from "./views/evidenceModal";
import { drawPhotoSketch } from "./views/photoSketch";
import { renderNotebook } from "./views/notebook";
import { renderDesk, renderEpilogue, renderAssembledModal, composeAccountPlainText } from "./views/desk";
import { renderSettings } from "./views/settings";
import { getRecording, getRecordingAudio, getRecordingAudioStart } from "./data/recording";
import { Engine, type MarkerInfo } from "./three/engine";
import * as audio from "./audio";

const app = document.getElementById("app")!;
app.innerHTML = `
  <div id="topbar-root"></div>
  <div id="scene-root" class="scene3d-wrap" hidden>
    <div id="scene3d-container" class="scene3d-container"></div>
    <div id="hud-root"></div>
    <div id="wake-caption-root"></div>
    <div id="wake-gate-root"></div>
  </div>
  <div id="intro-root"></div>
  <div id="overlay-root"></div>
  <div id="toast-root"></div>
`;
const topbarRoot = document.getElementById("topbar-root")!;
const sceneRoot = document.getElementById("scene-root")!;
const scene3dContainer = document.getElementById("scene3d-container")!;
const hudRoot = document.getElementById("hud-root")!;
const introRoot = document.getElementById("intro-root")!;
const overlayRoot = document.getElementById("overlay-root")!;
const toastRoot = document.getElementById("toast-root")!;
const wakeCaptionRoot = document.getElementById("wake-caption-root")!;
const wakeGateRoot = document.getElementById("wake-gate-root")!;

let engine: Engine | null = null;
let awaitingWake = false;

function applyGlobalPrefs() {
  const s = getState();
  document.documentElement.style.setProperty("--text-scale", String(s.textScale));
  document.body.classList.toggle("reduced-motion", s.reducedMotion);
  audio.initAudio(s.muted);
  audio.setMuted(s.muted);
  engine?.setReducedMotion(s.reducedMotion);
  engine?.setMouseSensitivity(s.mouseSensitivity);
  engine?.setGraphicsQuality(s.graphicsQuality);
}

function anyOverlayOpen(): boolean {
  return !!ui.modal || ui.notebookOpen || ui.settingsOpen || ui.deskOpen || ui.epilogueOpen;
}

function closeAllOverlaysExceptModal() {
  ui.notebookOpen = false;
  ui.settingsOpen = false;
  ui.deskOpen = false;
  ui.epilogueOpen = false;
}

function stopPlayback() {
  if (ui.playback.timerId !== null) window.clearTimeout(ui.playback.timerId);
  ui.playback = { playing: false, lineIndex: -1, timerId: null };
  audio.stopNarration();
}

function currentAudioSrc() {
  return ui.modal?.kind === "evidence" ? getRecordingAudio(ui.modal.id) : undefined;
}

/** Estimated real-time offset (seconds) at which `index` begins, from the cumulative `seconds` fields before it — used to sync/seek the optional narration audio. */
function cueSeconds(transcript: { seconds: number }[], index: number) {
  let total = 0;
  for (let i = 0; i < index; i++) total += transcript[i].seconds;
  return total;
}

/** Plays/seeks/silences the current recording's optional narration audio to match text line `index`, accounting for the audio file possibly starting partway through the transcript (see RECORDING_AUDIO_START). */
function syncNarrationTo(index: number) {
  const transcript = currentTranscript();
  const audioSrc = currentAudioSrc();
  if (!transcript || !audioSrc || ui.modal?.kind !== "evidence") return;
  const startIndex = getRecordingAudioStart(ui.modal.id);
  if (index < startIndex) {
    audio.stopNarration();
    return;
  }
  audio.playNarration(audioSrc);
  audio.seekNarration(cueSeconds(transcript, index) - cueSeconds(transcript, startIndex));
}

function ensureEngine() {
  if (engine) return engine;
  engine = new Engine(scene3dContainer, (id) => getState().discovered.includes(id));
  engine.onFocusChange = (info: MarkerInfo | null) => {
    ui.focusedMarker = info as FocusedMarker | null;
    renderHudOnly();
  };
  engine.onInteract = (info: MarkerInfo) => {
    if (info.evidenceId) openEvidence(info.evidenceId);
    else if (info.flavorId) openFlavor(info.flavorId);
    else if (info.action === "desk") openDesk();
  };
  engine.onDoorTrigger = (toRoom, spawn) => {
    engine!.loadRoom(toRoom, spawn);
    visitRoom(toRoom);
    showRoomBanner(toRoom);
    render();
  };
  engine.onPointerLockChange = (locked) => {
    ui.pointerLocked = locked;
    renderHudOnly();
  };
  engine.start();
  return engine;
}

function showRoomBanner(roomId: RoomId) {
  const room = getRoom(roomId);
  if (!room) return;
  const token = Date.now();
  ui.roomBanner = { text: room.intro, token };
  window.setTimeout(() => {
    if (ui.roomBanner?.token === token) {
      ui.roomBanner = null;
      renderHudOnly();
    }
  }, 5200);
}

function renderHudOnly() {
  if (ui.screen === "game") hudRoot.innerHTML = renderHud();
}

function render() {
  applyGlobalPrefs();

  if (ui.screen === "intro") {
    sceneRoot.hidden = true;
    topbarRoot.innerHTML = "";
    introRoot.innerHTML = renderIntro();
    overlayRoot.innerHTML = "";
    toastRoot.innerHTML = "";
    return;
  }

  introRoot.innerHTML = "";
  sceneRoot.hidden = false;
  topbarRoot.innerHTML = renderTopbar();
  hudRoot.innerHTML = renderHud();

  const overlayOpen = anyOverlayOpen();
  engine?.setPaused(overlayOpen || !!ui.modal || awaitingWake);

  let overlayHtml = "";
  if (ui.settingsOpen) overlayHtml = `<div class="overlay" data-action="overlay-backdrop">${renderSettings()}</div>`;
  else if (ui.notebookOpen) overlayHtml = `<div class="overlay" data-action="overlay-backdrop">${renderNotebook()}</div>`;
  else if (ui.deskOpen) overlayHtml = `<div class="overlay" data-action="overlay-backdrop">${renderDesk()}</div>`;
  else if (ui.epilogueOpen) overlayHtml = `<div class="overlay" data-action="overlay-backdrop">${renderEpilogue()}</div>`;

  if (ui.modal) {
    let inner = "";
    if (ui.modal.kind === "evidence") inner = renderEvidenceModal(ui.modal.id);
    else if (ui.modal.kind === "flavor") inner = renderFlavorModal(ui.modal.id);
    else if (ui.modal.kind === "assembled") inner = renderAssembledModal();
    overlayHtml += `<div class="overlay" data-action="overlay-backdrop">${inner}</div>`;
  }
  overlayRoot.innerHTML = overlayHtml;
  overlayRoot.querySelectorAll<HTMLCanvasElement>("canvas[data-sketch]").forEach((canvas) => {
    drawPhotoSketch(canvas, canvas.dataset.sketch!);
  });

  toastRoot.innerHTML = ui.toast ? `<div class="toast" role="status">${ui.toast.text}</div>` : "";

  const firstFocusable = overlayRoot.querySelector<HTMLElement>(".panel button, .panel input, .panel select");
  if ((ui.modal || overlayOpen) && firstFocusable) {
    if (document.activeElement === document.body) firstFocusable.focus();
  }
}

function showToast(text: string) {
  const token = Date.now();
  ui.toast = { text, token };
  render();
  window.setTimeout(() => {
    if (ui.toast?.token === token) {
      ui.toast = null;
      render();
    }
  }, 2400);
}

function openEvidence(id: string) {
  discover(id);
  stopPlayback();
  ui.modal = { kind: "evidence", id };
  engine?.markDiscovered(id);
  render();
}

function openFlavor(id: string) {
  ui.modal = { kind: "flavor", id };
  render();
}

function openDesk() {
  closeAllOverlaysExceptModal();
  ui.deskOpen = true;
  render();
}

function currentTranscript() {
  return ui.modal?.kind === "evidence" ? getRecording(ui.modal.id) : undefined;
}

function playNextLine() {
  const transcript = currentTranscript();
  if (!transcript) return;
  const p = ui.playback;
  const nextIndex = p.lineIndex + 1;
  if (nextIndex >= transcript.length) {
    ui.playback = { playing: false, lineIndex: transcript.length - 1, timerId: null };
    render();
    return;
  }
  ui.playback.lineIndex = nextIndex;
  if (ui.modal?.kind === "evidence" && nextIndex === getRecordingAudioStart(ui.modal.id)) {
    syncNarrationTo(nextIndex);
  }
  render();
  const delay = transcript[nextIndex].seconds * (getState().reducedMotion ? 200 : 900);
  ui.playback.timerId = window.setTimeout(playNextLine, delay);
}

function handleRecordingPlay() {
  const transcript = currentTranscript();
  if (!transcript) return;
  if (ui.playback.lineIndex >= transcript.length - 1) ui.playback.lineIndex = -1;
  ui.playback.playing = true;
  syncNarrationTo(ui.playback.lineIndex + 1);
  playNextLine();
}

function handleRecordingPause() {
  if (ui.playback.timerId !== null) window.clearTimeout(ui.playback.timerId);
  ui.playback.playing = false;
  ui.playback.timerId = null;
  audio.pauseNarration();
  render();
}

function handleRecordingRestart() {
  stopPlayback();
  render();
}

const WAKE_LINES = ["Am I missing a meeting?", "Where is my mom?", "Where am I?"];
const WAKE_LINE_MS = 2000;

function playWakeEffect() {
  // A brief "coming to" moment on first entering the archive — the view
  // stays blurred and dark through a few half-formed, disoriented
  // thoughts, then clears once they're done. Skipped entirely under
  // reduced motion, since it carries no information the rest of the game
  // doesn't already give plainly.
  if (getState().reducedMotion) return;
  scene3dContainer.classList.add("waking");
  void scene3dContainer.offsetWidth; // force layout so the blurred state actually paints first
  window.setTimeout(() => scene3dContainer.classList.remove("waking"), WAKE_LINES.length * WAKE_LINE_MS);

  WAKE_LINES.forEach((line, i) => {
    window.setTimeout(() => {
      wakeCaptionRoot.innerHTML = `<div class="wake-caption" style="animation-duration:${WAKE_LINE_MS}ms" aria-live="polite">${line}</div>`;
    }, i * WAKE_LINE_MS);
  });
  window.setTimeout(() => {
    wakeCaptionRoot.innerHTML = "";
  }, WAKE_LINES.length * WAKE_LINE_MS);
}

function showWakeGate() {
  awaitingWake = true;
  engine?.setPaused(true);
  wakeGateRoot.innerHTML = `<div class="wake-gate"><span class="wake-gate-text" aria-live="polite">Press <kbd>E</kbd> to wake up.</span></div>`;
}

function dismissWakeGate() {
  if (!awaitingWake) return;
  awaitingWake = false;
  wakeGateRoot.innerHTML = "";
  engine?.setPaused(false);
  playWakeEffect();
}

function startGame() {
  ui.screen = "game";
  render(); // unhide the scene container first so it has a real, non-zero layout size
  const isFirstStart = !engine;
  const eng = ensureEngine();
  eng.refreshSize();
  eng.loadRoom(getState().currentRoom);
  if (isFirstStart) showWakeGate();
}

document.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action!;

  audio.startAmbience();
  audio.startMusic();

  switch (action) {
    case "start-game": {
      startGame();
      break;
    }
    case "back-to-title": {
      stopPlayback();
      closeAllOverlaysExceptModal();
      ui.modal = null;
      ui.screen = "intro";
      render();
      break;
    }
    case "reset-confirm": {
      if (window.confirm("Reset all progress? This clears everything you've found and written.")) {
        resetState();
        closeAllOverlaysExceptModal();
        ui.modal = null;
        ui.screen = "intro";
        render();
      }
      break;
    }
    case "goto-room": {
      const roomId = target.dataset.room as RoomId;
      engine?.loadRoom(roomId);
      visitRoom(roomId);
      showRoomBanner(roomId);
      render();
      break;
    }
    case "open-evidence": {
      openEvidence(target.dataset.id!);
      break;
    }
    case "open-flavor": {
      openFlavor(target.dataset.id!);
      break;
    }
    case "open-desk": {
      openDesk();
      break;
    }
    case "close-modal": {
      stopPlayback();
      ui.modal = null;
      const dialog = target.closest('[role="dialog"]');
      const headingId = dialog?.getAttribute("aria-labelledby");
      if (headingId === "settings-title") ui.settingsOpen = false;
      if (headingId === "notebook-title") ui.notebookOpen = false;
      if (headingId === "desk-title") ui.deskOpen = false;
      if (headingId === "epilogue-title") ui.epilogueOpen = false;
      render();
      break;
    }
    case "overlay-backdrop": {
      if (e.target === target) {
        stopPlayback();
        if (ui.modal) ui.modal = null;
        else closeAllOverlaysExceptModal();
        render();
      }
      break;
    }
    case "open-notebook": {
      closeAllOverlaysExceptModal();
      ui.notebookOpen = true;
      render();
      break;
    }
    case "open-settings": {
      closeAllOverlaysExceptModal();
      ui.settingsOpen = true;
      render();
      break;
    }
    case "notebook-tab": {
      ui.notebookTab = target.dataset.tab as any;
      render();
      break;
    }
    case "toggle-mute": {
      setMuted(!getState().muted);
      render();
      break;
    }
    case "toggle-reduced-motion": {
      setReducedMotion(!getState().reducedMotion);
      render();
      break;
    }
    case "set-text-scale": {
      setTextScale(parseFloat(target.dataset.scale!));
      render();
      break;
    }
    case "set-graphics-quality": {
      setGraphicsQuality(target.dataset.quality as "standard" | "high");
      render();
      break;
    }
    case "account-choose": {
      const topic = target.dataset.topic!;
      const option = target.dataset.option!;
      const multiSelect = !!ACCOUNT_TOPICS.find((t) => t.id === topic)?.multiSelect;
      toggleAccountOption(topic, option, multiSelect);
      render();
      break;
    }
    case "open-assembled": {
      ui.modal = { kind: "assembled" };
      render();
      break;
    }
    case "copy-note": {
      const text = composeAccountPlainText();
      navigator.clipboard
        ?.writeText(text)
        .then(() => showToast("Note copied to clipboard."))
        .catch(() => showToast("Couldn't copy automatically — select the text and copy it manually."));
      break;
    }
    case "download-note": {
      const text = composeAccountPlainText();
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "archive-note.txt";
      a.click();
      URL.revokeObjectURL(url);
      break;
    }
    case "flip-evidence": {
      const evId = target.dataset.id!;
      ui.flippedEvidence = { ...ui.flippedEvidence, [evId]: !ui.flippedEvidence[evId] };
      render();
      break;
    }
    case "reveal-hint": {
      const discId = target.dataset.id!;
      const current = ui.hintsRevealed[discId] ?? 0;
      ui.hintsRevealed = { ...ui.hintsRevealed, [discId]: Math.min(3, current + 1) };
      render();
      break;
    }
    case "recording-jump": {
      const idx = parseInt(target.dataset.index!, 10);
      if (ui.playback.timerId !== null) window.clearTimeout(ui.playback.timerId);
      ui.playback.lineIndex = idx - 1;
      ui.playback.playing = true;
      syncNarrationTo(idx);
      playNextLine();
      break;
    }
    case "finish-account": {
      markAccountFinished();
      ui.deskOpen = false;
      ui.epilogueOpen = true;
      render();
      break;
    }
    case "remove-connection": {
      removeConnection(parseInt(target.dataset.index!, 10));
      render();
      break;
    }
    case "recording-play":
      handleRecordingPlay();
      break;
    case "recording-pause":
      handleRecordingPause();
      break;
    case "recording-restart":
      handleRecordingRestart();
      break;
  }
});

document.addEventListener("change", (e) => {
  const target = e.target as HTMLElement;
  if (target.dataset.action === "compare-select") {
    const slot = parseInt(target.dataset.slot!, 10) as 0 | 1;
    const value = (target as HTMLSelectElement).value || null;
    const next: [string | null, string | null] = [...ui.compareSelection];
    next[slot] = value;
    ui.compareSelection = next;
    render();
  } else if (target.dataset.action === "set-mouse-sensitivity") {
    setMouseSensitivity(parseFloat((target as HTMLInputElement).value));
    render();
  }
});

document.addEventListener("submit", (e) => {
  const form = e.target as HTMLFormElement;
  if (form.dataset.action === "save-connection-form") {
    e.preventDefault();
    const [a, b] = ui.compareSelection;
    if (a && b) {
      const note = (new FormData(form).get("note") as string) || "";
      addConnection(a, b, note.trim());
      showToast("Connection marked in your notebook.");
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (awaitingWake) {
    if (e.code === "KeyE" || e.code === "Enter") dismissWakeGate();
    return;
  }
  if (e.key === "Escape") {
    if (ui.modal) {
      stopPlayback();
      ui.modal = null;
      render();
    } else if (ui.notebookOpen || ui.settingsOpen || ui.deskOpen || ui.epilogueOpen) {
      closeAllOverlaysExceptModal();
      render();
    }
  }
});

render();
