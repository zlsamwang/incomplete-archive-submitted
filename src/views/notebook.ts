import { EVIDENCE, getEvidence } from "../data/evidence";
import { DISCOVERIES } from "../data/discoveries";
import { ROOMS } from "../data/rooms";
import { getState, isDiscovered } from "../state";
import { ui } from "../uiState";
import { escapeHtml, paragraphs } from "../utils";

function renderEvidenceTab(): string {
  const discoveredIds = new Set(getState().discovered);
  if (discoveredIds.size === 0) {
    return `<p class="empty-note">Nothing recorded yet. Explore the rooms and inspect what you find &mdash; it will appear here.</p>`;
  }
  const groups = ROOMS.map((room) => {
    const items = EVIDENCE.filter((e) => e.room === room.id && discoveredIds.has(e.id));
    if (items.length === 0) return "";
    return `
      <div class="evidence-list-group">
        <h3>${escapeHtml(room.name)}</h3>
        ${items
          .map(
            (e) => `
          <button class="evidence-row" data-action="open-evidence" data-id="${e.id}">
            <span class="row-title">${escapeHtml(e.title)}</span>
            <span class="row-summary">${escapeHtml(e.summary)}</span>
          </button>`
          )
          .join("")}
      </div>`;
  }).join("");
  return `<div class="evidence-list">${groups}</div>`;
}

function renderCompareTab(): string {
  const discoveredIds = getState().discovered;
  if (discoveredIds.length < 2) {
    return `<p class="empty-note">Find at least two items before you can compare them side by side.</p>`;
  }
  const [selA, selB] = ui.compareSelection;

  const cardHtml = (id: string | null) => {
    if (!id) return `<div class="compare-card"><p class="empty-note">Choose an item.</p></div>`;
    const e = getEvidence(id)!;
    return `<div class="compare-card"><h4>${escapeHtml(e.title)}</h4>${paragraphs(e.content)}</div>`;
  };

  return `
    <div class="compare-pickers">
      <div class="compare-slot">
        <label for="compare-a">First item</label>
        <select id="compare-a" data-action="compare-select" data-slot="0">
          <option value="">&mdash; choose &mdash;</option>
          ${discoveredIds
            .map((id) => getEvidence(id)!)
            .map((e) => `<option value="${e.id}" ${e.id === selA ? "selected" : ""}>${escapeHtml(e.title)}</option>`)
            .join("")}
        </select>
      </div>
      <div class="compare-slot">
        <label for="compare-b">Second item</label>
        <select id="compare-b" data-action="compare-select" data-slot="1">
          <option value="">&mdash; choose &mdash;</option>
          ${discoveredIds
            .map((id) => getEvidence(id)!)
            .map((e) => `<option value="${e.id}" ${e.id === selB ? "selected" : ""}>${escapeHtml(e.title)}</option>`)
            .join("")}
        </select>
      </div>
    </div>
    <div class="compare-grid">
      ${cardHtml(selA)}
      ${cardHtml(selB)}
    </div>
    ${
      selA && selB
        ? `<form class="connection-form" data-action="save-connection-form">
             <input type="text" name="note" placeholder="What connects these two? (optional note)" maxlength="140" />
             <button type="submit" class="btn primary">Mark connection</button>
           </form>`
        : ""
    }
  `;
}

function renderConnectionsTab(): string {
  const connections = getState().connections;
  if (connections.length === 0) {
    return `<p class="empty-note">No connections marked yet. Use Compare to note how two items relate.</p>`;
  }
  return connections
    .map((c, i) => {
      const a = getEvidence(c.a);
      const b = getEvidence(c.b);
      return `
      <div class="connection-item">
        <div>
          <span class="pair">${escapeHtml(a?.title ?? c.a)} &harr; ${escapeHtml(b?.title ?? c.b)}</span>
          ${c.note ? escapeHtml(c.note) : '<em>(no note)</em>'}
        </div>
        <button class="btn quiet" data-action="remove-connection" data-index="${i}" aria-label="Remove this connection">Remove</button>
      </div>`;
    })
    .join("");
}

function renderDiscoveriesTab(): string {
  return DISCOVERIES.map((d) => {
    const found = d.requires.filter((id) => isDiscovered(id)).length;
    const unlocked = found === d.requires.length;
    if (!unlocked) {
      const revealed = ui.hintsRevealed[d.id] ?? 0;
      const hintsHtml = Array.from({ length: revealed }, (_, i) => `<p class="hint-line">${escapeHtml(d.hints[i])}</p>`).join("");
      const nextHintBtn =
        revealed < 3
          ? `<button class="btn quiet" data-action="reveal-hint" data-id="${d.id}">${revealed === 0 ? "Need a hint?" : "Another hint"}</button>`
          : "";
      return `
        <div class="discovery-card locked">
          <h3>?</h3>
          <p class="discovery-progress">${found} of ${d.requires.length} related items found</p>
          ${hintsHtml}
          ${nextHintBtn}
        </div>`;
    }
    return `
      <div class="discovery-card">
        <h3>${escapeHtml(d.title)}</h3>
        <p>${escapeHtml(d.summary)}</p>
      </div>`;
  }).join("");
}

function renderTimelineTab(): string {
  const discoveredIds = new Set(getState().discovered);
  const timed = EVIDENCE.filter((e) => e.time && discoveredIds.has(e.id)).sort(
    (a, b) => a.time!.sortKey - b.time!.sortKey
  );
  if (timed.length === 0) {
    return `<p class="empty-note">Evidence with a specific time attached to that day will line up here as you find it.</p>`;
  }
  return `
    <div class="timeline-list">
      ${timed
        .map(
          (e) => `
        <button class="timeline-row" data-action="open-evidence" data-id="${e.id}">
          <span class="timeline-time">${escapeHtml(e.time!.label)}</span>
          <span class="timeline-title">${escapeHtml(e.title)}</span>
        </button>`
        )
        .join("")}
    </div>
  `;
}

export function renderNotebook(): string {
  const tab = ui.notebookTab;
  const tabs: { id: typeof tab; label: string }[] = [
    { id: "evidence", label: "Evidence" },
    { id: "timeline", label: "Timeline" },
    { id: "compare", label: "Compare" },
    { id: "connections", label: "Connections" },
    { id: "discoveries", label: "Discoveries" },
  ];

  let body = "";
  if (tab === "evidence") body = renderEvidenceTab();
  else if (tab === "timeline") body = renderTimelineTab();
  else if (tab === "compare") body = renderCompareTab();
  else if (tab === "connections") body = renderConnectionsTab();
  else body = renderDiscoveriesTab();

  return `
  <div class="panel wide" role="dialog" aria-modal="true" aria-labelledby="notebook-title">
    <div class="panel-header">
      <h2 id="notebook-title">Notebook</h2>
      <button class="panel-close" data-action="close-modal" aria-label="Close notebook">&times;</button>
    </div>
    <div class="notebook-tabs" role="tablist">
      ${tabs
        .map(
          (t) => `<button class="notebook-tab" role="tab" aria-selected="${t.id === tab}" data-action="notebook-tab" data-tab="${t.id}">${t.label}</button>`
        )
        .join("")}
    </div>
    <div class="panel-body">${body}</div>
  </div>`;
}
