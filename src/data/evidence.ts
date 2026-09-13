import type { Evidence } from "./types";

// ---------------------------------------------------------------------------
// A VOICE THAT CAME LATE — evidence data
//
// You were eight years old on September 14, waiting at this archive for your
// mother, who had promised to meet you here at 4:30 PM and take you to
// dinner before catching her intercity bus out of town. She didn't come
// while you were still there. Years later, the archive is relocating, and
// former participants in its children's recording program have been invited
// back to collect their personal copies. You've come for yours.
//
// Every fictional detail (names, dates, times, catalog codes) is written in
// full and is internally consistent. See DESIGN.md for the evidence matrix
// and chronology this content was checked against.
// ---------------------------------------------------------------------------

export const EVIDENCE: Evidence[] = [
  // ------------------------------------------------------ READING / RECEPTION
  {
    id: "RR-01",
    title: "Staff Note",
    room: "reading",
    medium: "note",
    summary: "The task for tonight, left on the reception desk.",
    content: [
      "To former participants of the Children's Recording Project —",
      "Before the archive relocates, we're returning personal recording copies to anyone who took part and can still be reached. If your copy is here, it's in a folder with your name on it, and the reception player is free to use.",
      "We ask that you leave a short note with your copy before you go — just a line or two, for our own closing records. There's a desk at the back for it.",
      "Mara Doyle, who ran the recording program for many years, retired last spring. She left the files in good order. Take your time. Lights off by ten.",
      "— ZL Wang, Director",
    ],
    details: [
      "The note is generic — clearly sent to more than one former participant — but someone has added your name by hand at the top.",
      "This is the first mention of Mara Doyle by name: she isn't here tonight, but her handwriting and initials (M.D.) turn up throughout the archive.",
    ],
    connections: [],
    establishes: [
      "The archive is returning personal recording copies from a children's recording program to former participants before relocating.",
      "Mara Doyle ran the program for years and has since retired.",
      "The task tonight is to leave a short note alongside the recording you came to collect.",
    ],
    suggests: [],
  },
  {
    id: "RR-02",
    title: "Personal Folder",
    room: "reading",
    medium: "note",
    summary: "A folder with your name on it, holding your claim slip.",
    content: [
      "A manila folder, tab labeled with your name in block letters.",
      "Inside: a claim slip. “CHILDREN'S RECORDING PROJECT — SEPT. 14, personal copy. Reel ref: MC-0914-P.”",
      "Tucked behind the slip, a second note, handwritten:",
      "“If they come back — there's more on the full reel (MC-0914). Ask at the desk. — M.D.”",
    ],
    details: [
      "The claim slip's reference code, MC-0914-P, distinguishes your personal copy (“-P”) from a fuller reel filed under a related code.",
      "This note was written some time ago, for someone who might never have come back to read it. You are the first to.",
      "“Ask at the desk” is years out of date — reception wouldn't have this on hand. Whatever holds a reel like MC-0914 now, it'll be wherever the archive actually shelves its older material.",
    ],
    connections: ["CO-02", "SR-04"],
    establishes: [
      "Your personal copy is catalogued separately from a longer master reel referenced by a related code, MC-0914.",
    ],
    suggests: [
      "Whoever wrote the note expected, or at least hoped, that you might come back for more than just your own copy.",
    ],
  },
  {
    id: "RR-03",
    title: "Reception Cassette Player — Your Personal Recording",
    room: "reading",
    medium: "recording",
    summary: "Your take-home copy from September 14 — a school story, and a question.",
    time: { label: "Recorded during session, ~4:50 PM", sortKey: 1650 },
    content: [
      "Your personal copy from the Children's Recording Project, September 14. Labeled by hand: “MC-0914-P.”",
      "Use the reception player to hear it, or read the full accessible transcript below — nothing in this recording is only available as sound.",
    ],
    details: [
      "Near the end, you ask Mara whether she can play the recording for your mother when she arrives.",
      "Mara says yes. Nothing on this copy tells you whether that happened — it was made and sealed before the session even ended.",
    ],
    connections: ["CO-02", "LR-01"],
    establishes: [
      "You asked Mara, on tape, to play your recording for your mother when she arrived, and Mara agreed.",
    ],
    suggests: [],
  },
  {
    id: "RR-04",
    title: "Front Desk Duty Log",
    room: "reading",
    medium: "ledger",
    summary: "The reception duty log for that afternoon.",
    time: { label: "Pickup logged 5:20 PM", sortKey: 1720 },
    content: [
      "A bound duty log, kept at the reception desk, still in daily use.",
      "“5:20 PM — Jamie picked up by grandmother (R. Cortez), per emergency contact on file. Mother not yet arrived; session ended 5:00, child had been waiting since.”",
    ],
    details: [
      "The twenty-minute gap between session end (5:00) and pickup (5:20) is ordinary — staff routinely wait that long before calling an emergency contact.",
      "This entry alone doesn't say whether your mother arrived later that evening — only that she hadn't yet, as of 5:20.",
    ],
    connections: ["SR-01", "AR-01"],
    establishes: [
      "Your grandmother picked you up at 5:20 PM under standing emergency-contact arrangements, twenty minutes after the session ended.",
    ],
    suggests: [],
  },
  {
    id: "RR-05",
    title: "The Corner Bench",
    room: "reading",
    medium: "object",
    summary: "A bench by the reception window — a landmark you half-recognize.",
    content: [
      "An old wooden bench under the reception window, one arm worn pale. The window beside it has a small diagonal crack in the upper pane, taped from the inside for as long as anyone can remember.",
      "You don't remember sitting here specifically. But something about the shape of the light through that cracked pane feels familiar.",
    ],
    details: [
      "The cracked windowpane is distinctive enough to recognize elsewhere — in a photograph, for instance.",
    ],
    connections: ["PR-01"],
    establishes: [],
    suggests: [
      "This bench, under this specific cracked window, may be the same spot shown in an old event photograph elsewhere in the archive.",
    ],
  },

  // ---------------------------------------------------- CHILDREN'S ACTIVITY ROOM
  {
    id: "AR-01",
    title: "Activity Schedule",
    room: "reading",
    medium: "document",
    summary: "The standing schedule for the Children's Recording Project.",
    time: { label: "Session: 3:30–5:00 PM", sortKey: 1530 },
    content: [
      "A printed schedule, laminated, still pinned to the activity room board.",
      "“CHILDREN'S RECORDING PROJECT — WEEKLY SESSION. 3:30–5:00 PM. Parents/guardians collecting early should check in with staff.”",
    ],
    details: [
      "The session's official end time, 5:00 PM, is a fixed, checkable point — not a memory.",
    ],
    connections: ["RR-04", "AR-03"],
    establishes: [
      "The Children's Recording Project ran 3:30 to 5:00 PM as a standing weekly schedule.",
    ],
    suggests: [],
  },
  {
    id: "AR-02",
    title: "Session Sign-In Sheet",
    room: "reading",
    medium: "ledger",
    summary: "The attendance sheet for September 14.",
    content: [
      "A sign-in sheet, one line per child, parent or guardian signature required at drop-off.",
      "Your name appears near the bottom, dropped off at 3:25 PM by your mother — her signature is there, ordinary and unremarkable, five minutes before the session started.",
    ],
    details: [
      "Your mother was present and on time at drop-off, 3:25 PM — whatever happened later that afternoon, the day didn't start with her missing anything.",
    ],
    connections: ["AR-01"],
    establishes: [
      "Your mother dropped you off for the session on time, at 3:25 PM, and signed you in herself.",
    ],
    suggests: [],
  },
  {
    id: "AR-03",
    title: "Advance Note from a Parent",
    room: "reading",
    medium: "note",
    summary: "A note your mother left with staff that afternoon, before the session began.",
    time: { label: "Written ~3:25 PM; promises 4:30 PM", sortKey: 1525 },
    content: [
      "A short note, clipped inside the activity room's daily folder, in handwriting the sign-in sheet confirms as your mother's.",
      "“Back by 4:30 to watch the end and take Jamie to dinner — my bus is at 6:15, cutting it close but should be fine. Thank you for having her today. — E. Cortez”",
    ],
    details: [
      "This note was written and left in advance, the same afternoon, before anything went wrong — it documents a real plan, not just your memory of one.",
      "“Cutting it close but should be fine” is her own assessment, written in advance, of how tight the timing already was before any delay.",
    ],
    connections: ["AR-01", "SR-02"],
    establishes: [
      "Your mother left a written note that afternoon promising to return by 4:30 PM, and acknowledged in her own words that the timing was already tight.",
    ],
    suggests: [],
    backContent: [
      "On the back, in the same hand, added in different ink — clearly later, maybe a second thought before she left the note:",
      "“If I'm late, tell her I'm coming.”",
    ],
  },

  // ---------------------------------------------------------- PHOTOGRAPH GALLERY
  {
    id: "PR-01",
    title: "Event Photo",
    room: "photograph",
    medium: "photograph",
    summary: "A photo from the reception area, framed on the gallery wall.",
    content: [
      "A framed photograph, a little faded, taken from just inside the reception area.",
      "A child sits alone on a wooden bench by the window, watching the door. The window beside the bench has a small diagonal crack in the upper pane, taped from the inside.",
      "It's the same bench. The same crack. You're looking at where you used to sit.",
    ],
    details: [
      "The bench and the cracked windowpane match the reception area exactly, down to the tape over the crack.",
      "The child in the photo isn't posed — this reads as a candid shot of someone waiting, not a group portrait.",
    ],
    connections: ["RR-05", "PR-03"],
    establishes: [
      "The child photographed waiting alone on the reception bench, by the cracked window, is you.",
    ],
    suggests: [],
    backContent: [
      "On the back, a photo lab stamp: “DEV: SEPT 16.” Beneath it, in pencil: “reception, waiting.”",
    ],
  },
  {
    id: "PR-02",
    title: "Group Activity Photo",
    room: "photograph",
    medium: "photograph",
    summary: "A photo from inside the activity room during a session.",
    content: [
      "A group photo, several kids at long tables with handheld recorders, mid-session.",
      "A wall clock behind the tables reads 4:15.",
    ],
    details: [
      "The clock gives a specific, checkable time, corroborating that this session ran through the mid-afternoon as scheduled.",
    ],
    connections: ["AR-01"],
    establishes: [],
    suggests: [],
  },
  {
    id: "PR-03",
    title: "Contact Sheet, End of Day",
    room: "photograph",
    medium: "photograph",
    summary: "A sleeve of small photos from the end of that same session.",
    content: [
      "A contact sheet, a dozen small frames, kept in a paper sleeve.",
      "The later frames show the room emptying — tables being cleared, a few kids at the door with parents.",
      "In the corner of the sleeve, handwritten: “5:15 — most kids gone. Jamie still on the bench by the window.”",
    ],
    details: [
      "The handwritten note gives a specific time — 5:15 — fifteen minutes after the session ended, and confirms you were still there, alone, at that point.",
      "The handwriting matches the initials “M.D.” found elsewhere in the archive.",
    ],
    connections: ["PR-01", "RR-04"],
    establishes: [
      "At 5:15 PM, after most other children had been picked up, you were still waiting on the bench by the window.",
    ],
    suggests: [],
  },

  // -------------------------------------------------------------- CATALOG OFFICE
  {
    id: "CO-01",
    title: "Catalog Card — Reel MC-0914",
    room: "storage",
    medium: "ledger",
    summary: "The catalog's own brief summary of the full session reel.",
    content: [
      "A catalog card, typed, filed under “Children's Recording Project — Master Reels.”",
      "“MC-0914. Sept. 14. Full session + late parent message. Unclaimed. See relocation inventory for current location.”",
    ],
    details: [
      "“Late parent message” is the entire description the catalog gives it — four words, no names, no tone, no context.",
      "“Unclaimed” is a plain administrative fact: filed correctly, never picked up, no judgment attached.",
    ],
    connections: ["CO-03", "LR-01"],
    establishes: [
      "The catalog has known about a “late parent message” on reel MC-0914 for as long as the reel has been filed — it was never a secret, just never collected.",
    ],
    suggests: [],
    backContent: [
      "On the back, a short access history, ruled into rows for stamping each time the reel is checked out or requested.",
      "Every row is blank. No entries.",
    ],
  },
  {
    id: "CO-02",
    title: "Tape Duplication Record",
    room: "storage",
    medium: "ledger",
    summary: "The record of when your personal copy was actually made.",
    time: { label: "Personal copy duplicated 5:05 PM", sortKey: 1705 },
    content: [
      "A duplication log, one line per copy made that week.",
      "“Sept. 14, 5:05 PM — MC-0914-P duplicated from master (child's personal copy). Sealed same day.”",
    ],
    details: [
      "5:05 PM — your personal copy was made and sealed five minutes after the session ended, well before 5:47.",
      "This is the plain mechanical reason your copy doesn't include anything that happened later that evening: it didn't exist yet.",
    ],
    connections: ["RR-03", "RR-02"],
    establishes: [
      "Your personal copy was duplicated and sealed at 5:05 PM — before your mother arrived at the archive that evening.",
    ],
    suggests: [],
  },
  {
    id: "CO-03",
    title: "Relocation Inventory",
    room: "storage",
    medium: "document",
    summary: "The moving inventory, tracking which shelf holds which reel tonight.",
    content: [
      "A printed inventory sheet for tonight's relocation, updated in pen as boxes are packed.",
      "“MC-0914 (master) — Storage, shelf C-2, box marked ‘CHILDREN'S PROJECT, MASTERS — DO NOT DISCARD.’ Logged for review; hold at Listening Room until collected.”",
    ],
    details: [
      "This gives an exact, physical location — not a metaphor. Someone can walk to shelf C-2 in Storage and find the actual box.",
      "“Hold at Listening Room until collected” means the reel itself has already been moved there for tonight, ready to play.",
    ],
    connections: ["SR-04", "LR-01"],
    establishes: [
      "The master reel, MC-0914, was pulled from Storage shelf C-2 and moved to the Listening Room for anyone who comes to collect it tonight.",
    ],
    suggests: [],
  },
  {
    id: "CO-04",
    title: "Archive Policy Memo",
    room: "storage",
    medium: "document",
    summary: "A standing internal memo explaining how personal copies and master reels are handled.",
    content: [
      "A photocopied memo, undated, clearly reissued periodically — general policy, not written about you.",
      "“Personal take-home copies are duplicated and sealed at session's end. Full master reels are retained separately and are not distributed, regardless of later additions. Families may request access to a master reel directly.”",
    ],
    details: [
      "“Regardless of later additions” is the key phrase — this policy exists independent of your family's situation, and would have kept any later message off the personal copy no matter what.",
      "“Families may request access” confirms the master reel was always available to you — it simply required someone to ask.",
    ],
    connections: ["CO-02", "RR-03"],
    establishes: [
      "Archive policy has always kept personal copies sealed at session's end and master reels separate, regardless of anything added later — and always allowed families to request the master reel directly.",
    ],
    suggests: [],
  },

  // ------------------------------------------------------------------- STORAGE
  {
    id: "SR-01",
    title: "Visitor Sign-In Log",
    room: "storage",
    medium: "ledger",
    summary: "The archive's sign-in book for September 14, boxed for the move.",
    time: { label: "Arrival logged 5:47 PM", sortKey: 1747 },
    content: [
      "A bound sign-in log, kept at the front desk that year, later boxed with other daily records.",
      "The page for September 14 lists visitors by name and time. Near the bottom: “Elena Cortez — 5:47 PM — here for Jamie, Children's Recording Project.”",
      "Beside the entry, in a different pen, added later: “Message recorded after session. See master tape. — M.D.”",
    ],
    details: [
      "5:47 PM is a specific, recorded time — not a memory, not an estimate.",
      "The added note was clearly written after the fact, once the recording had actually been made — a small act of record-keeping, not a message meant for anyone in particular at the time.",
    ],
    connections: ["RR-04", "CO-01", "LR-01"],
    establishes: [
      "Elena Cortez signed in at the archive at 5:47 PM on September 14, asking for you by name, and a recorded message resulted from that visit.",
    ],
    suggests: [],
  },
  {
    id: "SR-02",
    title: "Phone Message Slip",
    room: "storage",
    medium: "document",
    summary: "A handwritten phone message taken by staff that afternoon.",
    time: { label: "Call logged ~4:45 PM", sortKey: 1645 },
    content: [
      "A small paper message slip, the kind used to record phone calls for someone not at their desk.",
      "“4:45 PM — Call for Mara re: Jamie. Caller (mother) says Route 12 is on a diversion, running late, can't say exactly when. Asked us to keep Jamie a little longer if we could.”",
    ],
    details: [
      "The call came in at 4:45 — fifteen minutes after her promised 4:30, and while the session was still running.",
      "She explicitly could not give a reliable arrival time — this is recorded as her own words, not staff guessing on her behalf.",
      "The slip records a request (“keep her a little longer”) and nothing about what she did afterward — it does not record when she left wherever she was calling from.",
    ],
    connections: ["SR-03", "AR-03", "LR-01"],
    establishes: [
      "Your mother called the archive at 4:45 PM to say she'd been caught in a diversion on Route 12 and could not give a reliable arrival time.",
    ],
    suggests: [],
  },
  {
    id: "SR-03",
    title: "Transit Diversion Notice",
    room: "storage",
    medium: "document",
    summary: "A public transit notice for September 14, kept with that month's records.",
    content: [
      "A printed transit authority notice, dated September 14: “Route 12 diverted due to a water main repair between 4th and Aldrich, effective 2:00–6:00 PM. Expect delays of 25–40 minutes.”",
      "Route 12 runs along the street the archive's cross-town buses use.",
    ],
    details: [
      "This is a public record, not something written for or about your mother specifically — it would have affected anyone on that route that afternoon.",
      "A 25–40 minute delay on this route, on top of an already tight 4:30 plan, is consistent with an arrival well after 5:00 PM.",
    ],
    connections: ["SR-02"],
    establishes: [
      "A real transit diversion affected Route 12 that afternoon, with expected delays of 25 to 40 minutes.",
    ],
    suggests: [],
  },
  {
    id: "SR-04",
    title: "Storage Shelf C-2",
    room: "storage",
    medium: "object",
    summary: "The shelf marked in the relocation inventory — empty where the reel used to sit.",
    content: [
      "Shelf C-2, boxes marked “CHILDREN'S PROJECT, MASTERS — DO NOT DISCARD” stacked along it.",
      "One gap on the shelf, slightly cleaner than the dust around it, where a single reel was recently pulled.",
      "A sticky note on the shelf edge: “MC-0914 pulled 6 PM — held at Listening Room. — front desk”",
    ],
    details: [
      "The clean gap and the note agree: the reel you're looking for isn't here anymore — it's already waiting for you elsewhere.",
    ],
    connections: ["CO-03", "LR-01"],
    establishes: [
      "The master reel was pulled from this shelf earlier tonight and is waiting in the Listening Room.",
    ],
    suggests: [],
  },

  // ---------------------------------------------------------------- LISTENING ROOM
  {
    id: "LR-01",
    title: "Master Reel — MC-0914, Full Session, Sept. 14",
    room: "listening",
    medium: "recording",
    summary: "The complete session tape — including what happened after you left.",
    time: { label: "Message recorded after 5:47 PM", sortKey: 1748 },
    content: [
      "The full session reel for September 14, pulled from storage and left here for tonight. Marked: “MC-0914 — master. Do not distribute. Family may request access directly.”",
      "An index card is taped to the case: “Session: start. Session: end, approx. 34 min in. After session: approx. 41 min in.”",
      "You don't have to listen through the whole session again to find what you came for — use the index to jump to “After session.”",
    ],
    details: [
      "The recording continues well past the point where your personal copy ends.",
      "The conversation after the session takes place after 5:00 PM, after you had already left with your grandmother.",
    ],
    connections: ["RR-03", "CO-01", "CO-02", "SR-01", "SR-02"],
    establishes: [
      "Your mother arrived at the archive after you had left, spoke with Mara, and recorded a message addressed to you.",
      "The message explains that she was delayed by a diversion and a phone call, states plainly that she should have left home earlier, and does not blame the bus schedule for what happened.",
    ],
    suggests: [
      "Recording the message, rather than simply leaving, suggests she wanted you to eventually hear from her directly.",
    ],
  },
  {
    id: "LR-02",
    title: "Listening Room Log",
    room: "listening",
    medium: "ledger",
    summary: "A short log of who has requested master reels over the years.",
    content: [
      "A thin logbook by the listening station, tracking master-reel requests since the policy memo was issued.",
      "Most entries are routine — researchers, a family checking a wedding recording. Near the bottom of the page for this year: “MC-0914 — pulled for tonight's relocation review. No prior requests on file.”",
    ],
    details: [
      "“No prior requests on file” confirms that in all the years the master reel sat correctly filed and available, nobody — including you — ever asked for it before tonight.",
    ],
    connections: ["CO-04", "LR-01"],
    establishes: [
      "No one had ever requested access to the master reel before tonight, even though the policy memo confirms it was always available on request.",
    ],
    suggests: [],
  },
];

export function getEvidence(id: string): Evidence | undefined {
  return EVIDENCE.find((e) => e.id === id);
}

// Optional real photos for the three "photograph" evidence items. Add a
// file at the given path and it displays automatically in place of the
// line-art sketch; if it's missing, the sketch is shown instead — see
// public/photos/README.txt.
export const EVIDENCE_PHOTOS: Record<string, string> = {
  "PR-01": "/photos/pr01-event-photo.png",
  "PR-02": "/photos/pr02-group-activity-photo.png",
};

export function getEvidencePhoto(id: string): string | undefined {
  return EVIDENCE_PHOTOS[id];
}
