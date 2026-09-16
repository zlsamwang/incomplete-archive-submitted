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

/** Resolves a path under public/ against the app's actual base path (e.g. "/incomplete-archive-submitted/" on GitHub Pages, "/" locally), so hardcoded asset paths in data files keep working after deployment under a subpath. Pass the path without a leading slash, e.g. asset("audio/lr-01-message.mp3"). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
