#!/usr/bin/env node
/* Rebuild roster.json from a CSV export of the "Degrees JS EW" tab.
   Usage: node tools/build-roster.js <export.csv>
   Data row 1 of the CSV is sheet row 2 (row 1 is the header). */

const fs = require("fs");
const path = require("path");

const src = process.argv[2];
if (!src) { console.error("Usage: node tools/build-roster.js <export.csv>"); process.exit(1); }

/* Minimal CSV reader — handles quoted fields with embedded commas. */
function parseCsv(text){
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++){
    const c = text[i];
    if (q){
      if (c === '"'){ if (text[i+1] === '"'){ field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ","){ row.push(field); field = ""; }
    else if (c === "\n"){ row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length){ row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCsv(fs.readFileSync(src, "utf8"));
const header = rows[0].map(h => h.trim().toLowerCase());
const iName = header.indexOf("full name");
const iMail = header.indexOf("email");
if (iName < 0 || iMail < 0){
  console.error("Expected 'Full Name' and 'Email' columns; got: " + rows[0].join(" | "));
  process.exit(1);
}

const roster = [];
const seen = new Map();
const warnings = [];

rows.slice(1).forEach((r, i) => {
  const sheetRow = i + 2;                       // header occupies row 1
  const name = (r[iName] || "").trim();
  const email = (r[iMail] || "").trim().toLowerCase();
  if (!name && !email) return;                  // trailing blank line
  if (!email){ warnings.push("row " + sheetRow + ": '" + name + "' has no email — skipped"); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    warnings.push("row " + sheetRow + ": '" + email + "' doesn't look like an email — kept anyway");
  }
  if (seen.has(email)){
    warnings.push("row " + sheetRow + ": duplicate of row " + seen.get(email) + " (" + email + ") — skipped");
    return;
  }
  seen.set(email, sheetRow);
  roster.push({ row: sheetRow, name, email });
});

const out = path.join(__dirname, "roster.json");

/* Codes carry the ARRAY INDEX, so an existing roster's order is load-bearing:
   refuse to reorder or drop anyone who already has an index. */
if (fs.existsSync(out)){
  const prev = JSON.parse(fs.readFileSync(out, "utf8"));
  const clash = prev.filter((p, i) => roster[i] && roster[i].email !== p.email);
  const gone = prev.filter(p => !roster.some(r => r.email === p.email));
  if (clash.length || gone.length){
    console.error("\n  REFUSING TO WRITE — this would invalidate codes already issued.\n");
    clash.slice(0, 5).forEach(p => {
      const i = prev.indexOf(p);
      console.error("    index " + i + ": was " + p.email + ", would become " + roster[i].email);
    });
    gone.slice(0, 5).forEach(p => console.error("    dropped: " + p.email));
    console.error("\n  Students may only be APPENDED. Fix the CSV order, or delete");
    console.error("  roster.json deliberately if no codes have been issued yet.\n");
    process.exit(1);
  }
}

fs.writeFileSync(out, JSON.stringify(roster, null, 2) + "\n");

console.log("\n  roster.json written — " + roster.length + " students");
console.log("  sheet rows " + roster[0].row + " to " + roster[roster.length-1].row);
if (warnings.length){
  console.log("\n  " + warnings.length + " warning(s):");
  warnings.forEach(w => console.log("    " + w));
}
console.log("\n  Next: node tools/embed-roster.js   (updates the app's copy)\n");
