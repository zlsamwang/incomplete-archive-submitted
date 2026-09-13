import type { RecordingLine, RecordingSegment } from "./types";

// Full accessible transcripts, used for both the timed "playback" (a written
// form unfolding in time, standing in for audio we can't record with real
// voice actors) and the always-visible static transcript. Nothing in this
// game depends on sound alone. Keyed by evidence id. See AUDIO_SCRIPTS.md
// for performance-ready scripts if real voice recording is ever produced.

// RR-03 — the take-home copy from the Children's Recording Project session,
// September 14. Ends mid-afternoon, well before the events in question.
const RR_03_PERSONAL_RECORDING: RecordingLine[] = [
  { speaker: "MARA", text: "Okay, we're recording. Go ahead, tell it the way you told me.", seconds: 3 },
  { speaker: "JAMIE", text: "Okay. So at recess, Danny bet me he could hold his breath longer than the fish tank filter, and he couldn't, and Mrs. Ruiz had to come get him off the floor because he was laughing too hard to stand up.", seconds: 7 },
  { speaker: "MARA", text: "That's a good one. Anything else from this week?", seconds: 3 },
  { speaker: "JAMIE", text: "Um. Not really. Can I ask something?", seconds: 3 },
  { speaker: "MARA", text: "Sure.", seconds: 1 },
  { speaker: "JAMIE", text: "When she gets here — can you play it for her? The tape?", seconds: 4 },
  { speaker: "MARA", text: "Yes. We can.", seconds: 2 },
  { speaker: "JAMIE", text: "Okay. Good.", seconds: 2 },
  { speaker: "MARA", text: "That's everything for today. Good session.", seconds: 3 },
];

// LR-01 — the full master reel for that same date, kept separately from the
// take-home copies. This is where the recording continues past the point
// where the personal copy ends, into the conversation after the session.
const LR_01_MASTER_REEL: RecordingLine[] = [
  { speaker: "MARA", text: "[Session ambient: several children talking at once, a recorder being passed around.]", seconds: 3 },
  { speaker: "MARA", text: "Okay, everyone, let's start wrapping up — recorders off, one at a time.", seconds: 3 },
  { speaker: "MARA", text: "[Chairs, footsteps, a door. The room empties. A long quiet stretch.]", seconds: 4 },
  { speaker: "MARA", text: "[A different door opens, later.]", seconds: 2 },
  { speaker: "ELENA", text: "Is she gone already?", seconds: 3 },
  { speaker: "MARA", text: "About half an hour ago. Her grandmother came.", seconds: 3 },
  { speaker: "ELENA", text: "Of course she did.", seconds: 3 },
  { speaker: "MARA", text: "[A chair scrapes. A pause.]", seconds: 3 },
  { speaker: "MARA", text: "If you want, I can put a few words on the end of today's reel. She could hear it later — I can't promise when, but I'll keep it filed with hers.", seconds: 6 },
  { speaker: "ELENA", text: "Okay. Okay, um — is it going?", seconds: 3 },
  { speaker: "MARA", text: "It's going.", seconds: 2 },
  { speaker: "ELENA", text: "Hi, love. It's Mum.", seconds: 2 },
  { speaker: "ELENA", text: "I came to get you. I'm here now, but you've already gone with Grandma.", seconds: 5 },
  { speaker: "ELENA", text: "The bus was diverted. I called to say I was running late, but I couldn't tell them how long.", seconds: 6 },
  { speaker: "ELENA", text: "[Pause.]", seconds: 2 },
  { speaker: "ELENA", text: "We were supposed to have dinner.", seconds: 2.5 },
  { speaker: "ELENA", text: "I've still got the little menu you brought home. It's in my bag. You circled something, but you wouldn't tell me what it was.", seconds: 8 },
  { speaker: "ELENA", text: "[Take a small breath.]", seconds: 2 },
  { speaker: "ELENA", text: "You must have been angry, waiting for me. You're allowed to be. I didn't do what I promised today.", seconds: 6 },
  { speaker: "ELENA", text: "[Longer pause.]", seconds: 3 },
  { speaker: "ELENA", text: "Mara tried calling Grandma's house. No one's home yet. I have to leave for the station in a minute, so I'm leaving this here for you.", seconds: 8 },
  { speaker: "ELENA", text: "I wanted to hear about your afternoon.", seconds: 3 },
  { speaker: "ELENA", text: "When you hear this—", seconds: 2 },
  { speaker: "ELENA", text: "[Stop briefly, then begin again.]", seconds: 2.5 },
  { speaker: "ELENA", text: "I'm sorry I wasn't here when you needed me.", seconds: 3 },
  { speaker: "MARA", text: "I've got it. I'll keep this one with her copy — well, near it.", seconds: 3 },
];

// A short sequence the player can assemble at the very end, placing a line
// from the child's recording next to a line from the mother's message.
// Explicitly labeled "then" vs "now" in the UI — this pairing was never a
// real exchange, only something the player constructs after the fact.
export const ASSEMBLED_SEQUENCE: { speaker: string; text: string; when: "then" | "now" }[] = [
  { speaker: "JAMIE", text: "When she gets here — can you play it for her? The tape?", when: "then" },
  { speaker: "MARA", text: "Yes. We can.", when: "then" },
  { speaker: "ELENA", text: "You must have been angry, waiting for me. You're allowed to be. I didn't do what I promised today.", when: "now" },
];

export const RECORDING_SEGMENTS: Record<string, RecordingSegment[]> = {
  "LR-01": [
    { label: "Session: start", lineIndex: 0 },
    { label: "Session: end", lineIndex: 2 },
    { label: "After session (the message)", lineIndex: 4 },
  ],
};

export const RECORDINGS: Record<string, RecordingLine[]> = {
  "RR-03": RR_03_PERSONAL_RECORDING,
  "LR-01": LR_01_MASTER_REEL,
};

// Optional real voice-over, played alongside the simulated timed-text reveal
// above. Add a file at the given path and it plays automatically; if it's
// missing, playback is unaffected (see README.md's "Adding real narration
// audio" section). The per-line `seconds` values above double as the cue
// points used to sync/seek this audio, so retune them once a real recording
// exists if the pacing drifts.
export const RECORDING_AUDIO: Record<string, string> = {
  "LR-01": "/audio/lr-01-message.mp3",
};

// The audio file need not cover the whole transcript — lr-01-message.mp3 is
// just Elena's message (time 0 in the file = "Hi, love. It's Mum.", index 11
// below), not the Mara framing conversation before it. This says which
// transcript line each recording's audio file actually starts at, so
// earlier lines stay text-only (silent) and the file is only played/seeked
// once playback reaches this index.
export const RECORDING_AUDIO_START: Record<string, number> = {
  "LR-01": 11,
};

export function getRecording(evidenceId: string): RecordingLine[] | undefined {
  return RECORDINGS[evidenceId];
}

export function getSegments(evidenceId: string): RecordingSegment[] | undefined {
  return RECORDING_SEGMENTS[evidenceId];
}

export function getRecordingAudio(evidenceId: string): string | undefined {
  return RECORDING_AUDIO[evidenceId];
}

export function getRecordingAudioStart(evidenceId: string): number {
  return RECORDING_AUDIO_START[evidenceId] ?? 0;
}
