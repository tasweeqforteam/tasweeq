#!/usr/bin/env python3
"""Reference library manager (JSON Lines, one reference per line).

The library is structured design knowledge retrieved in later sessions. It is
NOT model training: nothing here changes the model; it is read back by the
skill when a brief matches.

  library.py add ref.json            validate + append (rejects duplicates by URL/title+creator)
  library.py validate                check every record against library/schema.json rules
  library.py search [filters] [-q text]
        --format poster --industry beauty --language ar --technique hybrid-ai
        --problem "negative space" --status inspected --min-score 70
  library.py show REF-0007
  library.py stats                   coverage by format/industry/language/status (find gaps)
  library.py stale --days 180        records whose last_verified is older than N days
  library.py next-id
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "library"
DB = ROOT / "references.jsonl"
SCHEMA = json.loads((ROOT / "schema.json").read_text())

STATUSES = {"lead", "search-verified", "inspected", "broken"}
METHODS = {"human", "ai-generated", "hybrid", "ai-assisted-documented", "resembles-ai-unverified", "unverified"}
SCORE_DIMS = {"concept": 20, "composition": 20, "typography": 15, "art_direction": 15, "communication": 15, "craft": 15}


def load():
    if not DB.exists():
        return []
    return [json.loads(l) for l in DB.read_text(encoding="utf-8").splitlines() if l.strip()]


def save(records):
    DB.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records), encoding="utf-8")


def errors_for(r):
    errs = []
    for f in SCHEMA["required"]:
        if f not in r or r[f] in (None, "", []):
            errs.append(f"missing required field: {f}")
    if not re.fullmatch(r"REF-\d{4}", str(r.get("id", ""))):
        errs.append("id must look like REF-0001")
    if r.get("status") not in STATUSES:
        errs.append(f"status must be one of {sorted(STATUSES)}")
    if r.get("production_method") not in METHODS:
        errs.append(f"production_method must be one of {sorted(METHODS)}")
    if r.get("production_method") in {"ai-generated", "hybrid", "ai-assisted-documented"} and not r.get("production_evidence"):
        errs.append("an AI/hybrid classification needs production_evidence (creator statement, process shots) — otherwise use 'unverified'")
    url = r.get("url", "")
    if url and not url.startswith("https://"):
        errs.append("url must be an https:// URL that was actually found, never constructed")
    score = r.get("score")
    if score:
        if r.get("status") != "inspected":
            errs.append("only 'inspected' references may carry a score — a search snippet is not evidence of quality")
        for k, mx in SCORE_DIMS.items():
            v = score.get(k)
            if not isinstance(v, (int, float)) or not 0 <= v <= mx:
                errs.append(f"score.{k} must be 0..{mx}")
        if "total" in score and score["total"] != sum(score.get(k, 0) for k in SCORE_DIMS):
            errs.append("score.total must equal the sum of the dimensions")
    for d in ("last_verified",):
        try:
            dt.date.fromisoformat(r.get(d, ""))
        except ValueError:
            errs.append(f"{d} must be YYYY-MM-DD")
    return errs


def norm(s):
    return re.sub(r"\W+", "", (s or "").lower())


def cmd_add(path):
    rec = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    records = load()
    if rec.get("id") in (None, "", "auto"):
        rec["id"] = next_id(records)
    if "score" in rec and rec["score"]:
        rec["score"]["total"] = sum(rec["score"].get(k, 0) for k in SCORE_DIMS)
    errs = errors_for(rec)
    for r in records:
        if r["id"] == rec["id"]:
            errs.append(f"id {rec['id']} already used")
        if rec.get("url") and r.get("url") == rec["url"]:
            errs.append(f"duplicate URL of {r['id']}")
        if norm(r.get("title")) == norm(rec.get("title")) and norm(r.get("creator")) == norm(rec.get("creator")):
            errs.append(f"duplicate title+creator of {r['id']}")
    if errs:
        sys.exit("rejected:\n  " + "\n  ".join(errs))
    records.append(rec)
    save(records)
    print(f"added {rec['id']}: {rec['title']}")


def next_id(records):
    n = max([int(r["id"][4:]) for r in records] or [0]) + 1
    return f"REF-{n:04d}"


def matches(r, a):
    def has(field, want):
        if not want:
            return True
        v = r.get(field) or []
        v = v if isinstance(v, list) else [v]
        return any(want.lower() in str(x).lower() for x in v)
    if not (has("formats", a.format) and has("industry", a.industry) and has("languages", a.language)
            and has("techniques", a.technique) and has("problems_solved", a.problem) and has("status", a.status)):
        return False
    if a.min_score and (r.get("score") or {}).get("total", 0) < a.min_score:
        return False
    if a.q:
        blob = json.dumps(r, ensure_ascii=False).lower()
        return all(t in blob for t in a.q.lower().split())
    return True


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("add").add_argument("file")
    sub.add_parser("validate")
    s = sub.add_parser("search")
    for f in ("format", "industry", "language", "technique", "problem", "status"):
        s.add_argument(f"--{f}")
    s.add_argument("--min-score", type=int)
    s.add_argument("-q")
    sub.add_parser("show").add_argument("id")
    sub.add_parser("stats")
    st = sub.add_parser("stale")
    st.add_argument("--days", type=int, default=180)
    sub.add_parser("next-id")
    a = p.parse_args()
    records = load()

    if a.cmd == "add":
        cmd_add(a.file)
    elif a.cmd == "validate":
        bad = 0
        ids = set()
        for r in records:
            e = errors_for(r)
            if r.get("id") in ids:
                e.append("duplicate id")
            ids.add(r.get("id"))
            if e:
                bad += 1
                print(f"{r.get('id')}: " + "; ".join(e))
        print(f"{len(records)} records, {bad} invalid")
        sys.exit(1 if bad else 0)
    elif a.cmd == "search":
        hits = [r for r in records if matches(r, a)]
        hits.sort(key=lambda r: -(r.get("score") or {}).get("total", 0))
        for r in hits:
            sc = (r.get("score") or {}).get("total", "—")
            print(f"{r['id']}  [{r['status']}] score {sc}  {r['title']} — {r.get('creator') or 'creator unknown'}\n         {r['url']}\n         lessons: {'; '.join(r.get('key_lessons', [])[:2])}")
        print(f"{len(hits)} match(es)")
    elif a.cmd == "show":
        r = next((r for r in records if r["id"] == a.id), None)
        print(json.dumps(r, ensure_ascii=False, indent=2) if r else "not found")
    elif a.cmd == "stats":
        from collections import Counter
        for field in ("status", "production_method", "formats", "industry", "languages", "techniques"):
            c = Counter()
            for r in records:
                v = r.get(field) or ["—"]
                for x in (v if isinstance(v, list) else [v]):
                    c[x] += 1
            print(f"{field}: " + ", ".join(f"{k} {n}" for k, n in c.most_common()))
        print(f"total {len(records)}; inspected {sum(r['status'] == 'inspected' for r in records)}")
    elif a.cmd == "stale":
        cut = dt.date.today() - dt.timedelta(days=a.days)
        for r in records:
            if dt.date.fromisoformat(r["last_verified"]) < cut:
                print(f"{r['id']} last verified {r['last_verified']}: {r['url']}")
    elif a.cmd == "next-id":
        print(next_id(records))


if __name__ == "__main__":
    main()
