import fs from "fs";

fs.cpSync("./src/protoAuth", "./build/protoAuth", { recursive: true });
fs.cpSync("./src/protoAccount", "./build/protoAccount", { recursive: true });
