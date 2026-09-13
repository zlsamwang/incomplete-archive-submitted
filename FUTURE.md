# Possible Future Expansions

Not implemented. Kept separate from the delivered game on purpose — these
are ideas for *after* the class deadline, not a to-do list against it.
Several items that were future ideas in an earlier draft of this document
(mouse sensitivity, adjustable graphics quality, progressive hints, a
timeline view, note export, document flip, audio segment navigation) are
now implemented — see `README.md` and `DESIGN.md`.

- **Real audio for both recordings.** The personal recording and the master
  reel are both built around a text-playback alternative by design (no
  voice actors, no licensing, and it keeps everything screen-reader
  accessible by default) — but actual voice performance, even a single
  amateur read-through of the mother's message, would make the Ong-inspired
  point about speech-in-time land much harder than text ever can. Full
  performance-ready scripts are in `AUDIO_SCRIPTS.md`, written so they can
  be recorded and dropped in without any redesign.
- **A visible exterior or window view.** The brief asked for "a
  recognizable view through windows or a small entrance courtyard for
  atmosphere." This build's reception window is a lit panel suggesting
  daylight, not an actual rendered view of an outside space — building a
  real exterior vista (even a small, static one) would need either a
  skybox/backdrop technique or a tiny walkable courtyard, which I judged
  as more risk than the remaining time justified this late in a large
  build. This is a real, acknowledged gap against the brief, not a
  design choice.
- **What happens after tonight.** The game deliberately stops at the note
  you leave with your recording — it doesn't show you calling your mother,
  or not calling her. A version of the project that wanted to sit with the
  aftermath longer could add a very short coda (a phone left face-up on the
  desk, say) without answering the question of what you do with it.
- **Modeled or textured room geometry.** The rooms are currently built from
  flat-shaded Three.js primitives (boxes and planes) rather than modeled,
  UV-mapped, and textured 3D assets. Commissioned or hand-built models and
  material textures in the same muted palette would raise the visual
  ceiling considerably without changing any of the underlying design.
- **Gamepad support.** The controls currently cover mouse+keyboard and a
  keyboard-only mode; a controller mapping (stick to move/look, a face
  button to interact) would be a natural third option.
- **Footstep and object-handling sound.** Ambience is currently a single
  procedural room tone; per-surface footstep sounds and small interaction
  cues (paper rustle, a drawer sliding) would add texture without needing
  any licensed audio.
- **A second "return visit" layer.** Right now revisiting a room mostly
  means re-reading the same objects with new context in your head. A
  future version could let a handful of objects visibly change once a
  discovery is made (the folder in Reception gaining a second note once
  both recordings are found, say), rewarding a literal return trip the way
  *Outer Wilds* rewards revisiting a location.
- **A drag-and-drop timeline.** The current Timeline tab auto-sorts
  discovered evidence by time, which satisfies the brief's explicit note
  not to require exact positioning — but a version where the player
  manually arranges cards and gets light feedback on ordering could be a
  more active exercise in reconstruction.
- **Localization.** All text lives in `src/data/`, which would make
  translating the game into another language mechanically straightforward;
  no such translation exists yet.
