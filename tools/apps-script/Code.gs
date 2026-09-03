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
 * 4. Optionally set APP_URL (the published tracker page) and FROM_NAME
 *    as Script Properties too — the token email uses them.
 * 5. Run `previewTokenEmail` to check the wording, then `emailAllTokens`
 *    to send every student their own code. `listTokens` prints them to the
 *    Execution log instead, if you would rather send them by hand.
 * 6. Deploy → New deployment → type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 * 7. Re-deploy (Manage deployments → edit → Deploy) after ANY edit here,
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

/**
 * Column for each day: Day 1 -> D, Day 2 -> E, and so on.
 * A = Full Name, B = Email, C = Codes (the visible roster id), D = Day 1.
 * Bump DAY_ONE_COLUMN if a column is ever inserted before the day grid.
 */
const DAY_ONE_COLUMN = 4;            // D

function columnForDay(day) {
  return DAY_ONE_COLUMN + (day - 1);
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

    // Gate check: confirm an email/token pair before the student starts the
    // tasks, so a wrong code is caught up front instead of after all the work.
    // Writes nothing to the sheet.
    if (body.action === 'verify') {
      const vEmail = String(body.email || '').trim().toLowerCase();
      if (!vEmail) return json({ ok: false, error: 'bad_payload' });
      if (String(body.token || '').trim().toLowerCase() !== tokenFor(vEmail)) {
        return json({ ok: false, error: 'bad_token' });
      }
      return json({ ok: true, verified: true });
    }

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


/* ══════════════════════════════════════════════════════════════════════
 * Token mailer — sends each student their own 10-character code.
 *
 * Set these Script Properties first (Project Settings → Script Properties):
 *   SALT       (required, already used above)
 *   APP_URL    (optional) link to the published day01-tracker.html page
 *   FROM_NAME  (optional) sender name shown to students
 *
 * Then run `emailAllTokens` once. Gmail caps consumer accounts at ~100
 * recipients/day and Workspace at ~1500, so a large roster may need two
 * runs — the Mail Log tab records who was already mailed and reruns skip
 * them. Use `previewTokenEmail` first to see one message without sending.
 * ══════════════════════════════════════════════════════════════════════ */

const MAIL_LOG_NAME = 'Mail Log';
const TOKEN_EMAIL_SUBJECT = 'Your JavaScript Everywhere submission code';

function scriptProp(key, fallback) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  return v ? v : (fallback || '');
}

/** Every roster row that has an email: { row, name, email, code, token }. */
function readRoster() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '"');
  const last = sheet.getLastRow();
  if (last < 2) return [];

  // A = name, B = email, C = the visible roster code
  const values = sheet.getRange(2, 1, last - 1, 3).getValues();
  const out = [];
  values.forEach(function (r, i) {
    const email = String(r[1]).trim().toLowerCase();
    if (!email || email.indexOf('@') < 0) return;
    out.push({
      row: i + 2,
      name: String(r[0]).trim(),
      email: email,
      code: String(r[2]).trim(),
      token: tokenFor(email)
    });
  });
  return out;
}

/** Emails already sent, so a rerun after the Gmail quota picks up where it stopped. */
function alreadyMailed() {
  const log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MAIL_LOG_NAME);
  const seen = {};
  if (!log || log.getLastRow() < 2) return seen;
  log.getRange(2, 2, log.getLastRow() - 1, 1).getValues().forEach(function (r) {
    const e = String(r[0]).trim().toLowerCase();
    if (e) seen[e] = true;
  });
  return seen;
}

function logMailed(student, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let log = ss.getSheetByName(MAIL_LOG_NAME);
  if (!log) log = ss.insertSheet(MAIL_LOG_NAME);
  if (log.getLastRow() === 0) {
    log.appendRow(['When', 'Email', 'Name', 'Row', 'Token', 'Status']);
  }
  log.appendRow([new Date(), student.email, student.name, student.row, student.token, status]);
}

/** Plain-text body — the fallback for clients that refuse HTML. */
function tokenEmailText(student) {
  const appUrl = scriptProp('APP_URL');
  const greeting = student.name ? ('Hi ' + student.name.split(' ')[0] + ',') : 'Hi,';
  return [
    greeting,
    '',
    'Here is your personal submission code for JavaScript Everywhere.',
    'It is 10 characters, it belongs to you alone, and you will use the',
    'same one for every day of the course:',
    '',
    '    ' + student.token,
    '',
    'How to use it: open the Day 01 submission page, enter your email',
    'exactly as it appears on the roster (' + student.email + '),',
    'paste the code above, and submit. Your score lands in the sheet',
    'automatically.',
    appUrl ? ('\nSubmission page: ' + appUrl + '\n') : '',
    'Please keep this code private. Anyone who has it can submit work',
    'in your name. If you lose it, ask me and I will resend it — the',
    'code never changes.',
    '',
    '— ' + (scriptProp('FROM_NAME') || 'Your instructor')
  ].join('\n');
}

function tokenEmailHtml(student) {
  const appUrl = scriptProp('APP_URL');
  const greeting = student.name ? ('Hi ' + student.name.split(' ')[0] + ',') : 'Hi,';
  const button = appUrl
    ? '<p style="margin:24px 0"><a href="' + appUrl + '" style="background:#111827;color:#fff;' +
      'padding:11px 20px;border-radius:6px;text-decoration:none;font-weight:600;' +
      'display:inline-block">Open the submission page</a></p>'
    : '';

  return '' +
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
    'font-size:15px;line-height:1.6;color:#111827;max-width:560px">' +
      '<p>' + escapeHtml(greeting) + '</p>' +
      '<p>Here is your <strong>personal submission code</strong> for JavaScript ' +
      'Everywhere. It is 10 characters, it belongs to you alone, and you will use ' +
      'the same one for every day of the course.</p>' +
      '<p style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;' +
      'font-size:24px;letter-spacing:3px;font-weight:700;background:#f3f4f6;' +
      'border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;text-align:center">' +
      escapeHtml(student.token) + '</p>' +
      button +
      '<p><strong>How to use it:</strong> open the Day 01 submission page, enter your ' +
      'email exactly as it appears on the roster (<code>' + escapeHtml(student.email) +
      '</code>), paste the code above, and submit. Your score lands in the sheet ' +
      'automatically.</p>' +
      '<p style="color:#6b7280">Please keep this code private — anyone who has it can ' +
      'submit work in your name. If you lose it, ask me and I will resend it; the code ' +
      'never changes.</p>' +
      '<p>— ' + escapeHtml(scriptProp('FROM_NAME') || 'Your instructor') + '</p>' +
    '</div>';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Show the first student's email in the log without sending anything.
 * Run this before emailAllTokens to check the wording and the APP_URL.
 */
function previewTokenEmail() {
  const roster = readRoster();
  if (!roster.length) throw new Error('Roster is empty — check SHEET_NAME and the email column.');
  const s = roster[0];
  Logger.log('To: %s\nSubject: %s\n\n%s\n\nQuota left today: %s emails',
    s.email, TOKEN_EMAIL_SUBJECT, tokenEmailText(s), MailApp.getRemainingDailyQuota());
  return 'Previewed ' + s.email + ' — nothing sent.';
}


/**
 * Send every student their own token. Safe to rerun: anyone already in the
 * Mail Log is skipped, so a quota-interrupted run resumes where it stopped.
 */
function emailAllTokens() {
  const roster = readRoster();
  const seen = alreadyMailed();

  let sent = 0, skipped = 0, failed = 0;

  for (let i = 0; i < roster.length; i++) {
    const s = roster[i];

    if (seen[s.email]) { skipped++; continue; }

    if (MailApp.getRemainingDailyQuota() < 1) {
      Logger.log('Gmail quota exhausted after %s sends — rerun tomorrow to finish the rest.', sent);
      break;
    }

    try {
      MailApp.sendEmail({
        to: s.email,
        subject: TOKEN_EMAIL_SUBJECT,
        body: tokenEmailText(s),
        htmlBody: tokenEmailHtml(s),
        name: scriptProp('FROM_NAME') || undefined
      });
      logMailed(s, 'sent');
      sent++;
    } catch (err) {
      logMailed(s, 'FAILED: ' + err);
      failed++;
    }
  }

  const summary = 'sent ' + sent + ', skipped ' + skipped + ' (already mailed), failed ' +
                  failed + '; quota left ' + MailApp.getRemainingDailyQuota();
  Logger.log(summary);
  return summary;
}

/** Resend to one student — the answer to "I lost my code". */
function emailOneToken(address) {
  const target = String(address || '').trim().toLowerCase();
  if (!target) throw new Error('Call emailOneToken("student@example.com")');

  const match = readRoster().filter(function (s) { return s.email === target; })[0];
  if (!match) throw new Error('"' + target + '" is not on the roster.');

  MailApp.sendEmail({
    to: match.email,
    subject: TOKEN_EMAIL_SUBJECT,
    body: tokenEmailText(match),
    htmlBody: tokenEmailHtml(match),
    name: scriptProp('FROM_NAME') || undefined
  });
  logMailed(match, 'resent');
  return 'Sent to ' + match.email;
}
