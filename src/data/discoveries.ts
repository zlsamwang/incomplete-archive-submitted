export interface Discovery {
  id: string;
  title: string;
  requires: string[];
  /** Written as an observation the player has assembled, not an announcement. */
  summary: string;
  /**
   * Three progressively specific hints, revealed one at a time on request:
   * 1) points to the unresolved question, 2) names relevant evidence/room,
   * 3) explains the connection outright.
   */
  hints: [string, string, string];
}

// A discovery "unlocks" once every listed evidence ID has been seen. The
// notebook surfaces the summary passively once that happens — it is not
// pushed at the player mid-exploration.
export const DISCOVERIES: Discovery[] = [
  {
    id: "D-arrival",
    title: "She came, after you had already gone",
    requires: ["RR-04", "SR-01"],
    summary:
      "The duty log and the sign-in log agree: your grandmother picked you up at 5:20 PM. Your mother signed in at 5:47 — twenty-seven minutes later. She wasn't lying, all those years, when she said she came. You had simply already left.",
    hints: [
      "Two logs from that day each give a different time. What do they say happened around 5:20, and around 5:47?",
      "Check the Front Desk Duty Log in Reception, and the Visitor Sign-In Log in Storage.",
      "The duty log records your grandmother's pickup at 5:20 PM. The sign-in log records your mother's arrival at 5:47 PM — after you had already left.",
    ],
  },
  {
    id: "D-explanation",
    title: "She tried to explain, and partly did",
    requires: ["SR-02", "SR-03", "AR-03"],
    summary:
      "A phone slip shows she called at 4:45, already behind her own 4:30 promise, caught in a diversion on Route 12 — a diversion the transit authority confirms independently. Both are documented on their own. What isn't documented is whether she could have left home earlier and avoided the timing altogether.",
    hints: [
      "She promised a specific time in writing. What happened between that promise and her arrival?",
      "Look for her advance note and a phone message and transit notice, all in Reception and Storage.",
      "She promised 4:30 in a note left that afternoon. She called at 4:45 to say Route 12 was diverted — confirmed by a public transit notice — and couldn't give a reliable time.",
    ],
  },
  {
    id: "D-message",
    title: "The message that was never delivered",
    requires: ["RR-03", "CO-02", "CO-04", "LR-01"],
    summary:
      "Your copy ends with a question: will Mara play it for your mother? The duplication record, the policy memo, and the master reel answer it together — your copy was sealed at 5:05, before she arrived; the master reel kept recording; and she left a message of her own that was archived correctly and simply never requested, by anyone, until now.",
    hints: [
      "Your own recording asks a question it never answers. Where might the answer actually live?",
      "Check the duplication timestamp on your copy in Storage, and then the master reel in the Listening Room.",
      "Your copy was sealed at 5:05 PM, before your mother arrived at 5:47. Policy always kept master reels separate and available on request — the Listening Room's master reel holds what happened after your copy ended.",
    ],
  },
];
