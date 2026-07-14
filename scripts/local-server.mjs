import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.argv[2] ?? 8125);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  const rel = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const filePath = resolve(join(root, decodeURIComponent(rel)));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    res.setHeader("Content-Type", mime[extname(filePath)] ?? "application/octet-stream");
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`listening:${port}\n`);
});

process.on("SIGTERM", () => server.close());
