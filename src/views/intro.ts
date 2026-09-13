import { getState } from "../state";

export function renderIntro(): string {
  const hasProgress = getState().discovered.length > 0;
  return `
  <div class="intro-screen">
    <div class="intro-card">
      <h1>The Incomplete Archive</h1>
      <div class="subtitle">a first-person exploration, about 30&ndash;60 minutes</div>
      <p>You don't remember much about that day &mdash; only that you were eight, waiting here for your mother, and she didn't come.</p>
      <p>Tonight the archive closes for good. Someone kept something of yours. Maybe it remembers more than you do.</p>
      <div class="intro-controls">
        <h2>Controls</h2>
        <ul>
          <li><strong>Move:</strong> WASD or Arrow keys</li>
          <li><strong>Look:</strong> mouse (click once to enable it), or Arrow Left/Right to turn</li>
          <li><strong>Interact:</strong> E, or click once your view is locked</li>
          <li><strong>Escape:</strong> releases the mouse and closes any open panel</li>
          <li><strong>Notebook:</strong> the button in the top-right corner, any time</li>
        </ul>
      </div>
      <div class="intro-actions">
        <button class="btn primary" data-action="start-game">${hasProgress ? "Continue" : "Begin"}</button>
        ${hasProgress ? '<button class="btn quiet" data-action="reset-confirm">Start over</button>' : ""}
      </div>
    </div>
  </div>`;
}
