# Grading tools

Grades now land in the **Degrees JS EW** tab automatically, via the Apps
Script web app in `apps-script/Code.gs`. The submission-code path below is
the fallback for when that endpoint is unreachable.

## Automatic flow (normal)

Student ticks everything → Submit → the page POSTs to the Apps Script
endpoint → the script finds their row by email and writes the percentage
into the Day column → the student sees "✓ Recorded — 100%".

Every submission is also appended to the **Debug** tab with a timestamp,
the previous value, level, bonus count, repo link and LinkedIn link — so
you keep an audit trail even though the grade cell is overwritten on a
resubmission.

### Changing the day

`DAY` near the top of each tracker picks the column: Day 1 → C, Day 2 → D,
Day 3 → E, and so on. `app/day01-tracker.html` sets `DAY = 1`,
`app/day02-tracker.html` sets `DAY = 2`, `app/day03-tracker.html` sets
`DAY = 3`. The Apps Script needs no edit.

### One tracker per day

Each day is a self-contained page with its own task model, salt, code
prefix, `localStorage` key and check list — so a student can have Day 01
and Day 02 open at once without one overwriting the other, and a Day 01
code will not decode as Day 02.

| | Day 01 | Day 02 | Day 03 |
|---|---|---|---|
| Page | `app/day01-tracker.html` | `app/day02-tracker.html` | `app/day03-tracker.html` |
| Tasks | 5 | 8 | 8 |
| Checks | 61 required + 6 bonus | 95 required + 7 bonus | 113 required + 8 bonus |
| Code prefix | `D1.` | `D2.` | `D3.` |
| Salt | `js-everywhere-day01-v1` | `js-everywhere-day02-v1` | `js-everywhere-day03-v1` |
| Storage key | `js-everywhere-day01` | `js-everywhere-day02` | `js-everywhere-day03` |
| Codec | `codec.js` | `codec-day02.js` | `codec-day03.js` |
| Labels | `checks.json` | `checks-day02.json` | `checks-day03.json` |
| Decoder | `decode-day01.js` | `decode-day02.js` | `decode-day03.js` |

All three pages share `roster.json` and the same Apps Script endpoint.

### If a student says nothing was recorded

- Check the **Debug** tab — if their row is there, it worked.
- Have them resend the fallback code shown on their receipt.
- `not_on_roster` means their email isn't in column B of the tab.

## Fallback flow — submission codes

1. Student opens the app, enters their registered email (checked against
   `roster.json` — anyone else is turned away).
2. They tick their way through the 61 required checks and fill in their
   repo + LinkedIn links. Progress saves in their browser.
3. **Submit** unlocks only when all 61 are ticked and both links are filled.
   The page shows a 32-character code:

   ```
   D1.1K.ZZZZZZZZZZZZ03Z.WDK9A.5JQG
   ```

4. They send you that code (WhatsApp, Telegram, wherever).
5. You paste the codes into a text file and run the decoder.

## Recording grades

Collect the codes one per line in a file, e.g. `day01-codes.txt`:

```
D1.1K.ZZZZZZZZZZZZ03Z.WDK9A.5JQG
D1.4.ZZZZZZ0ZZ000000.WDK9A.9Q3X    # Menna — resent, ignore the earlier one
```

Then:

```bash
node tools/decode-day01.js day01-codes.txt          # readable table
node tools/decode-day01.js day01-codes.txt --csv    # rows for the sheet

node tools/decode-day02.js day02-codes.txt          # same, for Day 02
node tools/decode-day02.js day02-codes.txt --csv

node tools/decode-day03.js day03-codes.txt          # same, for Day 03
node tools/decode-day03.js day03-codes.txt --csv
```

The table shows each student's percentage, level, bonus count, and which
checks they missed. The CSV gives you `Row,Full Name,Email,Day 1,Level,Bonus,Submitted`
— the `Row` column is their actual row number in the sheet, so you can paste
the `Day 1` values straight into column C without re-sorting anything.

If a student sends two codes, the later one wins automatically.

## What the code can and cannot do

The code carries the roster index, every check bit for that day, and a timestamp,
signed with a 4-character hash. Editing any part of it makes the decoder
reject it with `Code was edited or mistyped.`

The salt is inside the page source, so a determined student could forge a
code. It stops casual "just type 100" edits, not someone who reads the
JavaScript — which, for this assignment, is arguably a pass anyway. The
links they submit are the real evidence; the code is the tally.

The code does **not** carry their repo link, LinkedIn link, or written
answers — those are far too long to retype. Ask for those separately, or
have students paste them alongside the code.

## Files

| File | What it is |
|---|---|
| `roster.json` | The 52 students — `row` is their sheet row. **Order matters:** codes reference the array index, so append, never reorder. Shared by every day. |
| `checks.json` | Day 01 labels, generated from the app's task model — 61 required + 6 bonus, in bit order. |
| `checks-day02.json` | Day 02 labels — 95 required + 7 bonus, in bit order. |
| `checks-day03.json` | Day 03 labels — 113 required + 8 bonus, in bit order. |
| `codec.js` | Day 01 encode/decode, shared with the page. Change it and old codes stop decoding. |
| `codec-day02.js` | Day 02 encode/decode. Same code, different salt and prefix. |
| `codec-day03.js` | Day 03 encode/decode. Same code, different salt and prefix. |
| `decode-day01.js` | The Day 01 script you run. |
| `decode-day02.js` | The Day 02 script you run. |
| `decode-day03.js` | The Day 03 script you run. |

## Updating the roster

When students join, add them to the **bottom** of the Degrees JS EW tab,
then:

```bash
# 1. export the tab: File > Download > Comma-separated values
node tools/build-roster.js ~/Downloads/"Saqly Courses Students (Responses) - Degrees JS EW.csv"
node tools/embed-roster.js
# 2. ask Claude to republish the tracker pages
```

`build-roster.js` refuses to write if the new CSV would reorder or drop
anyone already in `roster.json`, because codes carry the array index —
reordering would silently reassign grades to the wrong students. Students
may only be appended.

The roster was built from a CSV export of the sheet on 2026-09-02:
55 students, sheet rows 2–56.
