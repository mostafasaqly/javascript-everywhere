#!/usr/bin/env node
/* =====================================================================
   Decode Day 01 submission codes into rows for the "Degrees JS EW" tab.

   Usage:
     node tools/decode-day01.js codes.txt          -> prints a table
     node tools/decode-day01.js codes.txt --csv    -> CSV for the sheet
     node tools/decode-day01.js D1.1Q.ZZZ… --csv   -> a single code

   codes.txt: one code per line. Anything after a "#" is ignored, and
   lines that aren't codes are reported rather than silently skipped.
   ===================================================================== */

const fs = require("fs");
const path = require("path");
const { decodeSubmission } = require("./codec.js");
const roster = require("./roster.json");
const meta = require("./checks.json");   // { total, required, optional, labels[] }

const args = process.argv.slice(2);
const asCsv = args.includes("--csv");
const target = args.filter(a => !a.startsWith("--"))[0];

if (!target) {
  console.error("Usage: node tools/decode-day01.js <codes.txt | code> [--csv]");
  process.exit(1);
}

let lines;
if (fs.existsSync(target)) {
  lines = fs.readFileSync(target, "utf8").split(/\r?\n/);
} else {
  lines = [target];
}

const rows = [];
const problems = [];

lines.forEach((raw, i) => {
  const line = raw.split("#")[0].trim();
  if (!line) return;

  const res = decodeSubmission(line, meta.total);
  if (!res.ok) {
    problems.push({ line: i + 1, text: raw.trim(), why: res.error });
    return;
  }

  const student = roster[res.rosterIndex];
  if (!student) {
    problems.push({ line: i + 1, text: raw.trim(), why: "Roster index " + res.rosterIndex + " not in roster.json" });
    return;
  }

  // First `required` bits are the graded checks; the rest are bonus.
  const req = res.bits.slice(0, meta.required);
  const bonus = res.bits.slice(meta.required);
  const reqDone = req.filter(Boolean).length;
  const bonusDone = bonus.filter(Boolean).length;
  const pct = Math.round(reqDone / meta.required * 100);

  let level = "Incomplete";
  if (reqDone === meta.required) level = bonusDone === bonus.length ? "10%" : "Done";

  const missing = [];
  req.forEach((b, idx) => { if (!b) missing.push(meta.labels[idx]); });

  rows.push({
    name: student.name,
    email: student.email,
    sheetRow: student.row,
    pct, reqDone, bonusDone,
    level,
    submittedAt: res.submittedAt,
    missing
  });
});

/* Latest submission wins if a student sends more than one code. */
const byEmail = new Map();
rows.forEach(r => {
  const prev = byEmail.get(r.email);
  if (!prev || r.submittedAt > prev.submittedAt) byEmail.set(r.email, r);
});
const final = [...byEmail.values()].sort((a, b) => a.sheetRow - b.sheetRow);

if (asCsv) {
  console.log("Row,Full Name,Email,Day 1,Level,Bonus,Submitted");
  final.forEach(r => {
    const esc = s => /[",]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : s;
    console.log([
      r.sheetRow, esc(r.name), esc(r.email), r.pct, r.level,
      r.bonusDone + "/" + (meta.total - meta.required),
      r.submittedAt.toISOString().slice(0, 16).replace("T", " ")
    ].join(","));
  });
} else {
  console.log("");
  console.log("  Day 01 — decoded submissions");
  console.log("  " + "-".repeat(66));
  final.forEach(r => {
    const bar = "#".repeat(Math.round(r.pct / 5)).padEnd(20, ".");
    console.log(
      "  " + String(r.sheetRow).padStart(3) + "  " +
      r.name.slice(0, 26).padEnd(27) +
      bar + " " + String(r.pct).padStart(3) + "%  " +
      r.level.padEnd(11) +
      "bonus " + r.bonusDone + "/" + (meta.total - meta.required)
    );
    if (r.missing.length && r.missing.length <= 6) {
      console.log("       missing: " + r.missing.join("; "));
    } else if (r.missing.length) {
      console.log("       missing " + r.missing.length + " checks");
    }
  });
  console.log("  " + "-".repeat(66));
  console.log("  " + final.length + " submissions decoded");
  if (final.length) {
    const avg = Math.round(final.reduce((s, r) => s + r.pct, 0) / final.length);
    const done = final.filter(r => r.level !== "Incomplete").length;
    console.log("  average " + avg + "%  ·  " + done + " complete  ·  " +
                final.filter(r => r.level === "10%").length + " at 10%");
  }
}

if (problems.length) {
  console.error("");
  console.error("  " + problems.length + " line(s) could not be read:");
  problems.forEach(p => console.error("    line " + p.line + ": " + p.why + "  — " + p.text.slice(0, 40)));
}
