import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("root site exposes the expected static structure", async () => {
  const [html, css, script] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i);
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']/i);
  assert.match(html, /<script\s+type=["']module["']\s+src=["']script\.js["']>/i);
  assert.match(html, /href=["']#about["']/i);
  assert.match(html, /href=["']#projects["']/i);
  assert.match(html, /href=["']#games["']/i);
  assert.match(html, /id=["']about["']/i);
  assert.match(html, /id=["']projects["']/i);
  assert.match(html, /id=["']experience["']/i);
  assert.match(html, /id=["']research["']/i);
  assert.match(html, /id=["']games["']/i);
  assert.match(html, /id=["']contact["']/i);
  assert.match(html, /id=["']snake-board["']/i);
  assert.match(html, /id=["']game-status["']/i);
  assert.match(html, /id=["']game-start["']/i);
  assert.match(html, /id=["']game-restart["']/i);
  assert.match(html, /data-direction=["']up["']/i);
  assert.match(html, /data-direction=["']right["']/i);
  assert.match(html, /data-direction=["']down["']/i);
  assert.match(html, /data-direction=["']left["']/i);

  assert.ok(css.includes("@media (max-width: 700px)"));
  assert.ok(script.includes("initSnakeGame"));
  assert.ok(!html.includes("github_token.txt"));
  assert.ok(!html.match(/href=["']\/(?!\/)/));
  assert.ok(!html.match(/src=["']\/(?!\/)/));
});

test("games area includes accessible copy and controls", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<section\s+id=["']games["'][\s\S]*Loop Snake/i);
  assert.match(html, /Keyboard:<\/strong>\s*Arrow keys or WASD/i);
  assert.match(html, /Touch:<\/strong>\s*Swipe the board or use the direction buttons/i);
  assert.match(html, /aria-live=["']polite["']/i);
});
