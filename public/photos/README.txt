HOW TO ADD A REAL PHOTO

PR-01 "Event Photo" and PR-02 "Group Activity Photo" already have real
photos in this folder (pr01-event-photo.png, pr02-group-activity-photo.png)
and display automatically in the evidence panel, in place of the drawn
line-art sketch used as a fallback.

To add one for PR-03 "Contact Sheet, End of Day", drop a file here named:

    pr03-contact-sheet.png

(any format an <img> tag can display works — .png, .jpg, .webp — just
match the extension in EVIDENCE_PHOTOS near the bottom of
src/data/evidence.ts, or add a new entry there if you use a different
filename.)

If a file is missing, or its path doesn't match what's in
EVIDENCE_PHOTOS, nothing breaks — the sketch is shown instead, with no
broken-image icon or error visible to the player.

A couple of practical notes:
- Any aspect ratio works — the image is cropped to fill a roughly 7:4.4
  frame (object-fit: cover), so a very tall or very wide source photo
  will get cropped at the edges. A roughly landscape photo fits best.
- Only use a photo you actually have the right to use.
