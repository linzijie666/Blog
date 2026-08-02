import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readProjectFile = (filePath) => readFile(path.join(projectRoot, filePath), "utf8");

test("the layout stays fluid and uses dynamic viewport-safe section heights", async () => {
  const css = await readProjectFile("src/styles.css");

  assert.match(css, /\.section-screen\s*\{[^}]*min-height:\s*100dvh/s);
  assert.doesNotMatch(css, /body\s*\{[^}]*min-width:\s*1180px/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
});

test("the capabilities section uses an asymmetric visual hierarchy", async () => {
  const [app, css] = await Promise.all([
    readProjectFile("src/App.jsx"),
    readProjectFile("src/styles.css")
  ]);

  assert.match(app, /capability-card-primary/);
  assert.match(app, /capability-card-supporting/);
  assert.match(css, /\.capability-card-primary/);
  assert.match(css, /\.capability-card-supporting/);
});

test("the hero video is desktop-only and poster-first", async () => {
  const app = await readProjectFile("src/App.jsx");

  assert.match(app, /heroVideoEnabled/);
  assert.match(app, /preload="metadata"/);
  assert.match(app, /heroVideoEnabled\s*&&/);
});

test("motion has a reduced-motion fallback across CSS and animated text", async () => {
  const [css, textType, shinyText] = await Promise.all([
    readProjectFile("src/styles.css"),
    readProjectFile("src/components/TextType.jsx"),
    readProjectFile("src/components/ShinyText.jsx")
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(textType, /prefers-reduced-motion/);
  assert.match(shinyText, /useReducedMotion/);
});
