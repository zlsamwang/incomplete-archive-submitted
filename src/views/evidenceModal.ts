import { getEvidence, getEvidencePhoto } from "../data/evidence";
import { getFlavor } from "../data/flavor";
import { getRoom } from "../data/rooms";
import { getRecording, getSegments } from "../data/recording";
import { isDiscovered } from "../state";
import { ui } from "../uiState";
import { escapeHtml, paragraphs } from "../utils";

const MEDIUM_LABEL: Record<string, string> = {
  note: "Handwritten note",
  photograph: "Photograph",
  document: "Document",
  recording: "Recording",
  ledger: "Ledger / catalog",
  object: "Object",
};

function renderRecordingBlock(evidenceId: string): string {
  const transcript = getRecording(evidenceId);
  if (!transcript) return "";
  const playback = ui.playback;
  const total = transcript.length;
  const progressPct = playback.lineIndex < 0 ? 0 : Math.min(100, ((playback.lineIndex + 1) / total) * 100);
  const segments = getSegments(evidenceId);

  const lines = transcript.map((line, i) => {
    const active = i <= playback.lineIndex;
    return `<div class="transcript-line ${active ? "active" : ""}">
      <span class="speaker">${escapeHtml(line.speaker)}</span>${escapeHtml(line.text)}
    </div>`;
  }).join("");

  const segmentHtml = segments
    ? `<div class="segment-nav">
        <span class="label">Jump to:</span>
        ${segments
          .map((s) => `<button class="chip" data-action="recording-jump" data-index="${s.lineIndex}">${escapeHtml(s.label)}</button>`)
          .join("")}
      </div>`
    : "";

  return `
    <div class="playback-controls">
      <button class="btn" data-action="${playback.playing ? "recording-pause" : "recording-play"}">
        ${playback.playing ? "⏸ Pause" : playback.lineIndex >= 0 ? "▶ Resume" : "▶ Play (text unfolds like speech)"}
      </button>
      <button class="btn quiet" data-action="recording-restart">Restart</button>
      <div class="playback-progress" role="progressbar" aria-valuenow="${Math.round(progressPct)}" aria-valuemin="0" aria-valuemax="100">
        <div class="playback-progress-bar" style="width:${progressPct}%"></div>
      </div>
    </div>
    ${segmentHtml}
    <p class="audio-note">This build presents the recording as timed text rather than voice audio. Nothing here depends on sound &mdash; the full exchange is also given below, all at once, to read at your own pace.</p>
    <div id="recording-live" aria-live="polite">${lines}</div>
    <div class="transcript-toggle-block">
      <strong>Full transcript, all at once:</strong>
      <div class="evidence-content" style="margin-top:0.5em;">
        ${transcript.map((l) => `<p><strong>${escapeHtml(l.speaker)}:</strong> ${escapeHtml(l.text)}</p>`).join("")}
      </div>
    </div>
  `;
}

export function renderEvidenceModal(id: string): string {
  const e = getEvidence(id);
  if (!e) return "";

  const connectionsHtml = e.connections.length
    ? `<div class="connections-row">
        <span class="label">Connects to:</span>
        ${e.connections
          .map((cid) => {
            const target = getEvidence(cid);
            if (!target) return "";
            const discovered = isDiscovered(cid);
            return discovered
              ? `<button class="chip" data-action="open-evidence" data-id="${cid}">${escapeHtml(target.title)}</button>`
              : `<span class="chip locked" title="Not yet found">not yet found</span>`;
          })
          .join("")}
      </div>`
    : "";

  const establishesHtml = e.establishes.length
    ? `<div class="details-block">
        <h3>What this establishes</h3>
        <ul>${e.establishes.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>`
    : "";

  const suggestsHtml = e.suggests.length
    ? `<div class="details-block">
        <h3>What this only suggests</h3>
        <ul>${e.suggests.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>`
    : "";

  const detailsHtml = e.details.length
    ? `<div class="details-block">
        <h3>Look closely</h3>
        <ul>${e.details.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>`
    : "";

  const flipped = !!ui.flippedEvidence[e.id];
  const flipHtml = e.backContent
    ? `<div class="flip-block">
        <button class="btn quiet" data-action="flip-evidence" data-id="${e.id}">${flipped ? "Turn back over" : "Turn over"}</button>
        ${flipped ? `<div class="evidence-content" style="margin-top:0.6em;">${paragraphs(e.backContent)}</div>` : ""}
      </div>`
    : "";

  const photoPath = e.medium === "photograph" ? getEvidencePhoto(e.id) : undefined;
  const sketchHtml =
    e.medium !== "photograph"
      ? ""
      : photoPath
        ? `<img class="photo-image" src="${photoPath}" alt="${escapeHtml(e.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
           <canvas class="photo-sketch" data-sketch="${e.id}" width="480" height="300" style="display:none"></canvas>`
        : `<canvas class="photo-sketch" data-sketch="${e.id}" width="480" height="300"></canvas>`;

  const bodyContent =
    e.medium === "recording" && getRecording(e.id)
      ? renderRecordingBlock(e.id)
      : `<div class="evidence-content">${sketchHtml}${paragraphs(e.content)}</div>${flipHtml}`;

  return `
  <div class="panel evidence-medium-${e.medium}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="panel-header">
      <div>
        <span class="medium-tag">${MEDIUM_LABEL[e.medium] ?? e.medium} &middot; ${escapeHtml(roomLabel(e.room))}</span>
        <h2 id="modal-title">${escapeHtml(e.title)}</h2>
      </div>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body">
      ${bodyContent}
      ${detailsHtml}
      ${establishesHtml}
      ${suggestsHtml}
      ${connectionsHtml}
    </div>
  </div>`;
}

function roomLabel(room: string): string {
  return getRoom(room)?.name ?? room;
}

export function renderFlavorModal(id: string): string {
  const f = getFlavor(id);
  if (!f) return "";
  return `
  <div class="panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="panel-header">
      <div>
        <span class="medium-tag">A closer look</span>
        <h2 id="modal-title">${escapeHtml(f.label)}</h2>
      </div>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body">
      <p>${escapeHtml(f.text)}</p>
    </div>
  </div>`;
}
