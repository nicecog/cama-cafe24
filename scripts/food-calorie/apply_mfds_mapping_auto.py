#!/usr/bin/env python3
"""매핑 후보에서 안전한 exact 매칭만 mapped.csv food_code 에 채운다."""
from __future__ import annotations

import csv
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
MAPPED = REPO / "docs" / "food_mvp_100_classes.mapped.csv"
CAND = REPO / "docs" / "food_mfds_mapping_candidates.csv"


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKC", str(text or ""))
    text = re.sub(r"\([^)]*\)", "", text)
    text = text.split("_")[0]
    return re.sub(r"[\s/\-·.]", "", text).strip().lower()


def compatible(class_name: str, food_name: str) -> bool:
    cn = norm(class_name)
    fn = norm(food_name)
    if not cn or not fn:
        return False
    if cn == fn:
        return True
    # 순두부찌개_모듬 처럼 접두가 클래스명인 경우만 허용
    if fn.startswith(cn) and len(fn) - len(cn) <= 6:
        return True
    return False


def pick_code(row: dict[str, str]) -> str | None:
    class_name = row["name_ko"]
    options: list[tuple[float, str, str]] = []
    for i in (1, 2, 3):
        code = (row.get(f"candidate_{i}_code") or "").strip()
        name = (row.get(f"candidate_{i}_name") or "").strip()
        try:
            score = float(row.get(f"candidate_{i}_score") or 0)
        except ValueError:
            score = 0.0
        if not code or score < 1.0:
            continue
        if not compatible(class_name, name):
            continue
        options.append((score, code, name))
    if not options:
        return None
    # 가정식 분석(D1*) 우선, 그다음 외식/급식 등
    options.sort(key=lambda x: (0 if x[1].startswith("D1") else 1, -x[0], x[1]))
    return options[0][1]


def main() -> None:
    candidates = list(csv.DictReader(CAND.open(encoding="utf-8")))
    by_key = {r["class_key"]: r for r in candidates}
    rows = list(csv.DictReader(MAPPED.open(encoding="utf-8")))
    fieldnames = list(rows[0].keys())

    filled = 0
    for row in rows:
        if row.get("food_code"):
            continue
        cand = by_key.get(row["class_key"])
        if not cand:
            continue
        code = pick_code(cand)
        if code:
            row["food_code"] = code
            filled += 1

    with MAPPED.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    mapped_count = sum(1 for r in rows if r.get("food_code"))
    print(f"auto-filled={filled}, total_with_food_code={mapped_count}/{len(rows)}")


if __name__ == "__main__":
    main()
