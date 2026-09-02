#!/usr/bin/env node
/* Push roster.json into the app's embedded ROSTER array.
   Run after build-roster.js, then republish the artifact.
   Usage: node tools/embed-roster.js [path/to/day01-tracker.html] */

const fs = require("fs");
const path = require("path");

const DEFAULT_APP = path.join(__dirname, "..", "app", "day01-tracker.html");
const appPath = process.argv[2] || DEFAULT_APP;

if (!fs.existsSync(appPath)){
  console.error("App file not found: " + appPath);
  process.exit(1);
}

const roster = JSON.parse(fs.readFileSync(path.join(__dirname, "roster.json"), "utf8"));
const compact = roster.map(r => [r.email.toLowerCase(), r.name]);

let html = fs.readFileSync(appPath, "utf8");
const re = /const ROSTER = (\[[\s\S]*?\]);/;
if (!re.test(html)){
  console.error("Could not find 'const ROSTER = [...]' in " + appPath);
  process.exit(1);
}

const before = (html.match(re)[1].match(/\["/g) || []).length;
html = html.replace(re, "const ROSTER = " + JSON.stringify(compact) + ";");
fs.writeFileSync(appPath, html);

console.log("\n  Embedded " + compact.length + " students (was " + before + ")");
console.log("  " + appPath);
console.log("\n  Next: republish the artifact so students get the new roster.\n");
