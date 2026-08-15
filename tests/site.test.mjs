import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("lotto page has static assets and the five requested picks", async () => {
  const [html, css, script, data] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
    readFile(new URL("../data/lotto-history.json", import.meta.url), "utf8"),
  ]);
  assert.match(html, /name="viewport"/i);
  assert.match(html, /href="styles\.css"/i);
  assert.match(html, /src="script\.js"/i);
  assert.match(html, /id="picks"/i);
  assert.match(html, /id="history"/i);
  assert.match(script, /17, 26, 36, 37, 39, 45/);
  assert.match(script, /8, 14, 24, 40, 42, 44/);
  assert.match(script, /function matchRank/);
  assert.match(script, /data\/lotto-history\.json/);
  assert.match(css, /@media \(max-width: 620px\)/);
  const draws = JSON.parse(data);
  assert.ok(draws.length > 1000);
  assert.ok(draws.every((draw) => draw.numbers.length === 6 && draw.bonus_no >= 1 && draw.bonus_no <= 45));
});
