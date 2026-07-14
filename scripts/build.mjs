import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);
const files = ["index.html", "styles.css", "script.js", "game.js"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, output));
}

await writeFile(new URL(".nojekyll", output), "");

console.log("Built static site in dist/");
