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
  assert.match(html, /href="styles\.css(?:\?[^"']*)?"/i);
  assert.match(html, /src="script\.js(?:\?[^"']*)?"/i);
  assert.match(html, /id="picks"/i);
  assert.match(html, /id="history"/i);
  assert.match(html, /id="frequency-list"/i);
  assert.match(html, /id="custom-form"/i);
  assert.match(html, /id="custom-result"/i);
  assert.match(html, /id="custom-number-grid"/i);
  assert.match(script, /17, 26, 36, 37, 39, 45/);
  assert.match(script, /8, 14, 24, 40, 42, 44/);
  assert.match(script, /1, 12, 13, 22, 24, 44/);
  assert.match(script, /1, 3, 4, 9, 12, 45/);
  assert.match(script, /function matchRank/);
  assert.match(script, /function renderNumberFrequency/);
  assert.match(script, /customSelection\.length === 6/);
  assert.match(script, /function updateCustomNumberGrid/);
  assert.match(script, /data-number/);
  assert.match(script, /data-pick-filter/);
  assert.match(script, /data-clear-filter/);
  assert.match(script, /function winningBalls/);
  assert.match(script, /matched-ball/);
  assert.match(script, /String\(draw\.draw_no\) === query/);
  assert.match(css, /\.frequency-table \{ display: grid; grid-template-columns: repeat\(10/);
  assert.match(html, /href="#frequency"/i);
  assert.match(script, /counts\.sort\(\(a, b\) => b\.count - a\.count/);
  assert.match(script, /data\/lotto-history\.json/);
  assert.match(css, /@media \(max-width: 620px\)/);
  const draws = JSON.parse(data);
  assert.ok(draws.length > 1000);
  assert.ok(draws.every((draw) => draw.numbers.length === 6 && draw.bonus_no >= 1 && draw.bonus_no <= 45));
});
