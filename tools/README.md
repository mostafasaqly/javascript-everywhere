# Grading tools — Day 01

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

`DAY = 1` near the top of `app/day01-tracker.html` picks the column:
Day 1 → C, Day 2 → D, and so on. Change it, republish, done. The Apps
Script needs no edit.

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
```

The table shows each student's percentage, level, bonus count, and which
checks they missed. The CSV gives you `Row,Full Name,Email,Day 1,Level,Bonus,Submitted`
— the `Row` column is their actual row number in the sheet, so you can paste
the `Day 1` values straight into column C without re-sorting anything.

If a student sends two codes, the later one wins automatically.

## What the code can and cannot do

The code carries the roster index, all 67 check bits, and a timestamp,
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
| `roster.json` | The 52 students — `row` is their sheet row. **Order matters:** codes reference the array index, so append, never reorder. |
| `checks.json` | Generated from the app's task model — 61 required + 6 bonus labels, in bit order. |
| `codec.js` | Encode/decode, shared with the page. Change it and old codes stop decoding. |
| `decode-day01.js` | The script you run. |

## Updating the roster

When students join, add them to the **bottom** of the Degrees JS EW tab,
then:

```bash
# 1. export the tab: File > Download > Comma-separated values
node tools/build-roster.js ~/Downloads/"Saqly Courses Students (Responses) - Degrees JS EW.csv"
node tools/embed-roster.js
# 2. ask Claude to republish app/day01-tracker.html
```

`build-roster.js` refuses to write if the new CSV would reorder or drop
anyone already in `roster.json`, because codes carry the array index —
reordering would silently reassign grades to the wrong students. Students
may only be appended.

The roster was built from a CSV export of the sheet on 2026-09-02:
55 students, sheet rows 2–56.
