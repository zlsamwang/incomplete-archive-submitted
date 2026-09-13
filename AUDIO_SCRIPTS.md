# Audio Scripts & Implementation Status

## Current status

**No real voice audio is bundled in this build.** I have no way to generate
authorized synthetic voices or record real performances in this environment,
and the brief is explicit that fabricated/placeholder audio files must not
be faked. Instead, both recordings below are implemented as **timed text
playback**, clearly labeled as such in-game (see the "This build presents
the recording as timed text rather than voice audio" note on every
recording), with a complete, always-visible accessible transcript alongside
it. Nothing in the game depends on sound.

**If real audio is produced later**, the scripts below are ready to record
as-is. Swapping them in requires no redesign: each `RecordingLine` in
`src/data/recording.ts` would gain an `audioSrc` field, and the playback
engine (`src/main.ts`'s `playNextLine`) would play that file instead of — or
alongside — the timed-text reveal, using the same line boundaries and
segment index already defined. The transcript stays as the accessibility
fallback either way.

## Roles

- **JAMIE** — the protagonist, age 8 (in the September 14 recordings).
  Should read as an ordinary, slightly distracted kid — not precocious,
  not tearful. The emotional weight of the story is not carried by this
  performance.
- **MARA (Doyle)** — the archive's recording-program coordinator at the
  time. Warm, practiced, a little brisk. She's done this many times. Her
  offer to record Elena's message should sound like routine kindness, not
  a dramatic gesture.
- **ELENA (Cortez)** — Jamie's mother. This is the performance that
  matters most. She is not performing grief or eloquence — she is
  thinking out loud, correcting herself mid-sentence, aware that what
  she's saying isn't enough and saying it anyway.

## Script 1 — RR-03: Personal Recording (Sept. 14, during session)

*Performance note: light, unhurried, a real kid telling a real anecdote.
Total run time at a natural pace: approximately 35–45 seconds.*

```
MARA:  Okay, we're recording. Go ahead, tell it the way you told me.

JAMIE: Okay. So at recess, Danny bet me he could hold his breath longer
       than the fish tank filter, and he couldn't, and Mrs. Ruiz had to
       come get him off the floor because he was laughing too hard to
       stand up.

MARA:  That's a good one. Anything else from this week?

JAMIE: Um. Not really. Can I ask something?

MARA:  Sure.

JAMIE: When she gets here — can you play it for her? The tape?

MARA:  Yes. We can.

JAMIE: Okay. Good.

MARA:  That's everything for today. Good session.
```

**Direction:** Jamie's question ("can you play it for her?") is the
emotional hook of the whole game and should land as completely
unremarkable to the kid asking it — a passing, practical question, not a
plea. Mara's "Yes. We can." is warm but brief; she has no idea yet how
that promise will actually play out.

## Script 2 — LR-01: Master Reel, Full Session (Sept. 14)

*Performance note: the first three lines (ambient/session) can be a few
seconds of room tone and indistinct overlapping kid-chatter if real audio
is produced — no scripted dialogue is needed there. The scripted, timed
portion begins at "Session: end" and runs through Elena's message. At a
natural, unhurried pace — including her hesitations and the two indicated
pauses — the "after session" portion (from "Is she gone already?" onward)
should run approximately 70–90 seconds. Do not rush Elena's lines to hit a
shorter runtime; the pacing is part of what the scene is about.*

```
[SESSION AMBIENT — several children talking at once, a recorder being
 passed around. No scripted lines.]

MARA:   Okay, everyone, let's start wrapping up — recorders off, one at a
        time.

[Chairs, footsteps, a door. The room empties. A long quiet stretch —
 several seconds of near-silence is correct here, not a mistake.]

[A different door opens, later.]

ELENA:  Is she gone already?

MARA:   About half an hour ago. Her grandmother came.

ELENA:  Of course she did.

[A chair scrapes. A pause — let this sit for a beat before Mara speaks
 again; she's deciding whether to offer this.]

MARA:   If you want, I can put a few words on the end of today's reel.
        She could hear it later — I can't promise when, but I'll keep it
        filed with hers.

ELENA:  Okay. Okay, um — is it going?

MARA:   It's going.

ELENA:  Hi, love. It's Mum.

ELENA:  I came to get you. I'm here now, but you've already gone with
        Grandma.

ELENA:  The bus was diverted. I called to say I was running late, but I
        couldn't tell them how long.

[Pause.]

ELENA:  We were supposed to have dinner.

ELENA:  I've still got the little menu you brought home. It's in my bag.
        You circled something, but you wouldn't tell me what it was.

[Take a small breath.]

ELENA:  You must have been angry, waiting for me. You're allowed to be.
        I didn't do what I promised today.

[Longer pause.]

ELENA:  Mara tried calling Grandma's house. No one's home yet. I have to
        leave for the station in a minute, so I'm leaving this here for
        you.

ELENA:  I wanted to hear about your afternoon.

ELENA:  When you hear this—

[Stop briefly, then begin again.]

ELENA:  I'm sorry I wasn't here when you needed me.

MARA:   I've got it. I'll keep this one with her copy — well, near it.
```

**Direction for Elena's central lines:** she should not cry, and should
not sound composed either — somewhere in between, someone talking fast to
get through it before she loses her nerve. She never explicitly excuses
herself with the diversion — she states it as a fact early on, then moves
past it without returning to it, which should read as a deliberate choice,
not an oversight. The line "You're allowed to be [angry]" is the emotional
center of the entire game; it should be said plainly, not performed for
effect. The closing "I'm sorry I wasn't here when you needed me," after
the "[Stop briefly, then begin again]" beat, should land as the one line
she'd decided in advance she had to say, however the rest came out.

## Script 3 — the assembled sequence (final desk, optional)

This is not a new recording — it's three existing lines, replayed back to
back at the very end of the game, explicitly labeled as something the
*player* is assembling now, not a conversation that happened at the time
(see `ASSEMBLED_SEQUENCE` in `src/data/recording.ts`):

```
[THEN] JAMIE: When she gets here — can you play it for her? The tape?
[THEN] MARA:  Yes. We can.
[NOW]  ELENA: You must have been angry, waiting for me. You're allowed
              to be. I didn't do what I promised today.
```

If real audio exists for scripts 1 and 2, this sequence needs no new
recording — it's just those same audio clips replayed in a new order, with
the "THEN"/"NOW" labels rendered as on-screen text (already implemented).

## What every clue-bearing line establishes (cross-reference)

For voice direction purposes, note which lines are load-bearing for the
game's factual chain — these should be recorded clearly, not thrown away
in the mix:

- Elena's "Is she gone already?" — establishes she arrived after Jamie left.
- The diversion is stated once, early, and never returned to — Elena
  doesn't lean on it as an excuse for the rest of the message. Central to
  Discovery 2 not resolving into a simple excuse, without the game ever
  having her explicitly disown it either — that stays open.
- "You're allowed to be [angry]. I didn't do what I promised today." —
  the emotional payoff the whole investigation trail points toward.
