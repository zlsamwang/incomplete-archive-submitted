HOW TO ADD BACKGROUND MUSIC
============================

Drop an audio file here named exactly:

    background.mp3

(.mp3 is what the code looks for; if you only have .ogg or .m4a, either
convert it or edit MUSIC_SRC near the top of src/audio.ts to match your
filename/extension.)

That's it — no other code changes needed. The game will start playing it,
looped, the first time the player clicks anything (browsers require a
click before audio can play). It respects the Mute toggle in Settings
automatically.

If no file is present, nothing breaks — the game just runs with its
existing procedural ambience only, silently, with no error shown to the
player.

A few notes on choosing a track:
- Keep it low and unobtrusive — this is a quiet, dusk-toned game about
  reading carefully. A dense or melodic track will fight the reading
  panels and the recording transcripts.
- Use something you actually have the rights to use: royalty-free music
  from a site whose license you've checked (e.g. a Creative Commons track
  with attribution you're prepared to give in your credits), a track you
  composed yourself, or a paid license you own. Do not use a copyrighted
  commercial track without a license, even for a class project — this
  applies whether or not the project is ever shown publicly.
- A loop point that isn't jarring matters more than length here, since the
  track will repeat for the whole ~20–40 minute playthrough. 2–5 minutes
  that loops cleanly is plenty.
