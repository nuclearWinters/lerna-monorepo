import fs from "node:fs";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.cpSync(
  join(__dirname, "src", "protoAuth"),
  join(__dirname, "build", "protoAuth"),
  { recursive: true }
);

fs.cpSync(
  join(__dirname, "src", "protoAccount"),
  join(__dirname, "build", "protoAccount"),
  { recursive: true }
);
