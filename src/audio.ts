// Small procedural ambience — no audio files, so no licensing or asset weight.
// Everything meaningful in the game is available without sound (see the
// listening room's full transcript), so this layer is purely atmospheric.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
let started = false;
let mutedFlag = false;

// Optional background music. No track ships with the game — drop a file at
// public/music/background.mp3 (any format a <audio> tag can play: mp3, ogg,
// m4a) and it plays automatically; if the file is missing, this fails
// silently and the game runs exactly as before. See README.md's "Adding
// background music" section.
const MUSIC_SRC = "/music/background.mp3";
const MUSIC_VOLUME = 0.35;
let musicEl: HTMLAudioElement | null = null;
let musicStarted = false;

function ensureContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = mutedFlag ? 0 : 0.16;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function initAudio(muted: boolean) {
  mutedFlag = muted;
}

export function startAmbience() {
  if (started) return;
  started = true;
  const audioCtx = ensureContext();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

  // A quiet, slow-breathing drone built from two detuned low tones — meant to
  // read as "old building at dusk," not music.
  const freqs = [110, 164.81];
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(master!);
    osc.start();

    const target = i === 0 ? 0.5 : 0.28;
    gain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 3);

    // Slow LFO-like drift via periodic ramps instead of an extra node, to keep this tiny.
    const drift = () => {
      if (!ctx) return;
      const now = ctx.currentTime;
      const wobble = target * (0.85 + Math.random() * 0.3);
      gain.gain.linearRampToValueAtTime(wobble, now + 4 + Math.random() * 3);
    };
    const interval = window.setInterval(drift, 4000);
    droneNodes.push({ osc, gain });
    // stash interval id on the node object for cleanup if ever needed
    (gain as GainNode & { __interval?: number }).__interval = interval;
  });
}

/** Starts the optional background music track, if one has been provided. Safe to call repeatedly. */
export function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  const el = new Audio(MUSIC_SRC);
  el.loop = true;
  el.volume = mutedFlag ? 0 : MUSIC_VOLUME;
  el.addEventListener("error", () => {
    // No music file at MUSIC_SRC — expected until one is added. Not an error
    // worth surfacing to the player; the rest of the game is unaffected.
  });
  el.play().catch(() => {
    // Autoplay blocked, or still no file — harmless either way.
  });
  musicEl = el;
}

export function setMuted(muted: boolean) {
  mutedFlag = muted;
  if (master && ctx) {
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.16, ctx.currentTime + 0.4);
  }
  if (musicEl) musicEl.volume = muted ? 0 : MUSIC_VOLUME;
  if (narrationEl) narrationEl.volume = muted ? 0 : 1;
}

// Optional real voice-over for an individual recording (e.g. the master reel
// at LR-01), played alongside the existing simulated timed-text reveal in
// recording.ts. Keyed by file path, not evidence id, so this module stays
// unaware of story data. If the file is missing this fails silently and the
// text-only playback continues exactly as before. See README.md's "Adding
// real narration audio" section.
let narrationEl: HTMLAudioElement | null = null;
let narrationSrc: string | null = null;

export function playNarration(src: string) {
  if (narrationSrc !== src || !narrationEl) {
    if (narrationEl) narrationEl.pause();
    narrationEl = new Audio(src);
    narrationSrc = src;
    narrationEl.addEventListener("error", () => {
      // No file at this path yet — expected until one is recorded/added.
    });
  }
  narrationEl.volume = mutedFlag ? 0 : 1;
  narrationEl.play().catch(() => {
    // Autoplay blocked, or still no file — the text playback carries on regardless.
  });
}

export function pauseNarration() {
  narrationEl?.pause();
}

export function stopNarration() {
  if (narrationEl) {
    narrationEl.pause();
    narrationEl.currentTime = 0;
  }
}

export function seekNarration(seconds: number) {
  if (narrationEl) narrationEl.currentTime = seconds;
}

export function playTick() {
  if (mutedFlag || !ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 420;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  osc.stop(ctx.currentTime + 0.13);
}
