# Developer Walkthrough

A guided path for demoing the game to your professor in about 15–20 minutes
(the full game is designed for 30–60 minutes of unhurried play; this is the
condensed demo route hitting all three discoveries and the final note).
You don't have to follow this order when actually playing — the game
doesn't enforce one.

## 0. Launch

```bash
npm install
npm run dev
```

Open the printed local URL. The intro screen lists the controls before you
begin — read them once, then click **Begin**.

## Controls

- **Move:** WASD or Arrow Up/Down (forward/back), A/D to strafe.
- **Look:** click into the scene once to lock the mouse, then move the
  mouse to look around — or use Arrow Left/Right to turn without a mouse
  at all (fully keyboard-playable).
- **Interact:** a crosshair sits at the center of the screen. Look at an
  object until a prompt appears at the bottom, then press **E** (or click,
  once the mouse is locked) to inspect it.
- **Move between rooms:** either walk through a doorway, or click a room
  name in the top bar to jump there directly.
- **Esc** closes whatever panel is open and releases the mouse lock.

For the fastest demo run, just click through rooms via the top bar and use
E to inspect what the prompt points at — you don't need to actually walk
the halls between rooms if you're short on time.

## The premise, in one line

Jamie was eight, waiting at this archive for their mother, who promised to
take them to dinner and never showed while Jamie was still there. Decades
later, the archive is relocating and returning old recordings to former
participants in its children's program. Jamie's come for theirs.

## 1. Reception & Activity Room (the starting room)

You wake up facing a book on a lectern — that's `RR-01`, the game's actual
starting point, with a short dashed floor arrow pointing to it if you look
down. This one room now combines what used to be two separate rooms
(Reception and the Children's Activity Room), so it holds both sets of
evidence:

- Interact with the **welcome book** (`RR-01`): the game's background —
  what the archive is, what you're here for, and why tonight specifically.
- Interact with the **note on the desk** (`Staff Note`) — the task setup:
  leave a short note with the recording you came to collect. Mentions Mara
  Doyle, who ran the program and has since retired.
- Interact with the **folder with your name on it** (`Personal Folder`) —
  the hook: your claim slip, plus an old note reading "If they come back —
  there's more on the full reel (MC-0914)."
- Interact with the **reception cassette player** (`RR-03`) — your own
  childhood recording. Ends with you asking Mara to play it for your
  mother when she arrives, and Mara agreeing.
- Interact with the **front desk duty log** (`RR-04`) — your grandmother
  picked you up at 5:20 PM.
- Interact with **the corner bench** (`RR-05`) — a landmark: a bench under
  a cracked windowpane you half-recognize. Worth remembering for the
  Photograph Gallery.
- In the activity corner of the same room, interact with the **activity
  schedule** (`AR-01`): the session ran 3:30–5:00 PM.
- Interact with the **session sign-in sheet** (`AR-02`): your mother
  dropped you off on time, 3:25 PM, and signed you in herself.
- Interact with the **advance note from a parent** (`AR-03`): your mother's
  own note, promising to be back by 4:30. Click **Turn over** — there's a
  second line on the back, added later.

## 2. Photograph Gallery

- Interact with the **event photo** (`PR-01`): a child alone on a bench by
  a cracked window — the same bench and window from Reception. Turn it
  over for a lab stamp confirming the date and location.
- Interact with the **group activity photo** (`PR-02`): a wall clock
  reading 4:15, corroborating the session's timing.
- Interact with the **contact sheet** (`PR-03`, in the drawer): a
  handwritten note — "5:15 — most kids gone. [you] still on the bench."

## 3. Storage & Catalog Room (via the top bar directly)

This room also combines two former rooms (Storage and the Catalog Office),
so it holds both sets of evidence:

- Interact with the **visitor sign-in log** (`SR-01`): your mother signed
  in at 5:47 PM — the piece that, combined with the duty log from
  Reception, locks in **Discovery 1**.
- Interact with the **phone message slip** (`SR-02`) and the **transit
  diversion notice** (`SR-03`): she called at 4:45 to say she'd been
  caught in a diversion — locking in **Discovery 2**, without proving
  whether she could have left earlier.
- Interact with **Storage Shelf C-2** (`SR-04`): the master reel isn't
  here anymore — a note says it's been moved to the Listening Room.
- In the catalog corner of the same room, interact with the **catalog
  card** (`CO-01`): the archive has known about a "late parent message" on
  file the whole time — it was never hidden, just never collected. Turn it
  over: the access history is blank.
- Interact with the **tape duplication record** (`CO-02`): your personal
  copy was sealed at 5:05 PM, before your mother arrived.
- Interact with the **relocation inventory** (`CO-03`) and the **archive
  policy memo** (`CO-04`): together these explain exactly why your copy
  doesn't have the message, and confirm the master reel was always
  available on request.

## 4. Listening Room — the payoff

- Interact with the **listening station** (`LR-01`, the master reel).
  Click **Play**, or jump straight to **"After session (the message)"**
  using the segment buttons above the transcript — you don't have to
  re-listen to the whole session. This is the emotional core: your mother,
  having learned you'd already left, records a message acknowledging the
  broken promise and your anger, without excusing it.
- Interact with the **listening room log** (`LR-02`): confirms nobody had
  ever requested this reel before tonight — completing **Discovery 3**.

## 5. Check the Notebook

- **Discoveries** tab: all three should now be unlocked. On a fresh save,
  try clicking **Need a hint?** on a locked discovery to see the
  progressive 3-tier hint system.
- **Timeline** tab: every timestamped item you've found lines up
  automatically in chronological order, 3:25 PM through the after-session
  message.
- **Compare**: pick two items side by side and optionally mark a
  connection.

## 6. The Final Note

- Return to **Reception** and interact with the **desk** ("Write the
  note," next to the staff note).
- For topics 1–3, select the **Fact** option (now unlocked) and click a
  "Check the evidence" chip to see the citation surface inline.
- Topic 4 ("How I feel about hearing it now") is **multi-select** — try
  checking both "It helps to know she came" and "I still remember being
  left waiting" at once; they're not mutually exclusive. Also try the
  "reaches further" option ("there's nothing left to forgive") to see the
  inline callout explaining what it invents.
- Try **Copy note** and **Download as .txt** — both export your assembled
  note as plain text.
- Click **Leave it with your copy** to see the closing passage, then
  **Listen to a sequence, assembled tonight** for a short two-recording
  montage, explicitly labeled as something assembled now rather than a
  real exchange.
- Nothing here is scored, and nothing is a "true ending" — you can go back
  to any room and revise the note at any time.

## 7. Settings (optional, quick)

- Open **Settings**: mouse sensitivity slider, graphics quality
  (Standard/High — caps the render resolution scale), text size, reduced
  motion (also swaps keyboard turning to discrete snap-turns), **Return to
  title** without losing progress, and **Reset**.

## If something looks off

- If nothing responds to WASD, click once inside the 3D view first — the
  browser requires a click before it will lock the mouse reliably.
- If the recording's "Play" button doesn't advance, click **Restart**.
- The topbar's `Notebook (n/21)` count is discovery progress, not a score.
- If you reset by accident, you'll return to the intro screen with the
  save cleared — everything above still works the same on a fresh run.

## Honest playtime note

Twenty-one evidence items across four rooms, read carefully with the
notebook and hints available, lands closer to 20–35 minutes for most
players in my own testing than the full 30–60 minute range — the upper end
assumes slower, more exploratory play (backtracking, using every hint tier,
comparing multiple item pairs, replaying both recordings). I did not pad
runtime with walking distance or forced waiting to hit a number; see
`FUTURE.md` for what a longer cut would add instead.
