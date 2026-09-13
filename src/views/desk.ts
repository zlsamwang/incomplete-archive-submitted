import { ACCOUNT_TOPICS, OPENING_SENTENCE } from "../data/account";
import { ASSEMBLED_SEQUENCE } from "../data/recording";
import type { AccountOption } from "../data/types";
import { getAccountSelections, isDiscovered } from "../state";
import { escapeHtml } from "../utils";

function optionUnlocked(opt: AccountOption): boolean {
  if (!opt.requiresEvidence || opt.requiresEvidence.length === 0) return true;
  return opt.requiresEvidence.every((id) => isDiscovered(id));
}

const KIND_LABEL: Record<string, string> = {
  fact: "Fact",
  interpretation: "Interpretation",
  overreach: "Reaches further",
  unresolved: "Unresolved",
  omit: "Leave out",
};

export function composeAccountSentences(): { text: string; kind: string }[] {
  const out: { text: string; kind: string }[] = [{ text: OPENING_SENTENCE, kind: "fact" }];
  for (const topic of ACCOUNT_TOPICS) {
    const selected = getAccountSelections(topic.id);
    if (selected.length === 0) continue;
    // Iterate in the topic's own option order so sentence order is stable
    // regardless of the order the player clicked things in.
    for (const opt of topic.options) {
      if (!selected.includes(opt.id)) continue;
      if (opt.kind === "omit" || !opt.sentence) continue;
      out.push({ text: opt.sentence, kind: opt.kind });
    }
  }
  return out;
}

export function composeAccountPlainText(): string {
  return composeAccountSentences()
    .map((s) => s.text)
    .join(" ");
}

export function renderAccountParagraphHtml(): string {
  const sentences = composeAccountSentences();
  return sentences
    .map((s) => {
      const cls = s.kind === "overreach" ? ' class="clause-overreach"' : "";
      return `<span${cls}>${escapeHtml(s.text)}</span>`;
    })
    .join(" ");
}

function renderOption(topicId: string, opt: AccountOption, multiSelect: boolean): string {
  const selections = getAccountSelections(topicId);
  const selected = selections.includes(opt.id);
  const unlocked = optionUnlocked(opt);
  const needCount = opt.requiresEvidence?.length ?? 0;
  const haveCount = opt.requiresEvidence?.filter((id) => isDiscovered(id)).length ?? 0;

  const evidenceChips =
    opt.kind === "fact" && unlocked && opt.citesEvidence
      ? `<div class="connections-row"><span class="label">Check the evidence:</span>
          ${opt.citesEvidence
            .map((id) => `<button class="chip" data-action="open-evidence" data-id="${id}">${id}</button>`)
            .join("")}
        </div>`
      : "";

  const lockedHint = !unlocked
    ? `<div class="locked-hint">You haven't found enough to state this yet (${haveCount} of ${needCount} related items discovered).</div>`
    : "";

  const gapNote =
    selected && opt.kind === "overreach" && opt.gapNote
      ? `<div class="gap-note"><strong>This goes beyond the evidence:</strong> ${escapeHtml(opt.gapNote)}</div>`
      : "";

  const label = opt.kind === "omit" ? "Leave this out of the note." : opt.sentence ?? "";
  const roleAttr = multiSelect ? 'role="checkbox"' : "";

  return `
    <div class="option-row">
      <button class="option-btn ${multiSelect ? "option-btn-checkbox" : ""}" data-action="account-choose" data-topic="${topicId}" data-option="${opt.id}"
        ${roleAttr} aria-pressed="${selected}" ${unlocked ? "" : "disabled"}>
        ${multiSelect ? `<span class="option-checkbox" aria-hidden="true">${selected ? "☑" : "☐"}</span>` : ""}
        <span class="option-kind-tag option-kind-${opt.kind}">${KIND_LABEL[opt.kind]}</span>
        <span>${escapeHtml(label)}</span>
      </button>
      ${evidenceChips}
      ${lockedHint}
      ${gapNote}
    </div>`;
}

export function renderDesk(): string {
  const topicsHtml = ACCOUNT_TOPICS.map(
    (t) => `
    <div class="topic-block">
      <h3>${escapeHtml(t.title)}</h3>
      <p class="topic-prompt">${escapeHtml(t.prompt)}</p>
      <div class="option-list">
        ${t.options.map((o) => renderOption(t.id, o, !!t.multiSelect)).join("")}
      </div>
    </div>`
  ).join("");

  return `
  <div class="panel wide" role="dialog" aria-modal="true" aria-labelledby="desk-title">
    <div class="panel-header">
      <h2 id="desk-title">Writing the Note</h2>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body">
      <div class="desk-opening">${escapeHtml(OPENING_SENTENCE)}</div>
      ${topicsHtml}
      <div class="account-output">
        <h3>Your note so far</h3>
        <p class="account-paragraph">${renderAccountParagraphHtml()}</p>
        <div class="desk-actions" style="margin-top:0.8rem;">
          <button class="btn quiet" data-action="copy-note">Copy note</button>
          <button class="btn quiet" data-action="download-note">Download as .txt</button>
        </div>
      </div>
      <div class="desk-actions">
        <button class="btn primary" data-action="finish-account">Leave it with your copy</button>
        <button class="btn quiet" data-action="close-modal">Keep exploring first</button>
      </div>
    </div>
  </div>`;
}

export function renderEpilogue(): string {
  return `
  <div class="panel" role="dialog" aria-modal="true" aria-labelledby="epilogue-title">
    <div class="panel-header">
      <h2 id="epilogue-title">Closing Time</h2>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body epilogue">
      <p>You set the note down beside your recording. Outside, the light over the loading dock has come on &mdash; the last hour before everything here goes into boxes for good.</p>
      <div class="final-account-echo">
        <p class="account-paragraph">${renderAccountParagraphHtml()}</p>
      </div>
      <p>The note is only as long as what you were willing to claim, and no shorter than what you actually found. The master reel goes into the boxes tonight too, whatever you've written about it &mdash; filed correctly, the way it always was. This time, someone came back for it.</p>
      <div class="desk-actions" style="margin-bottom:1rem;">
        <button class="btn quiet" data-action="open-assembled">Listen to a sequence, assembled tonight</button>
      </div>
      <p>You can still walk through the rooms again before the lights go off, or come back to this desk and change your mind. Nothing here is graded, and nothing here is final.</p>
      <div class="desk-actions">
        <button class="btn primary" data-action="close-modal">Return to the archive</button>
      </div>
    </div>
  </div>`;
}

export function renderAssembledModal(): string {
  const lines = ASSEMBLED_SEQUENCE.map(
    (l) => `
    <div class="transcript-line active">
      <span class="when-tag when-${l.when}">${l.when === "then" ? "THEN" : "NOW"}</span>
      <span class="speaker">${escapeHtml(l.speaker)}</span>${escapeHtml(l.text)}
    </div>`
  ).join("");

  return `
  <div class="panel" role="dialog" aria-modal="true" aria-labelledby="assembled-title">
    <div class="panel-header">
      <div>
        <span class="medium-tag">Assembled tonight</span>
        <h2 id="assembled-title">A Sequence That Didn't Happen This Way</h2>
      </div>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body">
      <p class="audio-note">These two recordings were made hours apart, by two people who never spoke to each other that evening. Placing them back to back is something you're choosing to do now &mdash; not a conversation that happened then.</p>
      <div class="evidence-content" style="margin-top:0.8rem;">${lines}</div>
    </div>
  </div>`;
}
