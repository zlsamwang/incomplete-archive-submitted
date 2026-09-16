import { defineConfig } from "vite";

// GitHub Pages serves a project repo (not a user/org page) from
// https://<user>.github.io/<repo-name>/, so every asset URL needs that
// repo-name prefix. Locally (`npm run dev`/`npm run build` + `preview`)
// this has no effect — base stays "/" unless GITHUB_PAGES is set, which
// only the deploy workflow sets.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/incomplete-archive-submitted/" : "/",
});
