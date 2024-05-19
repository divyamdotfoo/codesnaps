import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const res = await fetch(
  "https://5cb3-2401-4900-1c52-b710-4106-9b5a-408a-915c.ngrok-free.app"
);

const data = await res.arrayBuffer();
await fs.writeFile("google.json", Buffer.from(data));

const googlePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "google.json"
);
console.log(googlePath);
