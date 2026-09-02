/**
 * Day 01 Submission Desk — Apps Script receiver.
 *
 * Deployed as a web app running as YOU, so it can write to the sheet even
 * though the student is signed in as themselves (or not signed in at all).
 *
 * ── Setup ────────────────────────────────────────────────────────────
 * 1. Open the sheet → Extensions → Apps Script
 * 2. Paste this file over Code.gs, then Save
 * 3. Run `setup` once and grant the permissions it asks for
 * 4. Deploy → New deployment → type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL it gives you and send it to Claude
 * 5. Re-deploy (Manage deployments → edit → Deploy) after ANY edit here,
 *    otherwise the old code keeps serving.
 *
 * Students never see this URL's contents — the page POSTs to it.
 */

const SHEET_NAME = 'Degrees JS EW';
const LOG_NAME   = 'Debug';          // an existing tab; submissions are appended
const SHARED_KEY = 'CHANGE-ME';      // must match SHARED_KEY in the web page

/** Column for each day: Day 1 -> C, Day 2 -> D, and so on. */
function columnForDay(day) {
  return 3 + (day - 1);              // C is column 3
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '"');
  const n = sheet.getLastRow() - 1;
  Logger.log('OK — "%s" has %s students. Ready to deploy.', SHEET_NAME, n);
  return 'OK: ' + n + ' students';
}

/** Health check — visiting the /exec URL in a browser hits this. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'day01-submissions' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Serialize writes — two students submitting at once must not collide.
    lock.waitLock(20000);

    const body = JSON.parse(e.postData.contents);

    if (body.key !== SHARED_KEY) {
      return json({ ok: false, error: 'bad_key' });
    }

    const day = Number(body.day);
    if (!(day >= 1 && day <= 10)) {
      return json({ ok: false, error: 'bad_day' });
    }

    const email = String(body.email || '').trim().toLowerCase();
    const score = Number(body.score);
    if (!email || !(score >= 0 && score <= 100)) {
      return json({ ok: false, error: 'bad_payload' });
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

    const col = columnForDay(day);
    const cell = sheet.getRange(row, col);
    const previous = cell.getValue();

    cell.setValue(score);

    // Keep an audit trail: resubmissions overwrite the grade but the log keeps both.
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
