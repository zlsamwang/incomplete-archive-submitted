import type { AccountTopic } from "./types";

// The final desk scene draws its sentence bank from here. Topics T1–T3 offer
// a supported fact (unlocked once its evidence is discovered), a qualified
// interpretation, a claim that reaches past what the record shows (flagged,
// not forbidden), and an "omit" option that's always free. T4 is different:
// it's multiSelect, because feelings about what you've learned aren't
// mutually exclusive — comfort and regret can both be true at once.

export const OPENING_SENTENCE = "She promised to come that day. She didn't.";

export const ACCOUNT_TOPICS: AccountTopic[] = [
  {
    id: "T1-arrival",
    title: "Whether she came",
    prompt: "For years, you remembered it simply: she promised, and she didn't come. What does the note say now?",
    options: [
      {
        id: "T1-fact",
        kind: "fact",
        sentence:
          "She arrived after I had left. My grandmother picked me up at 5:20; she signed in at 5:47, twenty-seven minutes later.",
        citesEvidence: ["RR-04", "SR-01"],
        requiresEvidence: ["RR-04", "SR-01"],
      },
      {
        id: "T1-interpretation",
        kind: "interpretation",
        sentence:
          "However narrow the gap, it seems she meant to keep at least part of what she promised, even if it was already too late for the part that mattered most to me.",
        requiresEvidence: ["SR-01"],
      },
      {
        id: "T1-overreach",
        kind: "overreach",
        sentence: "She only came at all because she felt guilty afterward, not because she meant to see me.",
        gapNote:
          "The sign-in log records that she came and when. It doesn't record why, or what she was feeling — that assigns her a motive the record can't support.",
        requiresEvidence: ["SR-01"],
      },
      { id: "T1-omit", kind: "omit" },
    ],
  },
  {
    id: "T2-reason",
    title: "Why she was late",
    prompt: "The record has something to say about the delay itself — not everything, but something.",
    options: [
      {
        id: "T2-fact",
        kind: "fact",
        sentence:
          "She had promised in writing to be back by 4:30. She called at 4:45 to say a diversion on Route 12 had delayed her and that she couldn't give a reliable time — a diversion the transit authority independently confirms.",
        citesEvidence: ["AR-03", "SR-02", "SR-03"],
        requiresEvidence: ["AR-03", "SR-02", "SR-03"],
      },
      {
        id: "T2-interpretation",
        kind: "interpretation",
        sentence:
          "It's possible she did what she reasonably could once things went wrong, and the rest came down to timing she didn't fully control.",
        requiresEvidence: ["SR-02"],
      },
      {
        id: "T2-overreach",
        kind: "overreach",
        sentence: "She could easily have left earlier and simply chose not to.",
        gapNote:
          "Nothing in her note, the phone slip, or the transit notice records when she left home or whether an earlier departure was realistically possible — this claims certainty the record doesn't have, in either direction.",
        requiresEvidence: ["SR-02"],
      },
      { id: "T2-omit", kind: "omit" },
    ],
  },
  {
    id: "T3-message",
    title: "The message she left",
    prompt: "There is a recording most people never came back for. What does the note say about it?",
    options: [
      {
        id: "T3-fact",
        kind: "fact",
        sentence:
          "My personal copy was sealed at 5:05, before she arrived. The full master reel — always available on request, by standing policy — kept recording, and she left a message on it that no one, including me, ever asked to hear until tonight.",
        citesEvidence: ["CO-02", "CO-04", "LR-01"],
        requiresEvidence: ["CO-02", "CO-04", "LR-01"],
      },
      {
        id: "T3-interpretation",
        kind: "interpretation",
        sentence:
          "Choosing to leave a message at all, once she realized she'd missed me, suggests she wanted to be heard eventually — not just to apologize in the moment and leave.",
        requiresEvidence: ["LR-01"],
      },
      {
        id: "T3-overreach",
        kind: "overreach",
        sentence: "She knew exactly how to reach me afterward and simply never tried again.",
        gapNote:
          "Nothing here documents what happened between that day and now — no later letters, no other attempts, no silence either. This claims knowledge of years the archive has no record of.",
        requiresEvidence: ["LR-01"],
      },
      { id: "T3-omit", kind: "omit" },
    ],
  },
  {
    id: "T4-now",
    title: "How I feel about hearing it now",
    prompt:
      "The recording answers what happened. It doesn't answer what it means. Choose as many of these as feel true — or none.",
    multiSelect: true,
    options: [
      {
        id: "T4-comfort",
        kind: "interpretation",
        sentence: "It helps to know she came.",
      },
      {
        id: "T4-regret",
        kind: "interpretation",
        sentence: "I still remember being left waiting.",
      },
      {
        id: "T4-uncertain",
        kind: "unresolved",
        sentence: "I don't know yet what this changes.",
      },
      {
        id: "T4-overreach",
        kind: "overreach",
        sentence: "Now that I've heard this, there's nothing left to forgive.",
        gapNote:
          "A recording of one afternoon, however honest, doesn't settle what came after it or resolve years on its own — that's a larger claim than this evidence can carry.",
      },
    ],
  },
];

export function getTopic(id: string) {
  return ACCOUNT_TOPICS.find((t) => t.id === id);
}
