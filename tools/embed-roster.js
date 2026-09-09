#!/usr/bin/env node
/* Push roster.json into every tracker's embedded ROSTER array.
   Run after build-roster.js, then republish the artifacts.

   Usage:
     node tools/embed-roster.js                      -> every app/day*-tracker.html
     node tools/embed-roster.js path/to/tracker.html -> just that one

   With no argument it updates every tracker it finds, so a roster change
   can't silently miss a day. */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "..", "app");
const targets = process.argv[2]
  ? [process.argv[2]]
  : fs.readdirSync(APP_DIR)
      .filter(f => /^day\d+-tracker\.html$/.test(f))
      .sort()
      .map(f => path.join(APP_DIR, f));

if (!targets.length){
  console.error("No tracker pages found in " + APP_DIR);
  process.exit(1);
}

const roster = JSON.parse(fs.readFileSync(path.join(__dirname, "roster.json"), "utf8"));
const compact = roster.map(r => [r.email.toLowerCase(), r.name]);

console.log("");
let failed = 0;

targets.forEach(appPath => {
  if (!fs.existsSync(appPath)){
    console.error("  App file not found: " + appPath);
    failed++;
    return;
  }

  let html = fs.readFileSync(appPath, "utf8");
  const re = /const ROSTER = (\[[\s\S]*?\]);/;
  if (!re.test(html)){
    console.error("  Could not find 'const ROSTER = [...]' in " + appPath);
    failed++;
    return;
  }

  const before = (html.match(re)[1].match(/\["/g) || []).length;
  html = html.replace(re, "const ROSTER = " + JSON.stringify(compact) + ";");
  fs.writeFileSync(appPath, html);

  console.log("  " + path.basename(appPath).padEnd(22) +
              " embedded " + compact.length + " students (was " + before + ")");
});

if (failed){
  console.error("\n  " + failed + " file(s) failed.\n");
  process.exit(1);
}

console.log("\n  Next: republish the artifacts so students get the new roster.\n");
