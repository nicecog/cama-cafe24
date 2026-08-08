#!/usr/bin/env python3
"""Rematch excluded MVP classes against AI Hub food-name inventory."""
from __future__ import annotations

import csv
import json
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

REPO = Path(r"F:/cama_pjt/cama-cafe24")
MAPPED = REPO / "docs" / "food_mvp_100_classes.mapped.csv"
COUNTS = REPO / "data" / "aihub" / "mapped" / "aihub_food_name_counts.json"
OUT = REPO / "docs" / "food_mvp_38_rematch_candidates.csv"
YAML = REPO / "scripts" / "food-calorie" / "_model_meta" / "data.yaml"

# Extra synonyms for empty classes that failed previous fuzzy match
EXTRA_ALIASES: dict[str, list[str]] = {
    "white_rice": ["흰밥", "공기밥", "쌀밥", "백미밥", "밥"],
    "brown_rice": ["현미밥", "현미"],
    "omurice": ["오므라이스", "오므라이스"],
    "jjolmyeon": ["쫄면"],
    "seolleongtang": ["설렁탕", "설농탕"],
    "galbitang": ["갈비탕"],
    "doenjangguk": ["된장국"],
    "egg_soup": ["계란국", "달걀국"],
    "kongnamulguk": ["콩나물국"],
    "moksal": ["목살", "목살구이"],
    "fish_cutlet": ["생선까스", "생선가스", "피쉬까스"],
    "tteokgalbi": ["떡갈비"],
    "bossam": ["보쌈"],
    "fried_egg": ["계란후라이", "달걀프라이", "프라이", "계란프라이"],
    "scrambled_egg": ["스크램블", "스크램블에그"],
    "kkakdugi": ["깍두기"],
    "oi_sobagi": ["오이무침", "오이생채", "오이소박이"],
    "spinach_namul": ["시금치나물", "시금치무침"],
    "bean_sprout_namul": ["콩나물무침", "콩나물"],
    "fernbrake_namul": ["고사리나물", "고사리무침", "고사리"],
    "anchovy_bokkeum": ["멸치볶음", "멸치조림"],
    "potato_jorim": ["감자조림", "감자채볶음"],
    "quail_egg_jorim": ["메추리알장조림", "메추리알조림"],
    "soondae_gukbap": ["순대국밥", "순대국"],
    "kimbap_triangle": ["삼각김밥"],
    "convenience_lunchbox": ["도시락"],
    "apple": ["사과"],
    "grape": ["포도"],
    "watermelon": ["수박"],
    "yogurt": ["요거트", "요구르트"],
    "soy_milk": ["두유"],
    "soda": ["탄산음료", "콜라", "사이다", "환타"],
    "ion_drink": ["이온음료", "포카리스웨트", "게토레이"],
    "jeon_kimchi": ["김치전", "김치부침개"],
    "jeon_pajeon": ["파전", "해물파전", "부추전"],
    "jjigae_cheonggukjang": ["청국장", "청국장찌개"],
    "bibim_naengmyeon": ["비빔냉면"],
    "fruit_cup": ["컵과일", "컷팅과일", "과일컵"],
}


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKC", str(text or ""))
    text = re.sub(r"[\s_\-()/·.,]", "", text)
    return text.lower()


def main() -> None:
    raw = json.loads(COUNTS.read_text(encoding="utf-8"))
    counts_obj = raw.get("counts", raw) if isinstance(raw, dict) else raw
    counts: dict[str, int] = {}
    if isinstance(counts_obj, dict):
        for k, v in counts_obj.items():
            if isinstance(v, dict):
                counts[k] = int(v.get("count", v.get("n", 0)))
            else:
                counts[k] = int(v)
    names = list(counts.keys())
    print(f"aihub food names={len(names)}")
    norm_index = {norm(n): n for n in names}

    rows = list(csv.DictReader(MAPPED.open(encoding="utf-8")))
    excluded = [r for r in rows if r["status"] in ("empty", "very_low")]

    # model indices
    model_keys = set()
    in_names = False
    for line in YAML.read_text(encoding="utf-8").splitlines():
        if line.strip() == "names:":
            in_names = True
            continue
        if in_names:
            m = re.match(r"\s+(\d+)\s*:\s*(\S+)", line)
            if not m:
                break
            model_keys.add(m.group(2))

    out_rows = []
    recoverable = 0
    for r in excluded:
        key = r["class_key"]
        aliases = [r["name_ko"], *EXTRA_ALIASES.get(key, [])]
        hits: list[tuple[str, int, float, str]] = []
        for alias in aliases:
            na = norm(alias)
            if not na:
                continue
            # exact / contains
            for nn, original in norm_index.items():
                if na == nn or na in nn or nn in na:
                    score = 1.0 if na == nn else 0.92
                    hits.append((original, int(counts[original]), score, "contains"))
            # fuzzy top
            for original in names:
                score = SequenceMatcher(None, na, norm(original)).ratio()
                if score >= 0.82:
                    hits.append((original, int(counts[original]), score, "fuzzy"))

        # dedupe by name keep best
        best: dict[str, tuple[str, int, float, str]] = {}
        for name, cnt, score, how in hits:
            prev = best.get(name)
            if prev is None or score > prev[2]:
                best[name] = (name, cnt, score, how)
        ranked = sorted(best.values(), key=lambda x: (x[2], x[1]), reverse=True)[:8]
        total = sum(x[1] for x in ranked)
        status = "candidate" if total >= 200 else ("weak" if total > 0 else "none")
        if status == "candidate":
            recoverable += 1
        out_rows.append(
            {
                "id": r["id"],
                "class_key": key,
                "name_ko": r["name_ko"],
                "old_status": r["status"],
                "old_images": r["available_images"],
                "in_model": key in model_keys,
                "rematch_status": status,
                "rematch_images": total,
                "top_matches": "|".join(f"{n}:{c}:{s:.2f}" for n, c, s, _ in ranked),
            }
        )

    with OUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(out_rows[0].keys()))
        writer.writeheader()
        writer.writerows(out_rows)

    print(f"excluded={len(excluded)} recoverable(>=200 imgs)={recoverable}")
    print(f"wrote {OUT}")
    for row in out_rows:
        print(
            f"{row['id']:>2} {row['class_key']:<22} {row['rematch_status']:<10} "
            f"imgs={row['rematch_images']:<6} {row['top_matches'][:80]}"
        )


if __name__ == "__main__":
    main()
