# 14 · Reference Library & Continuous Improvement

## What it is, and what it is not

`library/references.jsonl` is a version-controlled store of analysed design
knowledge (schema: `library/schema.json`) that persists by being **committed to
this repository**. It does not train the model, and it does not update itself.
It improves only when a session adds, verifies or corrects records and the
change is committed.

`library/preferences.md` holds documented project and brand preferences
learned from user feedback. Read it at the start of every job.

## Status lifecycle

```
lead ──(search index confirms title/creator/URL)──▶ search-verified ──(images + text actually viewed)──▶ inspected
  └──────────────────────────(URL dead / renamed)──────────────────────────▶ broken (keep record, add replacement as new record)
```

Only `inspected` records may carry a score (enforced). AI or hybrid
classification needs `production_evidence` (enforced). URLs must be ones that
were actually found (policy, not machine-checkable: never construct them).

## Commands

```bash
python3 scripts/library.py search --format poster --language ar        # recall before researching
python3 scripts/library.py search -q "negative space luxury" --min-score 70
python3 scripts/library.py next-id
python3 scripts/library.py add new-ref.json                           # validates + dedupes (URL, title+creator)
python3 scripts/library.py validate                                   # run after any edit
python3 scripts/library.py stats                                      # find coverage gaps
python3 scripts/library.py stale --days 180                           # re-verify old links
```

## Rules

- Recall first: search the library before new research. Reuse lessons, cite IDs.
- Add references that taught something, with lessons phrased as decision rules.
- Separate [obs], [doc] and [inf] in `observations`.
- No near-duplicates: if a new reference teaches the same lesson, keep the stronger one.
- When a link breaks: set `status: broken`, search for the creator, and add any found replacement as a new record (never edit the URL to a guess).
- When new evidence improves an analysis, update the record and `last_verified`.
- After user feedback ("we never use gradients", "logo always top-left"), add a dated line to `preferences.md` with scope (brand/project) and source.
- Commit library changes with the work they came from.

## Without a writable repository

Export the records the session produced as JSON Lines in the reply (or as a
file in the user-visible directory) and explain how to append them with
`library.py add`.
