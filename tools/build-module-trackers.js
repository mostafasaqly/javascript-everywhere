#!/usr/bin/env node
/* =====================================================================
   Build the React-track assignment trackers (Module 01–08).

   Reads   each module-NN-<name> folder's ASSIGNMENT.md
   Writes  app/moduleNN-tracker.html     (cloned from app/day06-tracker.html)
           tools/codec-moduleNN.js
           tools/decode-moduleNN.js
           tools/checks-moduleNN.json

   Usage:  node tools/build-module-trackers.js
   Re-run after editing any ASSIGNMENT.md. If you change a module's checks
   after students have submitted, bump its salt (-v2, -v3, …) below.
   ===================================================================== */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = p => fs.readFileSync(p, "utf8").split("\r\n").join("\n");
const template = read(path.join(root, "app", "day06-tracker.html"));
const decodeTemplate = read(path.join(__dirname, "decode-day06.js"));
const SALT_VERSION = "v1";
const EXPORTS = [
  "",
  'if (typeof module !== "undefined") {',
  "  module.exports = { encodeSubmission, decodeSubmission, sign, SALT };",
  "}",
  ""
].join("\n");

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* Markdown inline -> the trusted HTML subset the tracker renders. */
const md = s => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\*([^*]+)\*/g, "<em>$1</em>");
const plain = s => s.replace(/`/g, "").replace(/\*/g, "");

function parseAssignment(text) {
  const lines = text.split(/\r?\n/);
  const title = lines[0].replace(/^#\s*Module \d+ Assignment:\s*/, "").trim();
  const startsFrom = (text.match(/\*\*Starts from:\*\*\s*(.+)/) || [, ""])[1].trim();
  const intro = (text.split(/\r?\n\r?\n/)[2] || "").trim();

  const sectionOf = name => {
    const m = text.match(new RegExp("^## " + name + "[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))", "m"));
    return m ? m[1].trim() : "";
  };

  const tasksBlock = sectionOf("Tasks");
  const tasks = tasksBlock.split(/^### /m).slice(1).map(chunk => {
    const [head, ...rest] = chunk.split(/\r?\n/);
    const body = rest.join("\n");
    const lead = body.split(/\*\*Acceptance criteria\*\*/)[0].trim();
    const criteria = [...body.matchAll(/^- \[ \] (.+)$/gm)].map(m => m[1].trim());
    return { title: head.replace(/^Task \d+:\s*/, "").trim(), lead, criteria };
  });

  const challenge = sectionOf("Challenge");
  const questions = [...sectionOf("Reflection questions").matchAll(/^\d+\. (.+)$/gm)].map(m => m[1].trim());
  return { title, startsFrom, intro, tasks, challenge, questions };
}

function buildTasks(n, a) {
  const NN = String(n).padStart(2, "0");
  const branch = `module-${NN}-assignment`;
  const model = [];

  a.tasks.forEach((t, i) => {
    const id = i + 1;
    model.push({
      id: "t" + id,
      title: t.title,
      lead: md(t.lead),
      deliverable: i === a.tasks.length - 1 ? "Working feature + screenshots" : "Working feature",
      sections: [{
        sid: id + ".1", title: "Acceptance criteria",
        note: "Tick each one only when you've seen it work in the browser.",
        checks: [
          [`t${id}_approach`, "Wrote 2–3 lines on how I'd solve it <em>before</em> writing code"],
          ...t.criteria.map((c, j) => [`t${id}_ac${j + 1}`, md(c)]),
          [`t${id}_clean`, "No red lines in VS Code and no <code>any</code> in the code I added"],
          [`t${id}_commit`, "Committed this task on its own with a clear message"]
        ]
      }]
    });
  });

  const rid = a.tasks.length + 1;
  model.push({
    id: "t" + rid,
    title: "Reflection + challenge",
    lead: "Answer in 2–3 sentences each, in your own words, in <code>REFLECTION.md</code>. The challenge is optional.",
    deliverable: "REFLECTION.md",
    sections: [
      {
        sid: rid + ".1", title: "Reflection questions",
        checks: [
          [`r_file`, "Created <code>REFLECTION.md</code> at the root of the project"],
          ...a.questions.map((q, j) => [`r_q${j + 1}`, `Answered: ${md(q)}`]),
          [`r_own_words`, "Wrote every answer in my own words — not copied from the README"]
        ]
      },
      {
        sid: "Bonus", title: "Optional — challenge",
        optional: true,
        note: md(a.challenge),
        checks: [
          [`b_challenge`, "Finished the challenge and it works"],
          [`b_challenge_typed`, "The challenge code is fully typed, with no <code>any</code>"],
          [`b_challenge_explain`, "Can explain how it works without looking at the code"]
        ]
      }
    ]
  });

  model.push({
    id: "t" + (rid + 1),
    title: "Ship it",
    lead: `Work on <code>${branch}</code>, make sure it builds, and send the repository.`,
    deliverable: "Repo + PR",
    sections: [{
      sid: (rid + 1) + ".1", title: "Submission",
      checks: [
        ["s_branch", `Worked on a new branch: <code>${branch}</code>`],
        ["s_commits", "One clear commit per task, for example <code>feat: add Footer component</code>"],
        ["s_build", "<code>npm run build</code> finishes with no errors"],
        ["s_pushed", "Pushed the branch to GitHub"],
        ["s_shots", "Added 1–3 screenshots (or a short screen recording) to the pull request"],
        ["s_readme", "Updated the project <code>README.md</code>"]
      ],
      inputs: [
        { k: "repo_url", type: "url", label: "Repository link", hint: "— required", ph: "https://github.com/…" },
        { k: "pr_url", type: "url", label: "Pull request link", hint: "— required", ph: "https://github.com/…/pull/1" },
        { k: "shot_url", type: "url", label: "Screenshot link", ph: "https://…" }
      ]
    }]
  });
  return model;
}

function labelsOf(tasks) {
  const req = [], opt = [];
  tasks.forEach((t, ti) => t.sections.forEach(s => (s.checks || []).forEach(([, label]) => {
    (s.optional ? opt : req).push(`T${ti + 1}.${s.sid} ${plain(label.replace(/<[^>]+>/g, ""))}`);
  })));
  return { req, opt };
}

const modules = fs.readdirSync(root).filter(d => /^module-\d\d-/.test(d)).sort();
for (const dir of modules) {
  const n = Number(dir.slice(7, 9));
  const NN = String(n).padStart(2, "0");
  const a = parseAssignment(fs.readFileSync(path.join(root, dir, "ASSIGNMENT.md"), "utf8"));
  const tasks = buildTasks(n, a);
  const { req, opt } = labelsOf(tasks);
  const salt = `js-everywhere-module${NN}-${SALT_VERSION}`;
  const prefix = "M" + n;
  const pageTitle = `Module ${NN} — ${a.title}`;

  let html = template;
  const swap = (from, to) => {
    if (!html.includes(from)) throw new Error(`template lost: ${from}`);
    html = html.split(from).join(to);
  };

  // Data model
  html = html.replace(/const TASKS = \[[\s\S]*?\n\];\n\nconst REQUIRED_INPUTS = \[[^\]]*\];/,
    () => "const TASKS = " + JSON.stringify(tasks, null, 2) + ";\n\nconst REQUIRED_INPUTS = " + JSON.stringify(["repo_url", "pr_url"]) + ";");
  html = html.replace(/const ENDPOINT = "[^"]*";/, 'const ENDPOINT = "";');
  html = html.replace(/\/\* Which assignment this is[^*]*\*\/\nconst DAY = 6;/, `/* Module ${NN} of the React track. */\nconst DAY = ${n};`);

  // Identity / copy
  swap("<title>Day 06 Submission Desk</title>", `<title>Module ${NN} Submission Desk</title>`);
  swap("Track 1 · Day 6 · Parts 1–9", `Track 2 · React · Module ${NN}`);
  swap("<h1>Day 06 — TypeScript, APIs + Task Manager</h1>", `<h1>${esc(pageTitle)}</h1>`);
  swap("Work through the twenty-four tasks", `Work through the ${tasks.length} tasks`);
  swap("<h2>Day 06 Desk</h2>", `<h2>Module ${NN} Desk</h2>`);
  swap("0 of 24 tasks complete", `0 of ${tasks.length} tasks complete`);
  swap("Day 06 assignment — data model", `Module ${NN} assignment — data model`);
  swap("The Day 06 roster", `The Module ${NN} roster`);
  swap("Day 06 submission code", `Module ${NN} submission code`);
  swap("tools/decode-day06.js", `tools/decode-module${NN}.js`);
  swap("D6.<payload-b32>.<sig>", `${prefix}.<payload-b32>.<sig>`);
  swap('"js-everywhere-day06-v2"', `"${salt}"`);
  swap('return "D6." + payload', `return "${prefix}." + payload`);
  swap('parts[0] !== "D6"', `parts[0] !== "${prefix}"`);
  swap("Not a Day 06 code.", `Not a Module ${NN} code.`);
  swap('"js-everywhere-day06"', `"js-everywhere-module${NN}"`);
  swap("isn't on the Day 06 roster", `isn't on the Module ${NN} roster`);
  swap("[day06]", `[module${NN}]`);
  html = html.replace(/const FIELD_NAMES = \{[\s\S]*?\n    \};/,
    () => 'const FIELD_NAMES = {\n      repo_url: "repo link",\n      pr_url: "pull request link"\n    };');
  swap("state.inputs.t7_repo_url", "state.inputs.repo_url");
  swap("state.inputs.t8_post_url", "state.inputs.pr_url");
  html = html.replace(/\/\* Bits -> base32 string[\s\S]*?\*\//, m => m.replace(/67 checks = 67 bits/, `${req.length + opt.length} checks = ${req.length + opt.length} bits`));

  fs.writeFileSync(path.join(root, "app", `module${NN}-tracker.html`), html);

  // Codec: lift the embedded one so page and tool can't drift.
  const codecBody = html.match(/\/\* =+\n\s+Module \d\d submission code[\s\S]*?\n\}\n(?=<\/script>)/)[0];
  const codec = codecBody + EXPORTS;
  fs.writeFileSync(path.join(__dirname, `codec-module${NN}.js`), codec);

  let dec = decodeTemplate
    .replace(/Day 06/g, `Module ${NN}`).replace(/day06/g, `module${NN}`)
    .replace(/Day 01–05 codes are rejected/, "Other modules' and days' codes are rejected")
    .replace("const DAY = 6;", `const DAY = ${n};`)
    .replace('"Row,Full Name,Email,Day " + DAY', `"Row,Full Name,Email,Module " + DAY`)
    .replace('"  Day 0" + DAY + " — decoded submissions"', `"  Module ${NN} — decoded submissions"`);
  fs.writeFileSync(path.join(__dirname, `decode-module${NN}.js`), dec);

  fs.writeFileSync(path.join(__dirname, `checks-module${NN}.json`), JSON.stringify({
    required: req.length, optional: opt.length, total: req.length + opt.length, labels: req.concat(opt)
  }, null, 2) + "\n");

  console.log(`module${NN}: ${tasks.length} tasks, ${req.length} required + ${opt.length} bonus checks`);
}
