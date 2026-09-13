export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function paragraphs(lines: string[]): string {
  return lines.map((l) => `<p>${escapeHtml(l)}</p>`).join("");
}
