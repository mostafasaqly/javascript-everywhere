/**
 * Day 01 Submission Desk — Apps Script receiver.
 *
 * Deployed as a web app running as YOU, so it can write to the sheet even
 * though the student is signed in as themselves (or not signed in at all).
 *
 * ── Setup ────────────────────────────────────────────────────────────
 * 1. Open the sheet → Extensions → Apps Script
 * 2. Paste this file over Code.gs, then Save
 * 3. Set your secret salt:
 *      Project Settings → Script Properties → Add script property
 *      Property: SALT     Value: (any long random phrase you invent)
 *    Keep this off GitHub. It is the ONLY thing standing between a
 *    student and their classmates' grades.
 * 4. Run `listTokens` once, grant permissions, and read the Execution log
 *    — it prints one token per student. Send each student THEIR OWN token.
 * 5. Deploy → New deployment → type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 * 6. Re-deploy (Manage deployments → edit → Deploy) after ANY edit here,
 *    otherwise the old code keeps serving.
 *
 * ── Why tokens ───────────────────────────────────────────────────────
 * The endpoint URL is public (it sits in the page source, and the page is
 * on a public repo). Without a per-student secret, anyone could POST a
 * score for anyone — including a 0 for a classmate. A token is derived
 * from the student's email plus the salt, so it only ever authorises that
 * one email, and it cannot be computed without the salt.
 */

const SHEET_NAME = 'Degrees JS EW';
const LOG_NAME   = 'Debug';          // created automatically if missing

/** Column for each day: Day 1 -> C, Day 2 -> D, and so on. */
function columnForDay(day) {
  return 3 + (day - 1);              // C is column 3
}

function getSalt() {
  const salt = PropertiesService.getScriptProperties().getProperty('SALT');
  if (!salt) {
    throw new Error('No SALT script property set — see the setup notes at the top of this file.');
  }
  return salt;
}

/** The token for one email: 10 hex chars of HMAC-SHA256(salt, email). */
function tokenFor(email) {
  const clean = String(email).trim().toLowerCase();
  const raw = Utilities.computeHmacSha256Signature(clean, getSalt());
  return raw
    .map(function (b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); })
    .join('')
    .slice(0, 10);
}

/**
 * Print every student's token. Run this, then open View → Logs.
 * Send each student only their own line.
 */
function listTokens() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const out = [];
  rows.forEach(function (r, i) {
    const name = String(r[0]).trim();
    const email = String(r[1]).trim().toLowerCase();
    if (!email) return;
    out.push([i + 2, name, email, tokenFor(email)].join('\t'));
  });
  Logger.log('row\tname\temail\ttoken\n' + out.join('\n'));
  return out.length + ' tokens';
}

function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '"');
  getSalt();                                    // fails loudly if unset
  const n = sheet.getLastRow() - 1;
  Logger.log('OK — "%s" has %s students, SALT is set. Ready to deploy.', SHEET_NAME, n);
  return 'OK: ' + n + ' students';
}

/** Health check — visiting the /exec URL in a browser hits this. */
function doGet() {
  return json({ ok: true, service: 'day01-submissions' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);                       // serialize concurrent writes

    const body = JSON.parse(e.postData.contents);

    const day = Number(body.day);
    if (!(day >= 1 && day <= 10)) return json({ ok: false, error: 'bad_day' });

    const email = String(body.email || '').trim().toLowerCase();
    const score = Number(body.score);
    if (!email || !(score >= 0 && score <= 100)) return json({ ok: false, error: 'bad_payload' });

    // The token authorises THIS email only. Without the salt it cannot be
    // guessed, so one student cannot post as another.
    if (String(body.token || '').trim().toLowerCase() !== tokenFor(email)) {
      return json({ ok: false, error: 'bad_token' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Find the student by email — column B, skipping the header row.
    const emails = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    let row = -1;
    for (let i = 0; i < emails.length; i++) {
      if (String(emails[i][0]).trim().toLowerCase() === email) { row = i + 2; break; }
    }
    if (row < 0) return json({ ok: false, error: 'not_on_roster' });

    const cell = sheet.getRange(row, columnForDay(day));
    const previous = cell.getValue();
    cell.setValue(score);

    logSubmission(ss, {
      when: new Date(),
      day: day,
      row: row,
      name: sheet.getRange(row, 1).getValue(),
      email: email,
      score: score,
      previous: previous === '' ? '-' : previous,
      level: body.level || '',
      bonus: body.bonus || '',
      repo: body.repo || '',
      post: body.post || ''
    });

    return json({ ok: true, row: row, score: score, resubmitted: previous !== '' });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function logSubmission(ss, r) {
  let log = ss.getSheetByName(LOG_NAME);
  if (!log) log = ss.insertSheet(LOG_NAME);
  if (log.getLastRow() === 0) {
    log.appendRow(['When', 'Day', 'Row', 'Name', 'Email', 'Score',
                   'Previous', 'Level', 'Bonus', 'Repo', 'LinkedIn']);
  }
  log.appendRow([r.when, r.day, r.row, r.name, r.email, r.score,
                 r.previous, r.level, r.bonus, r.repo, r.post]);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
