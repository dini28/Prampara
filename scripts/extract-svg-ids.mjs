import fs from "fs";
const s = fs.readFileSync("public/india-states.svg", "utf8");
const pairs = [...s.matchAll(/id="(IN[A-Z]{2})" name="([^"]+)"/g)].map((m) => [m[1], m[2]]);
console.log(JSON.stringify(pairs, null, 2));
