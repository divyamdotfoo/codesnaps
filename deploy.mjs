import fs from "fs/promises";

const res = await fetch(
  "https://47b4-2401-4900-1c52-b710-4106-9b5a-408a-915c.ngrok-free.app"
);

const data = await res.arrayBuffer();

fs.writeFile("google.json", Buffer.from(data));
