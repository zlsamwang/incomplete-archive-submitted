# The Incomplete Archive

*Story title: "A Voice That Came Late."* A first-person 3D exploration
game about a recorded question that went unanswered for years, and the
archive record that finally answers it. Built for a Media Aesthetics final
creative project.

Playtime: designed for roughly 30–60 minutes; in my own testing a careful
playthrough lands closer to 20–35 minutes. See the honest note at the
bottom of `WALKTHROUGH.md`.

## Running it

Requirements: [Node.js](https://nodejs.org) 18 or newer (tested on Node 22).

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print a URL, typically
`http://localhost:5173`). Open it in any modern browser. No account,
backend, or internet connection is required once the page has loaded.

To produce a static build you could host anywhere (GitHub Pages, a USB
drive, a classroom laptop with no internet):

```bash
npm run build
npm run preview   # serves the built dist/ folder locally, to confirm it works
```

The build output lands in `dist/` — it's a handful of static files
(`index.html`, JS, CSS) with no server-side code at all.

## Controls

The game is first-person 3D. The intro screen also lists these before you
start.

- **Move:** WASD or Arrow Up/Down, A/D to strafe.
- **Look:** click into the scene to lock the mouse and look around with
  it, or use Arrow Left/Right to turn — fully playable without a mouse.
- **Interact:** aim the center crosshair at an object until its name and
  "Press E" appear, then press E (or click, once the mouse is locked).
- **Change rooms:** walk through a doorway, or click a room name in the
  top bar to jump there directly.
- Every menu (notebook, desk, settings) is built from real, focusable
  buttons — `Tab`, `Enter`/`Space`, and `Escape` (closes whatever's open)
  work throughout.

## Adding background music

No music track ships with the game — only a small procedural ambient tone
(no audio files, so no licensing to worry about). To add real background
music:

1. Drop an audio file at `public/music/background.mp3`.
2. That's it. Reload the game — it plays automatically, looped, on the
   player's first click (browsers require a click before audio can start),
   and respects the Mute toggle in Settings.

If you only have a `.ogg` or `.m4a` file, either convert it or change the
`MUSIC_SRC` constant near the top of `src/audio.ts` to match your
filename/extension. If no file is present, nothing breaks — the game just
runs with its existing ambience, silently, with no error shown to the
player. Full notes on picking a track (keep it unobtrusive, make sure you
actually have the rights to use it, pick something that loops cleanly)
are in `public/music/README.txt`.

## Adding real narration audio

The two recordings (`RR-03`, `LR-01`) ship as text-only "playback" by
design — full transcripts always visible, nothing gated behind sound. If
you record real voice-over for one, drop it at
`public/audio/lr-01-message.mp3` (for the master reel) and it plays
automatically alongside the existing timed-text reveal — no code changes
needed. Each transcript line's `seconds` field in `src/data/recording.ts`
doubles as its audio cue point, so once you have the real recording,
adjust those values to match its actual pacing (this also keeps the
segment-jump buttons seeking to the right spot). Full details, including
how to add narration for the other recording, are in
`public/audio/README.txt`; performance-ready scripts are in
`AUDIO_SCRIPTS.md`.

## Project layout

Story content and interface code are kept apart on purpose, so the writing
can be edited without touching how anything works:

```
src/
  data/            <- ALL the writing lives here
    types.ts         shared shapes for evidence, rooms, 3D geometry, dialogue, etc.
    evidence.ts       the 21 evidence items (full text, connections, facts vs. suggestions)
    rooms.ts          room names + intro text (metadata only)
    rooms3d.ts        3D geometry: walls, furniture, doors, and where each
                      interactive marker sits in each of the 6 rooms
    recording.ts      transcripts for both recordings, segment indexes,
                      and the final "assembled sequence"
    account.ts        the final desk's sentence bank (facts/interpretations/etc.)
    discoveries.ts    the 3 "aha" summaries + their 3-tier progressive hints
    flavor.ts         small non-evidence environmental details

  three/            the first-person engine (Three.js), no story content
    engine.ts         scene/camera/render loop, room loading, raycast interaction
    controls.ts       WASD + mouse-look + keyboard-only movement and turning
    roomBuilder.ts    turns a rooms3d.ts entry into actual meshes + colliders
    collision.ts      simple 2D box collision for walls/furniture

  state.ts          persisted game state (localStorage) + save/reset
  uiState.ts        transient UI state (which modal is open, hints revealed, etc.) — never saved
  audio.ts          procedural ambience (no audio files)
  utils.ts          small HTML-escaping helpers

  views/            2D overlay rendering only — reads from data/ and state, no story content
    intro.ts, room.ts (topbar), hud.ts, evidenceModal.ts, notebook.ts, desk.ts, settings.ts

  main.ts           bootstraps the app, owns the 3D engine instance, and wires
                     up all click/keyboard handling and overlay state
  style.css         the visual design system for every 2D panel/HUD element
```

**To edit the writing** — change a caption, add a detail, rewrite a
sentence in the final note — you only ever need to touch files in
`src/data/` (not `rooms3d.ts`, unless you're moving something in space).
The interface and engine code don't know or care what the text says.

**To move an object in a room**, adjust its `pos` (an `[x, y, z]` in
that room's local coordinate space) in `src/data/rooms3d.ts`. Each room's
comment block documents its coordinate convention.

**To add a third recording**, add it to the `RECORDINGS` map in
`src/data/recording.ts` and give the corresponding evidence item
`medium: "recording"` in `evidence.ts` — the playback UI already
generalizes over any number of recordings; no other code changes needed.

## What's implemented

- Four walkable first-person 3D rooms (Reception & Activity Room,
  Photograph Gallery, Listening Room, Storage & Catalog Room — built from
  Three.js primitives, no external art assets) connected by doorways, with
  a raycast-based interaction system (look at an object, press E). This was
  six separate rooms in an earlier pass; folded down to four after feedback
  that six felt like too many to navigate for the amount of content. Every
  doorway carries a wayfinding sign naming the room on the other side,
  generated directly from the door data so it can never drift out of sync
  with the actual layout. Lamps, plants, and stools use cylinders, cones,
  and spheres alongside the boxes, and every light source has a visible
  fixture rather than floating in midair.
- On first entering the archive, the view starts blurred and dark and
  resolves into focus over ~2.4 seconds, guiding the player toward a note
  placed directly ahead — the game's actual starting point, marked with a
  short dashed floor arrow that fades once it's been read. Skipped
  entirely under reduced motion.
- 21 full evidence items with stable IDs, cross-references, and an
  explicit split between what each item *establishes* and what it only
  *suggests*.
- The three connected discoveries described in `DESIGN.md`, each requiring
  the player to hold two or more objects — often from different rooms —
  in mind at once.
- A notebook with five tabs: evidence grouped by room, an auto-sorted
  **timeline** of everything with a known time, a side-by-side **compare**
  tool with free-text connection notes, a **connections** log, and passive
  **discovery** summaries with a 3-tier progressive hint system revealed
  only on request.
- Two text-playback recordings with full accessible transcripts always
  available — nothing in the game depends on sound. The longer one (the
  master reel) has a segment index so players can jump straight to "After
  session" instead of re-listening to the whole thing.
- Document **flip**: three evidence items have a second side with its own
  detail, revealed with a "Turn over" button.
- The final desk: a sentence bank across four topics — three single-select
  (fact / qualified interpretation / a claim that reaches past the
  evidence / leave it out) and one **multi-select** ("how I feel about
  this," since comfort and regret aren't mutually exclusive) — composing a
  live paragraph, with inline "why this goes beyond the evidence" notes
  for overreaching claims and evidence citations for factual ones. The
  finished note can be copied to the clipboard or downloaded as `.txt`.
- A short "assembled sequence" at the very end, explicitly labeled as
  something the player constructs now, not a real exchange that happened
  at the time — the game's most direct expression of its Cha/Ong themes.
- LocalStorage save (evidence found, connections, account choices, visited
  rooms), a visible reset control, and settings for mute, reduced motion,
  text scale, mouse sensitivity, and a Standard/High graphics-quality
  toggle (caps render resolution scale for slower hardware).
- No countdown, no score, no "true ending" — finishing the note shows an
  atmospheric closing passage and lets the player keep revising.
- Undiscovered evidence carries a subtle pulsing amber glow so nothing
  requires pixel-hunting — a steady (non-animated) glow under reduced
  motion instead of a pulse, and it locks to a calmer steady tint the
  moment an item is actually found.

## What's limited

See `FUTURE.md` for expansion ideas kept separate from this build, and
`AUDIO_SCRIPTS.md` for the honest status of voice audio. In short: no real
voice acting (both recordings are a labeled text alternative by design,
with full performance-ready scripts provided); no rendered exterior or
window view (a real gap against the brief's atmosphere request, not a
design choice — see `FUTURE.md`); rooms are built from flat-shaded
geometric primitives rather than modeled or textured 3D assets, so the
look is deliberately stylized/low-poly rather than realistic; and true
first-person mouse-look can't be operated by keyboard alone in the way a
mouse can, so the keyboard-only path (Arrow Left/Right to turn, Arrow
Up/Down to move) is a genuine alternative control scheme rather than an
identical experience — both are fully functional, but they don't feel the
same to use.

## Other documents

- `DESIGN.md` — the chronology, the evidence matrix, and the closed vs.
  open question design.
- `ARTIST_STATEMENT.md` — a **draft**, for your revision, connecting the
  implemented mechanics to *Dictee* and *Orality and Literacy*.
- `WALKTHROUGH.md` — a developer walkthrough for demoing the game, plus an
  honest playtime note.
- `AUDIO_SCRIPTS.md` — full performance-ready scripts for both recordings,
  and the current text-playback implementation status.
- `FUTURE.md` — possible expansions, kept separate from what's built.
