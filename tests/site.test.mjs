import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("root site exposes the requested static structure", async () => {
  const [html, css, script] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i);
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']/i);
  assert.match(html, /<script\s+type=["']module["']\s+src=["']script\.js["']>/i);
  assert.match(html, /href=["']#home["']/i);
  assert.match(html, /href=["']#experience["']/i);
  assert.match(html, /href=["']#games["']/i);
  assert.match(html, /id=["']home["']/i);
  assert.match(html, /id=["']experience["']/i);
  assert.match(html, /id=["']games["']/i);
  assert.match(html, /id=["']snake-board["']/i);
  assert.match(html, /id=["']game-score["']/i);
  assert.match(html, /id=["']game-best["']/i);
  assert.match(html, /id=["']game-start["']/i);
  assert.match(html, /id=["']game-pause["']/i);
  assert.match(html, /id=["']game-restart["']/i);
  assert.match(html, /data-direction=["']up["']/i);
  assert.match(html, /data-direction=["']right["']/i);
  assert.match(html, /data-direction=["']down["']/i);
  assert.match(html, /data-direction=["']left["']/i);
  assert.match(html, /Current role\s*:\s*놀라운 개발자/i);
  assert.match(html, /Previous role\s*:\s*허접한 개발자/i);

  assert.ok(css.includes("@media (max-width: 700px)"));
  assert.ok(css.includes("stage-shake"));
  assert.ok(script.includes("initSnakeGame"));

  assert.ok(!html.includes("github_token.txt"));
  assert.ok(!html.match(/href=["']\/(?!\/)/));
  assert.ok(!html.match(/src=["']\/(?!\/)/));
  assert.ok(!html.match(/id=["']about["']/i));
  assert.ok(!html.match(/id=["']projects["']/i));
  assert.ok(!html.match(/id=["']research["']/i));
  assert.ok(!html.match(/id=["']contact["']/i));
  assert.ok(!html.match(/Professional website/i));
  assert.ok(!html.includes("[사람 확인 필요]"));
});

test("games area includes pause guidance and touch controls", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<section\s+id=["']games["'][\s\S]*Loop Snake/i);
  assert.match(html, /Space to pause\/resume/i);
  assert.match(html, /Touch:<\/strong>\s*Swipe the board or use the direction buttons/i);
  assert.match(html, /aria-live=["']polite["']/i);
});
