#!/usr/bin/env python3
"""docs/food_mvp_100_classes.mapped.csv 에 model_index 컬럼을 채운다.

모델(data.yaml)에 있는 62종만 0..61 인덱스를 갖고, 나머지 38종은 빈 칸이다.
사진 인식은 model_index 가 있는 종만 가능하고, 나머지는 수동 검색으로만 기록한다.
"""
from __future__ import annotations

import csv
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
MAPPED = REPO / "docs" / "food_mvp_100_classes.mapped.csv"
YAML = REPO / "scripts" / "food-calorie" / "_model_meta" / "data.yaml"


def load_model_index() -> dict[str, int]:
    names: dict[str, int] = {}
    in_names = False
    for line in YAML.read_text(encoding="utf-8").splitlines():
        if line.strip() == "names:":
            in_names = True
            continue
        if not in_names:
            continue
        matched = re.match(r"\s+(\d+)\s*:\s*(\S+)\s*$", line)
        if not matched:
            break
        names[matched.group(2)] = int(matched.group(1))
    return names


def main() -> None:
    model = load_model_index()
    rows = list(csv.DictReader(MAPPED.open(encoding="utf-8")))
    fieldnames = list(rows[0].keys())
    if "model_index" not in fieldnames:
        # insert after id
        fieldnames = ["id", "model_index"] + [f for f in fieldnames if f != "id"]
    else:
        fieldnames = ["id", "model_index"] + [
            f for f in fieldnames if f not in ("id", "model_index")
        ]

    detectable = 0
    for row in rows:
        idx = model.get(row["class_key"])
        row["model_index"] = "" if idx is None else str(idx)
        if idx is not None:
            detectable += 1

    with MAPPED.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"updated {MAPPED}")
    print(f"detectable(model_index set)={detectable} / {len(rows)}")
    print(f"manual-only={len(rows) - detectable}")


if __name__ == "__main__":
    main()
