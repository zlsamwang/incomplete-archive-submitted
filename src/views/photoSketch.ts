// Simple line-art sketches for the three "photograph" evidence items,
// drawn directly onto a <canvas> at render time — no external image files,
// consistent with the rest of the game's flat-shaded, procedural-only look
// (see README's "What's limited" note on why there's no photographic art).
// Deliberately plain: thin ink lines on a cream ground, not a realistic
// illustration, so it reads as a sketch of a photo rather than competing
// with it.

function setupInk(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#3a2c1e";
  ctx.fillStyle = "#3a2c1e";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

function drawSeatedFigure(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  // A simple seated silhouette: head, torso, folded legs. y is the seat surface.
  ctx.beginPath();
  ctx.arc(x, y - 34 * scale, 9 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 25 * scale);
  ctx.lineTo(x, y - 6 * scale);
  ctx.lineTo(x + 16 * scale, y);
  ctx.moveTo(x, y - 6 * scale);
  ctx.lineTo(x - 14 * scale, y);
  ctx.stroke();
}

function drawEventPhoto(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Window with a diagonal crack (taped) on the left; a bench with a lone
  // seated child in the middle; a door on the right.
  const winX = w * 0.1, winY = h * 0.14, winW = w * 0.22, winH = h * 0.55;
  ctx.strokeRect(winX, winY, winW, winH);
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH / 2);
  ctx.lineTo(winX + winW, winY + winH / 2);
  ctx.stroke();
  // The crack, upper pane.
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(winX + winW * 0.2, winY + winH * 0.12);
  ctx.lineTo(winX + winW * 0.45, winY + winH * 0.32);
  ctx.stroke();
  // Tape over it.
  ctx.strokeRect(winX + winW * 0.24, winY + winH * 0.14, winW * 0.16, winH * 0.1);
  ctx.restore();

  // Bench.
  const benchY = h * 0.72, benchX = w * 0.44, benchW = w * 0.26;
  ctx.strokeRect(benchX, benchY, benchW, h * 0.045);
  ctx.beginPath();
  ctx.moveTo(benchX + 6, benchY + h * 0.045);
  ctx.lineTo(benchX + 6, benchY + h * 0.13);
  ctx.moveTo(benchX + benchW - 6, benchY + h * 0.045);
  ctx.lineTo(benchX + benchW - 6, benchY + h * 0.13);
  ctx.stroke();
  drawSeatedFigure(ctx, benchX + benchW * 0.55, benchY, Math.min(w, h) / 260);

  // Door, right side.
  const doorX = w * 0.78, doorY = h * 0.16, doorW = w * 0.14, doorH = h * 0.62;
  ctx.strokeRect(doorX, doorY, doorW, doorH);
  ctx.beginPath();
  ctx.arc(doorX + doorW * 0.18, doorY + doorH * 0.52, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawClockFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // Hands at 4:15 — hour hand a bit past 4, minute hand at 3 (the "15").
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.5 * Math.sin((4.25 / 12) * Math.PI * 2), cy - r * 0.5 * Math.cos((4.25 / 12) * Math.PI * 2));
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.75 * Math.sin((15 / 60) * Math.PI * 2), cy - r * 0.75 * Math.cos((15 / 60) * Math.PI * 2));
  ctx.stroke();
}

function drawGroupPhoto(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const scale = Math.min(w, h) / 260;
  drawClockFace(ctx, w * 0.5, h * 0.16, 16 * scale);

  const tableY = [h * 0.5, h * 0.78];
  tableY.forEach((ty) => {
    ctx.strokeRect(w * 0.08, ty, w * 0.84, h * 0.05);
    const kidCount = 4;
    for (let i = 0; i < kidCount; i++) {
      const x = w * 0.16 + i * (w * 0.68) / (kidCount - 1);
      drawSeatedFigure(ctx, x, ty, scale * 0.85);
      // A small handheld recorder in front of each.
      ctx.strokeRect(x - 6 * scale, ty - 2, 12 * scale, 6 * scale);
    }
  });
}

function drawContactSheet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cols = 4, rows = 3;
  const margin = w * 0.06;
  const cellW = (w - margin * 2) / cols;
  const cellH = (h * 0.82 - margin) / rows;
  let frame = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = margin + c * cellW;
      const y = margin * 0.6 + r * cellH;
      ctx.strokeRect(x + 3, y + 3, cellW - 6, cellH - 6);
      frame++;
      // The later frames (last row) show the room emptying: a couple of
      // small figures near a doorway instead of a full table of kids.
      if (r < rows - 1) {
        drawSeatedFigure(ctx, x + cellW / 2, y + cellH - 10, 0.32);
      } else if (c < 2) {
        drawSeatedFigure(ctx, x + cellW * (0.35 + c * 0.3), y + cellH - 10, 0.3);
      }
    }
  }
  // The handwritten margin note.
  ctx.save();
  ctx.font = `italic ${Math.round(h * 0.05)}px Georgia, serif`;
  ctx.fillText("5:15 — most kids gone.", margin, h * 0.94);
  ctx.restore();
}

export function drawPhotoSketch(canvas: HTMLCanvasElement, evidenceId: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f4ecd8";
  ctx.fillRect(0, 0, w, h);
  setupInk(ctx);

  switch (evidenceId) {
    case "PR-01":
      drawEventPhoto(ctx, w, h);
      break;
    case "PR-02":
      drawGroupPhoto(ctx, w, h);
      break;
    case "PR-03":
      drawContactSheet(ctx, w, h);
      break;
  }
}
