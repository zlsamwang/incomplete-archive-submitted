HOW TO ADD REAL NARRATION AUDIO
================================

Drop an audio file here named exactly:

    lr-01-message.mp3

This is the voice-over for the master reel (evidence LR-01 — the recording
in the Listening Room, including Elena's message). It plays automatically
alongside the existing simulated timed-text reveal (the text that unfolds
line by line as if being read aloud); the always-visible full transcript
stays exactly as it is, so nothing here is required for accessibility.

(.mp3 is what the code looks for; if you only have .ogg or .m4a, either
convert it or edit RECORDING_AUDIO near the bottom of
src/data/recording.ts to match your filename/extension.)

If no file is present, nothing breaks — the recording just plays as
simulated text only, exactly as before, with no error shown to the player.

Syncing text to the real recording:
- Each line in LR_01_MASTER_REEL (src/data/recording.ts) has a `seconds`
  field — originally just a pacing guess for the simulated reveal, but it
  now doubles as the cue point used to seek/sync this audio file. Once you
  have the real recording, listen through it and adjust each line's
  `seconds` to roughly match how long that line actually takes to say —
  this keeps the on-screen caption in step with the voice, and keeps the
  segment-jump buttons ("Session: start" / "After session (the message)")
  seeking to the right spot in the audio.
- Exact frame-accuracy isn't necessary — a rough match reads fine.

To add narration for the other recording (RR-03, the child's personal
tape), add a second entry to RECORDING_AUDIO in src/data/recording.ts,
e.g. `"RR-03": "/audio/rr-03-session.mp3"`, and drop the file here under
that name. No other code changes needed — the play/pause/restart/segment
controls already work for any recording listed in RECORDING_AUDIO.

A few notes on recording it:
- Full performance-ready scripts (with stage directions) are in
  AUDIO_SCRIPTS.md — keep that file's script and recording.ts's text in
  sync if you revise either one.
- Use a quiet, unhurried reading — the game's tone is deliberate and
  restrained, not dramatic.
- Only use a voice/recording you have the right to use (yourself, a
  friend who's consented, or a licensed voice actor) — same rule as the
  background music track.
