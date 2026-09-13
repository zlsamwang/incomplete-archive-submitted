import { getState } from "../state";

export function renderSettings(): string {
  const s = getState();
  const scales = [
    { value: 1, label: "A" },
    { value: 1.15, label: "A+" },
    { value: 1.3, label: "A++" },
  ];
  return `
  <div class="panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div class="panel-header">
      <h2 id="settings-title">Settings</h2>
      <button class="panel-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body">
      <div class="settings-row">
        <div>
          <span class="settings-label">Sound</span>
          <span class="settings-desc">Ambient room tone and any background music. No clue depends on sound.</span>
        </div>
        <button class="toggle-switch" role="switch" aria-checked="${!s.muted}" data-action="toggle-mute" aria-label="Toggle sound"></button>
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Reduce motion</span>
          <span class="settings-desc">Turns off transitions and animated effects.</span>
        </div>
        <button class="toggle-switch" role="switch" aria-checked="${s.reducedMotion}" data-action="toggle-reduced-motion" aria-label="Toggle reduced motion"></button>
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Text size</span>
          <span class="settings-desc">Scales all in-game text.</span>
        </div>
        <div class="scale-btns">
          ${scales
            .map(
              (sc) =>
                `<button aria-pressed="${s.textScale === sc.value}" data-action="set-text-scale" data-scale="${sc.value}">${sc.label}</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Mouse sensitivity</span>
          <span class="settings-desc">Adjusts how far the view turns per mouse movement.</span>
        </div>
        <input type="range" min="0.5" max="2" step="0.1" value="${s.mouseSensitivity}" data-action="set-mouse-sensitivity" aria-label="Mouse sensitivity" style="width:140px;" />
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Graphics quality</span>
          <span class="settings-desc">Standard renders at a lower resolution scale, for slower computers.</span>
        </div>
        <div class="scale-btns">
          <button aria-pressed="${s.graphicsQuality === "standard"}" data-action="set-graphics-quality" data-quality="standard">Standard</button>
          <button aria-pressed="${s.graphicsQuality === "high"}" data-action="set-graphics-quality" data-quality="high">High</button>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Title screen</span>
          <span class="settings-desc">Your progress is saved &mdash; this won't lose anything.</span>
        </div>
        <button class="btn quiet" data-action="back-to-title">Return to title</button>
      </div>
      <div class="settings-row">
        <div>
          <span class="settings-label">Reset progress</span>
          <span class="settings-desc">Clears everything found, all connections, and the note you've written.</span>
        </div>
        <button class="btn danger" data-action="reset-confirm">Reset</button>
      </div>
    </div>
  </div>`;
}
