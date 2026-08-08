#!/usr/bin/env python3
"""
AI Hub food dataset → MVP 100종 매핑 → 샘플링 → YOLO 변환 → (옵션) 학습/export

Usage:
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py all
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py map
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py convert
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py train7a
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py train7b
  .venv\\Scripts\\python.exe scripts\\food-calorie\\run_mvp_pipeline.py export8
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import random
import re
import shutil
import sys
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "docs" / "food_mvp_100_classes.csv"
MAPPED_DIR = ROOT / "data" / "aihub" / "mapped"
DATASET_DIR = Path("D:/food_mvp")  # selected MVP subset (SSD; was F:/ HDD)
EXPORTS_DIR = ROOT / "exports"
RUNS_DIR = ROOT / "runs" / "food"

FILENAME_RE = re.compile(r"^[^_]+_[^_]+_[^_]+_(.+)_\d+_\d+$")

# class_key → 검색 키워드 (포함 매칭, 긴 키워드 우선)
SYNONYMS: dict[str, list[str]] = {
    "white_rice": ["흰쌀밥", "공기밥", "흰밥", "쌀밥"],
    "brown_rice": ["현미밥", "잡곡밥"],
    "gimbap": ["참치마요김밥", "치즈김밥", "야채김밥", "김밥"],
    "bibimbap": ["돌솥비빔밥", "비빔밥"],
    "bokkeumbap": ["김치볶음밥", "새우볶음밥", "치킨볶음밥", "볶음밥", "나시고랭"],
    "deopbap": ["제육덮밥", "불고기덮밥", "회덮밥", "카레덮밥", "덮밥", "돈부리"],
    "curry_rice": ["카레라이스", "카레밥", "커리라이스", "카레"],
    "omurice": ["오므라이스", "오무라이스"],
    "ramyeon": ["라면", "라멘"],
    "jjajangmyeon": ["짜장면", "자장면", "간짜장", "쟁반짜장"],
    "jjamppong": ["짬뽕", "나가사끼짬뽕", "해물짬뽕"],
    "udon": ["우동"],
    "naengmyeon": ["물냉면", "평양냉면", "함흥냉면", "중화냉면", "냉면"],
    "kalguksu": ["칼국수"],
    "jjolmyeon": ["쫄면"],
    "spaghetti": ["스파게티", "파스타", "까르보나라", "봉골레", "로제파스타", "오일파스타"],
    "kimchi_jjigae": ["김치찌개"],
    "doenjang_jjigae": ["된장찌개"],
    "sundubu_jjigae": ["순두부찌개"],
    "miyeokguk": ["미역국"],
    "yukgaejang": ["육개장", "닭개장"],
    "seolleongtang": ["설렁탕", "설농탕"],
    "gomtang": ["곰탕", "사골곰탕", "꼬리곰탕"],
    "galbitang": ["갈비탕"],
    "samgyetang": ["삼계탕", "반계탕"],
    "doenjangguk": ["된장국"],
    "egg_soup": ["계란국", "달걀국"],
    "kongnamulguk": ["콩나물국"],
    "budae_jjigae": ["부대찌개"],
    "maeuntang": ["매운탕", "해천탕", "해신탕"],
    "samgyeopsal": ["삼겹살구이", "삼겹살", "오겹살"],
    "moksal": ["목살구이", "항정살", "목살"],
    "bulgogi": ["불고기"],
    "jeyuk_bokkeum": ["제육볶음", "돼지불고기", "제육"],
    "dakgalbi": ["닭갈비"],
    "chicken_fried": ["후라이드치킨", "프라이드치킨", "후라이드", "치킨"],
    "chicken_seasoned": ["양념치킨", "간장치킨", "양념"],
    "grilled_mackerel": ["고등어구이", "고등어조림", "고등어"],
    "grilled_saury": ["삼치구이", "꽁치구이", "삼치", "꽁치"],
    "grilled_hairtail": ["갈치구이", "갈치조림", "갈치"],
    "pork_cutlet": ["돈까스", "돈가스", "카츠", "로스카츠", "등심카츠"],
    "fish_cutlet": ["생선까스", "생선가스"],
    "tteokgalbi": ["떡갈비"],
    "bossam": ["보쌈", "수육보쌈"],
    "jokbal": ["족발", "미니족발", "마늘족발"],
    "egg_roll": ["계란말이", "달걀말이"],
    "fried_egg": ["계란후라이", "달걀프라이", "계란프라이"],
    "scrambled_egg": ["스크램블에그", "스크램블"],
    "kimchi": ["배추김치", "김치"],
    "kkakdugi": ["깍두기"],
    "oi_sobagi": ["오이소박이", "오이무침"],
    "spinach_namul": ["시금치나물", "시금치무침"],
    "bean_sprout_namul": ["콩나물무침", "콩나물볶음"],
    "fernbrake_namul": ["고사리나물", "고사리무침"],
    "anchovy_bokkeum": ["멸치볶음", "멸치조림", "잔멸치"],
    "potato_jorim": ["감자조림"],
    "quail_egg_jorim": ["메추리알장조림", "메추리알"],
    "eomuk_bokkeum": ["어묵볶음", "오뎅볶음", "어묵"],
    "japchae": ["잡채"],
    "salad": ["샐러드", "포케"],
    "tteokbokki": ["떡볶이"],
    "sundae": ["순대"],
    "twigim": ["모듬튀김", "튀김", "오징어튀김"],
    "hotdog": ["핫도그"],
    "pizza": ["피자"],
    "hamburger": ["햄버거", "버거"],
    "sandwich": ["샌드위치"],
    "toast": ["토스트"],
    "dumplings": ["만두", "교자", "샤오롱바오"],
    "jjinppang": ["찐빵", "호빵", "꽃빵"],
    "soondae_gukbap": ["순대국밥", "순대국"],
    "pork_soup_rice": ["돼지국밥", "국밥"],
    "kimbap_triangle": ["삼각김밥"],
    "convenience_lunchbox": ["도시락"],
    "apple": ["사과", "사과주스"],
    "banana": ["바나나"],
    "orange": ["귤", "오렌지", "감귤", "한라봉", "천혜향"],
    "grape": ["포도", "샤인머스켓", "거봉", "청포도"],
    "strawberry": ["딸기"],
    "watermelon": ["수박", "수박주스"],
    "pear": ["배주스", "배숙", "통배"],
    "persimmon": ["단감", "홍시", "곶감"],
    "yogurt": ["요거트", "요구르트", "그릭요거트", "플레인요거트"],
    "milk": ["우유"],
    "soy_milk": ["두유"],
    "americano": ["아메리카노"],
    "latte": ["카페라떼", "라떼", "카페라테"],
    "juice": ["주스", "과일주스", "오렌지주스", "사과주스"],
    "soda": ["콜라", "사이다", "환타", "스프라이트"],
    "ion_drink": ["이온음료", "포카리스웨트", "게토레이"],
    "tofu": ["두부", "두부부침", "두부조림"],
    "jeon_kimchi": ["김치전", "김치부침개"],
    "jeon_pajeon": ["해물파전", "파전", "부추전"],
    "haemul_bokkeum": ["주꾸미볶음", "낙지볶음", "오징어볶음", "주꾸미", "낙지"],
    "raw_fish": ["모듬회", "회", "사시미"],
    "gimbap_mayo": ["참치마요김밥", "참치마요", "샐러드김밥"],
    "chicken_gangjeong": ["닭강정", "강정"],
    "jjigae_cheonggukjang": ["청국장찌개", "청국장"],
    "bibim_naengmyeon": ["비빔냉면"],
    "fruit_cup": ["컵과일", "컷팅과일", "과일컵"],
}

# 너무 광범위한 키워드가 오매칭되지 않게 제외할 부분 문자열
NEGATIVE: dict[str, list[str]] = {
    "white_rice": ["볶음밥", "비빔밥", "덮밥", "김밥", "국밥", "카레", "오므"],
    "kimchi": ["찌개", "전", "볶음밥", "나베", "만두", "국", "전골"],
    "chicken_fried": ["양념", "갈비", "볶음", "강정", "커리", "포케", "퀘사", "부리또", "타코", "카레"],
    "chicken_seasoned": ["후라이드", "프라이드"],
    "naengmyeon": ["비빔"],
    "bibim_naengmyeon": [],
    "gimbap": ["삼각"],
    "ramyeon": ["파스타", "우동", "쌀국수"],
    "pork_soup_rice": ["순대"],
    "sundae": ["국밥", "국"],
    "persimmon": ["감자", "감자전", "감귤"],
    "apple": ["파인애플"],
    "juice": ["드레싱"],
    "salad": ["과일"],
    "pear": ["회", "덮밥", "배즙", "배추", "배달"],
    "persimmon": ["감자", "감귤", "감자전", "감태"],
    "strawberry": ["딸기맛"],
    "watermelon": ["수박씨"],
    "fried_egg": ["스크램블"],
    "potato_jorim": ["그라탕", "튀김", "토스트", "피자", "핫도그", "샐러드", "스프"],
    "toast": ["프렌치토스트제외없음"],
    "jokbal": [],
    "hotdog": [],
    "sandwich": [],
    "jjinppang": [],
    "anchovy_bokkeum": ["김치"],
    "jeon_pajeon": [],
    "bossam": [],
}


def find_aihub_root() -> Path:
    for p in Path("K:/").iterdir():
        if p.is_dir() and p.name.startswith("01-1"):
            return p
    raise SystemExit("K:/01-1* not found")


def load_mvp_classes() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    with CSV_PATH.open("r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append(row)
    return rows


def clip01(v: float) -> float:
    return max(0.0, min(1.0, float(v)))


def xywh_to_yolo(x: float, y: float, w: float, h: float, iw: float, ih: float) -> tuple[float, float, float, float]:
    cx = (x + w / 2.0) / iw
    cy = (y + h / 2.0) / ih
    return clip01(cx), clip01(cy), clip01(w / iw), clip01(h / ih)


def food_name_from_stem(stem: str) -> str | None:
    m = FILENAME_RE.match(stem)
    return m.group(1) if m else None


def score_match(aihub_name: str, class_key: str, name_ko: str) -> float:
    name = aihub_name.strip()
    negs = NEGATIVE.get(class_key, [])
    for neg in negs:
        if neg and neg in name:
            # allow if an explicit positive longer keyword still matches later
            pass

    best = 0.0
    # exact / contains synonym
    keys = SYNONYMS.get(class_key, []) + [name_ko.split("(")[0].split("/")[0]]
    # longer first
    keys = sorted({k for k in keys if k}, key=len, reverse=True)
    for kw in keys:
        if name == kw:
            best = max(best, 1.0)
        elif kw in name:
            # penalize if negative token present (unless kw itself contains it)
            if any(neg in name and neg not in kw for neg in negs):
                best = max(best, 0.55)
            else:
                # prefer tighter matches
                best = max(best, 0.85 + 0.1 * (len(kw) / max(len(name), 1)))
        elif name in kw and len(name) >= 2:
            best = max(best, 0.7)

    # fuzzy on short names
    ratio = SequenceMatcher(None, name, name_ko.split("(")[0]).ratio()
    if ratio >= 0.8:
        best = max(best, ratio)
    return min(best, 1.0)


def discover_label_dirs(aihub_root: Path) -> list[Path]:
    out: list[Path] = []
    for split in ("Training", "Validation"):
        split_dir = aihub_root / split
        if not split_dir.is_dir():
            continue
        for child in split_dir.iterdir():
            if not child.is_dir():
                continue
            # labeling folder contains TL* or VL*
            sub = list(child.iterdir())
            if any(s.name.startswith(("TL", "VL")) for s in sub if s.is_dir()):
                out.append(child)
    return out


def discover_image_roots(aihub_root: Path) -> list[Path]:
    out: list[Path] = []
    for split in ("Training", "Validation"):
        split_dir = aihub_root / split
        if not split_dir.is_dir():
            continue
        for child in split_dir.iterdir():
            if not child.is_dir():
                continue
            subnames = [s.name for s in child.iterdir() if s.is_dir()]
            if any(n.startswith("TS") or n == "TS" or n.startswith("VS") or n == "VS" for n in subnames):
                out.append(child)
    return out


def build_label_to_image_root_map(aihub_root: Path) -> dict[Path, Path]:
    """Map labeling root → image root within the same Training/Validation split."""
    mapping: dict[Path, Path] = {}
    for split in ("Training", "Validation"):
        split_dir = aihub_root / split
        if not split_dir.is_dir():
            continue
        label_root = None
        img_root = None
        for child in split_dir.iterdir():
            if not child.is_dir():
                continue
            sub = [c for c in child.iterdir() if c.is_dir()]
            names = [c.name for c in sub]
            if any(n.startswith(("TL", "VL")) for n in names):
                label_root = child
            if any(n.startswith(("TS", "VS")) or n in ("TS", "VS") for n in names):
                img_root = child
        if label_root and img_root:
            mapping[label_root.resolve()] = img_root.resolve()
    return mapping


def resolve_image_from_label(json_path: Path, label_to_img: dict[Path, Path]) -> Path | None:
    """
    TL1/A/.../file.json  →  TS/TS1/A/.../file.jpg
    VL1/A/.../file.json  →  VS/VS1/A/.../file.jpg
    """
    jp = json_path.resolve()
    label_root = None
    img_root = None
    for lr, ir in label_to_img.items():
        try:
            jp.relative_to(lr)
            label_root, img_root = lr, ir
            break
        except ValueError:
            continue
    if label_root is None or img_root is None:
        return None

    rel = jp.relative_to(label_root)
    parts = list(rel.parts)
    if not parts:
        return None
    head = parts[0]  # TL1 / VL2
    if head.startswith("TL") and head[2:].isdigit():
        parts = ["TS", f"TS{head[2:]}"] + parts[1:]
    elif head.startswith("VL") and head[2:].isdigit():
        parts = ["VS", f"VS{head[2:]}"] + parts[1:]
    else:
        return None

    stem = Path(parts[-1]).stem
    parent = img_root.joinpath(*parts[:-1])
    for ext in (".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG"):
        cand = parent / f"{stem}{ext}"
        if cand.is_file():
            return cand
    return None


def index_images(img_roots: list[Path], cache_path: Path) -> dict[str, str]:
    # Kept for optional fallback; prefer resolve_image_from_label.
    if cache_path.is_file():
        print(f"[index] load cache {cache_path}")
        return json.loads(cache_path.read_text(encoding="utf-8"))

    index: dict[str, str] = {}
    for root in img_roots:
        print(f"[index] scanning images under {root}")
        for dirpath, _, files in os.walk(root):
            for fn in files:
                low = fn.lower()
                if low.endswith((".jpg", ".jpeg", ".png")):
                    stem = Path(fn).stem
                    index.setdefault(stem, str(Path(dirpath) / fn))
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
    print(f"[index] wrote {len(index)} stems → {cache_path}")
    return index


def cmd_map(args: argparse.Namespace) -> None:
    aihub_root = Path(args.aihub_root) if args.aihub_root else find_aihub_root()
    print(f"[map] aihub_root={aihub_root}")
    mvp = load_mvp_classes()
    label_dirs = discover_label_dirs(aihub_root)
    print(f"[map] label dirs: {label_dirs}")

    # food_name -> list of json paths (as strings)
    by_food: dict[str, list[str]] = defaultdict(list)
    total = 0
    for label_dir in label_dirs:
        print(f"[map] walking {label_dir}")
        for dirpath, _, files in os.walk(label_dir):
            for fn in files:
                if not fn.endswith(".json"):
                    continue
                stem = fn[:-5]
                food = food_name_from_stem(stem)
                if not food:
                    continue
                by_food[food].append(str(Path(dirpath) / fn))
                total += 1
    print(f"[map] jsons={total} unique_foods={len(by_food)}")

    # map each MVP class
    mapped_rows: list[dict[str, Any]] = []
    used_foods: set[str] = set()
    for row in mvp:
        class_key = row["class_key"]
        name_ko = row["name_ko"]
        cid = int(row["id"])
        target = int(row.get("target_images") or 1000)
        priority = row.get("priority") or "P1"

        candidates: list[tuple[float, str, int]] = []
        for food, paths in by_food.items():
            if food in used_foods and class_key not in ("chicken_fried", "pizza", "spaghetti"):
                # allow multi-map only for broad umbrellas below
                pass
            sc = score_match(food, class_key, name_ko)
            if sc >= 0.8:
                candidates.append((sc, food, len(paths)))
        candidates.sort(key=lambda x: (-x[0], -x[2], x[1]))

        # take top matches until enough images; avoid stealing exact matches from others greedily
        chosen: list[str] = []
        available = 0
        for sc, food, cnt in candidates:
            # skip very weak partials for short keywords
            if sc < 0.8:
                continue
            # for broad keys like chicken_fried, require keyword presence
            if class_key == "chicken_fried" and "치킨" not in food and "후라이드" not in food and "프라이드" not in food:
                continue
            if class_key == "chicken_seasoned" and "양념" not in food and "간장" not in food:
                continue
            if food in used_foods and sc < 0.95:
                continue
            chosen.append(food)
            used_foods.add(food)
            available += cnt
            if available >= target * 3:  # enough pool
                break

        mapped_rows.append(
            {
                "id": cid,
                "class_key": class_key,
                "name_ko": name_ko,
                "priority": priority,
                "target_images": target,
                "available_images": available,
                "aihub_names": "|".join(chosen),
                "match_scores": "|".join(
                    f"{food}:{next(sc for sc,f,_ in candidates if f==food):.2f}" for food in chosen
                ),
                "status": (
                    "ok"
                    if available >= 500
                    else ("low" if available >= 100 else ("empty" if available == 0 else "very_low"))
                ),
            }
        )

    MAPPED_DIR.mkdir(parents=True, exist_ok=True)
    out_csv = MAPPED_DIR / "food_mvp_100_classes.mapped.csv"
    # also repo docs copy
    docs_csv = ROOT / "docs" / "food_mvp_100_classes.mapped.csv"
    fields = [
        "id",
        "class_key",
        "name_ko",
        "priority",
        "target_images",
        "available_images",
        "aihub_names",
        "match_scores",
        "status",
        "food_code",
        "notes",
    ]
    for path in (out_csv, docs_csv):
        with path.open("w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=fields)
            w.writeheader()
            for r in mapped_rows:
                rr = dict(r)
                rr.setdefault("food_code", "")
                rr.setdefault("notes", "")
                w.writerow(rr)

    # inventory for convert step
    inventory = {
        "aihub_root": str(aihub_root),
        "by_food": {k: v for k, v in by_food.items()},
        "mapped": mapped_rows,
    }
    inv_path = MAPPED_DIR / "inventory.json"
    # by_food is huge; write compact counts + paths only for mapped foods
    compact_foods = set()
    for r in mapped_rows:
        if r["aihub_names"]:
            compact_foods.update(r["aihub_names"].split("|"))
    compact = {
        "aihub_root": str(aihub_root),
        "mapped": mapped_rows,
        "by_food": {k: by_food[k] for k in compact_foods if k in by_food},
    }
    inv_path.write_text(json.dumps(compact, ensure_ascii=False), encoding="utf-8")

    ok = sum(1 for r in mapped_rows if r["status"] == "ok")
    low = sum(1 for r in mapped_rows if r["status"] in ("low", "very_low"))
    empty = sum(1 for r in mapped_rows if r["status"] == "empty")
    print(f"[map] wrote {out_csv}")
    print(f"[map] status ok={ok} low={low} empty={empty}")
    for r in mapped_rows:
        if r["status"] != "ok":
            print(f"  - {r['status']:8s} {r['class_key']:22s} avail={r['available_images']:5d} names={r['aihub_names']}")


def load_inventory() -> dict[str, Any]:
    path = MAPPED_DIR / "inventory.json"
    if not path.is_file():
        raise SystemExit("inventory.json missing — run map first")
    return json.loads(path.read_text(encoding="utf-8"))


def place_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() or dst.is_symlink():
        dst.unlink()
    # Prefer hardlink (same volume, zero extra bytes), then symlink, then copy.
    try:
        os.link(src, dst)
        return
    except OSError:
        pass
    try:
        os.symlink(src, dst)
        return
    except OSError:
        pass
    shutil.copy2(src, dst)


def cmd_convert(args: argparse.Namespace) -> None:
    # unbuffered-ish progress
    print("[convert] start", flush=True)
    inv = load_inventory()
    aihub_root = Path(inv["aihub_root"])
    mapped = inv["mapped"]
    by_food: dict[str, list[str]] = inv["by_food"]

    label_to_img = build_label_to_image_root_map(aihub_root)
    print(f"[convert] label→image roots: {label_to_img}", flush=True)

    # build class map: only classes with available >= min_images
    min_images = args.min_images
    active = [r for r in mapped if int(r["available_images"]) >= min_images]
    # keep original ids; renumber densely for YOLO
    active = sorted(active, key=lambda r: int(r["id"]))
    class_list = [(i, r["class_key"], r) for i, r in enumerate(active)]
    print(f"[convert] active classes={len(class_list)} (min_images={min_images})", flush=True)

    classes_json = {
        "schema": "aihub_filename_foodname",
        "classes": {key: i for i, key, _ in class_list},
        "id_to_key": {str(i): key for i, key, _ in class_list},
        "meta": {
            key: {
                "yolo_id": i,
                "name_ko": r["name_ko"],
                "aihub_names": r["aihub_names"],
                "available_images": r["available_images"],
                "status": r["status"],
            }
            for i, key, r in class_list
        },
    }
    classes_path = MAPPED_DIR / "classes_food_mvp.json"
    classes_path.write_text(json.dumps(classes_json, ensure_ascii=False, indent=2), encoding="utf-8")

    rng = random.Random(args.seed)
    per_class_target = args.per_class
    selected: list[tuple[int, str, str]] = []  # yolo_id, json_path, img_path

    for yolo_id, key, row in class_list:
        names = [n for n in (row["aihub_names"] or "").split("|") if n]
        pool: list[str] = []
        for n in names:
            pool.extend(by_food.get(n, []))
        rng.shuffle(pool)
        taken = 0
        missing_img = 0
        for jp_s in pool:
            if taken >= per_class_target:
                break
            jp = Path(jp_s)
            img = resolve_image_from_label(jp, label_to_img)
            if img is None:
                missing_img += 1
                continue
            selected.append((yolo_id, jp_s, str(img)))
            taken += 1
        print(f"[convert] {key:22s} selected={taken:4d}/{per_class_target} missing_img={missing_img}", flush=True)

    rng.shuffle(selected)
    n_val = max(1, int(len(selected) * args.val_ratio)) if selected else 0
    val_idx = set(range(n_val))

    out_dir = Path(args.out)
    if out_dir.exists() and args.clean:
        print(f"[convert] cleaning {out_dir}")
        shutil.rmtree(out_dir)
    for split in ("train", "val"):
        (out_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (out_dir / "labels" / split).mkdir(parents=True, exist_ok=True)

    bad_json = 0
    written = 0
    counts = defaultdict(int)
    for i, (yolo_id, jp_s, img_s) in enumerate(selected):
        split = "val" if i in val_idx else "train"
        jp = Path(jp_s)
        img = Path(img_s)
        try:
            obj = json.loads(jp.read_text(encoding="utf-8"))
            data = obj.get("data", obj)
            info = data.get("image_info") or {}
            ann = data.get("2d_annotation")
            if ann is None:
                bad_json += 1
                continue
            anns = [ann] if isinstance(ann, dict) else list(ann)
            iw = float(info.get("width") or 0)
            ih = float(info.get("height") or 0)
            if iw <= 0 or ih <= 0:
                bad_json += 1
                continue
            lines: list[str] = []
            for a in anns:
                cx, cy, w, h = xywh_to_yolo(
                    float(a["x"]), float(a["y"]), float(a["width"]), float(a["height"]), iw, ih
                )
                if w <= 0 or h <= 0:
                    continue
                lines.append(f"{yolo_id} {cx:.6f} {cy:.6f} {w:.6f} {h:.6f}")
            if not lines:
                bad_json += 1
                continue
        except Exception:
            bad_json += 1
            continue

        # unique filename to avoid collisions across foods
        out_name = f"{yolo_id:03d}_{img.stem}{img.suffix.lower()}"
        dst_img = out_dir / "images" / split / out_name
        dst_lbl = out_dir / "labels" / split / f"{Path(out_name).stem}.txt"
        place_file(img, dst_img)
        dst_lbl.write_text("\n".join(lines) + "\n", encoding="utf-8")
        written += 1
        counts[yolo_id] += 1
        if written % 2000 == 0:
            print(f"[convert] written {written}/{len(selected)}")

    # data.yaml
    names_block = "\n".join(f"  {i}: {key}" for i, key, _ in class_list)
    yaml_text = f"""# Auto-generated MVP food dataset
path: {out_dir.resolve().as_posix()}
train: images/train
val: images/val
names:
{names_block}
"""
    (out_dir / "data.yaml").write_text(yaml_text, encoding="utf-8")
    shutil.copy2(classes_path, out_dir / "classes.json")

    # count report
    report_rows = []
    for i, key, r in class_list:
        report_rows.append(
            {
                "yolo_id": i,
                "class_key": key,
                "name_ko": r["name_ko"],
                "selected": counts[i],
                "available": r["available_images"],
                "aihub_names": r["aihub_names"],
                "status": r["status"],
            }
        )
    report_csv = MAPPED_DIR / "class_counts_after_convert.csv"
    with report_csv.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(report_rows[0].keys()) if report_rows else ["yolo_id"])
        w.writeheader()
        w.writerows(report_rows)

    print(f"[convert] done written={written} bad_json={bad_json} val≈{n_val}")
    print(f"[convert] dataset={out_dir}")
    print(f"[convert] report={report_csv}")


def cmd_preview(args: argparse.Namespace) -> None:
    """Step 6: draw bbox overlays for a few samples."""
    from PIL import Image, ImageDraw

    out_dir = Path(args.out)
    preview_dir = out_dir / "preview"
    preview_dir.mkdir(parents=True, exist_ok=True)
    labels = list((out_dir / "labels" / "train").glob("*.txt"))[: args.n]
    ok = 0
    for lp in labels:
        img_candidates = list((out_dir / "images" / "train").glob(lp.stem + ".*"))
        if not img_candidates:
            continue
        img_path = img_candidates[0]
        im = Image.open(img_path).convert("RGB")
        draw = ImageDraw.Draw(im)
        w, h = im.size
        for line in lp.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            cid, cx, cy, bw, bh = line.split()
            cx, cy, bw, bh = map(float, (cx, cy, bw, bh))
            x1 = (cx - bw / 2) * w
            y1 = (cy - bh / 2) * h
            x2 = (cx + bw / 2) * w
            y2 = (cy + bh / 2) * h
            draw.rectangle([x1, y1, x2, y2], outline=(255, 32, 32), width=4)
            draw.text((x1, max(0, y1 - 14)), cid, fill=(255, 32, 32))
        im.save(preview_dir / f"{lp.stem}.jpg", quality=85)
        ok += 1
    print(f"[preview] wrote {ok} images → {preview_dir}")


def cmd_train7a(args: argparse.Namespace) -> None:
    from ultralytics import YOLO

    data_yaml = Path(args.out) / "data.yaml"
    model_name = args.model
    print(f"[7A] train {model_name} on {data_yaml}")
    model = YOLO(model_name)
    model.train(
        data=str(data_yaml),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=0,
        project=str(RUNS_DIR),
        name=args.name,
        exist_ok=True,
        workers=args.workers,
    )
    print(f"[7A] done → {RUNS_DIR / args.name}")


def cmd_train7b(args: argparse.Namespace) -> None:
    from ultralytics import YOLO

    data_yaml = Path(args.out) / "data.yaml"
    teacher_name = args.teacher_name
    student_name = args.student_name

    # Teacher (s) is heavier → smaller batch. Student (n) uses full --batch (e.g. 64 → ~11-12GB VRAM).
    teacher_batch = max(8, min(32, args.batch // 2))
    student_batch = max(8, args.batch)
    print(f"[7B] teacher train yolo26s → {teacher_name} (batch={teacher_batch})")
    teacher = YOLO("yolo26s.pt")
    teacher.train(
        data=str(data_yaml),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=teacher_batch,
        device=0,
        project=str(RUNS_DIR),
        name=teacher_name,
        exist_ok=True,
        workers=args.workers,
    )
    teacher_best = RUNS_DIR / teacher_name / "weights" / "best.pt"
    print(f"[7B] student KD yolo26n distill_model={teacher_best} (batch={student_batch})")
    student = YOLO("yolo26n.pt")
    student.train(
        data=str(data_yaml),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=student_batch,
        device=0,
        project=str(RUNS_DIR),
        name=student_name,
        exist_ok=True,
        workers=args.workers,
        distill_model=str(teacher_best),
        dis=6.0,
    )
    print(f"[7B] done → {RUNS_DIR / student_name}")


def cmd_export8(args: argparse.Namespace) -> None:
    """Export deployment artifacts.

    Windows-stable path: ONNX @ 416/320 (+ copy best.pt).
    Mac/Linux: also try TFLite/CoreML Int8 (may fail on Windows — skipped).
    """
    from ultralytics import YOLO

    # prefer KD, else baseline
    kd = RUNS_DIR / args.student_name / "weights" / "best.pt"
    base = RUNS_DIR / args.name / "weights" / "best.pt"
    best = kd if kd.is_file() else base
    if not best.is_file():
        raise SystemExit(f"no best.pt found at {kd} or {base}")
    print(f"[8] exporting {best}")
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    data_yaml = Path(args.out) / "data.yaml"
    if not data_yaml.is_file():
        print(f"[8] warn: data.yaml missing at {data_yaml} (OK for ONNX fp32)")

    model = YOLO(str(best))
    stem = "yolo26n-kd" if best.parent.parent.name == args.student_name else "yolo26n-base"

    # Always: Windows-stable ONNX (fp32) for 416 / 320
    for imgsz in (416, 320):
        print(f"[8] ONNX imgsz={imgsz}")
        out = model.export(format="onnx", imgsz=imgsz, simplify=True, dynamic=False)
        src = Path(out) if out else None
        if src is None or not Path(src).is_file():
            # ultralytics writes next to weights: best.onnx
            cand = best.with_name(best.stem + ".onnx")
            src = cand if cand.is_file() else None
        if src and Path(src).is_file():
            dst = EXPORTS_DIR / f"{stem}-{imgsz}.onnx"
            shutil.copy2(src, dst)
            print(f"[8] copied {src} → {dst} ({dst.stat().st_size / 1e6:.2f} MB)")
        else:
            raise SystemExit(f"[8] ONNX export missing for imgsz={imgsz}")

    # Keep PyTorch weights in exports for Windows/Mac shared source of truth
    pt_dst = EXPORTS_DIR / f"{stem}-best.pt"
    shutil.copy2(best, pt_dst)
    print(f"[8] copied {best} → {pt_dst}")

    # Mobile formats: Linux/macOS only (Ultralytics does not support on Windows)
    if sys.platform.startswith("win"):
        print("[8] skip tflite/coreml on Windows — run on macOS later")
    elif data_yaml.is_file():
        for imgsz in (416, 320):
            try:
                print(f"[8] TFLite int8 imgsz={imgsz} (optional)")
                model.export(format="tflite", imgsz=imgsz, int8=True, data=str(data_yaml))
            except Exception as e:
                print(f"[8] tflite imgsz={imgsz} skipped: {e}")
        try:
            print("[8] CoreML int8 imgsz=416 (optional)")
            model.export(format="coreml", imgsz=416, int8=True, data=str(data_yaml))
        except Exception as e:
            print(f"[8] coreml skipped: {e}")
    else:
        print("[8] skip tflite/coreml (no data.yaml)")

    # Collect any mobile artifacts ultralytics may have written
    for pattern in ("*.tflite",):
        for p in best.parent.glob(pattern):
            dst = EXPORTS_DIR / p.name
            shutil.copy2(p, dst)
            print(f"[8] collected {p} → {dst}")
    for p in best.parent.glob("*.mlpackage"):
        dst = EXPORTS_DIR / p.name
        if p.is_dir():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(p, dst)
            print(f"[8] collected {p} → {dst}")

    # Drop unversioned best.onnx clutter if present
    clutter = EXPORTS_DIR / "best.onnx"
    if clutter.is_file():
        clutter.unlink()

    print(f"[8] exports dir {EXPORTS_DIR}")
    for p in sorted(EXPORTS_DIR.iterdir()):
        if p.is_file():
            print(f"     {p.name}  {p.stat().st_size / 1e6:.2f} MB")


def cmd_all(args: argparse.Namespace) -> None:
    cmd_map(args)
    cmd_convert(args)
    cmd_preview(args)
    cmd_train7a(args)
    cmd_train7b(args)
    cmd_export8(args)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_common(sp: argparse.ArgumentParser) -> None:
        sp.add_argument("--aihub-root", default=None)
        sp.add_argument("--out", default=str(DATASET_DIR))
        sp.add_argument("--seed", type=int, default=42)
        sp.add_argument("--val-ratio", type=float, default=0.1)
        sp.add_argument("--per-class", type=int, default=1000)
        sp.add_argument("--min-images", type=int, default=100)
        sp.add_argument("--clean", action="store_true", default=True)
        sp.add_argument("--epochs", type=int, default=100)
        sp.add_argument("--imgsz", type=int, default=640)
        sp.add_argument("--batch", type=int, default=32)
        sp.add_argument("--workers", type=int, default=8)
        sp.add_argument("--model", default="yolo26n.pt")
        sp.add_argument("--name", default="yolo26n_mvp_1000")
        sp.add_argument("--teacher-name", default="yolo26s_teacher")
        sp.add_argument("--student-name", default="yolo26n_kd")
        sp.add_argument("--n", type=int, default=40, help="preview images")

    for name, fn in [
        ("map", cmd_map),
        ("convert", cmd_convert),
        ("preview", cmd_preview),
        ("train7a", cmd_train7a),
        ("train7b", cmd_train7b),
        ("export8", cmd_export8),
        ("all", cmd_all),
    ]:
        sp = sub.add_parser(name)
        add_common(sp)
        sp.set_defaults(func=fn)
    return p


def main() -> None:
    # fix a small typo path print helper leftover — ensure UTF-8 stdout on Windows
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
