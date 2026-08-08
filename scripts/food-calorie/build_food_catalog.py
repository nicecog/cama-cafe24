"""온디바이스용 `food_catalog.v1.json` 을 생성한다.

두 소스를 합친다.

1. 모델 클래스 인덱스 — `food_mvp_val/data.yaml` 의 `names` (정본)
   학습 데이터가 있는 62종만 0..61 로 재부여되어 있어, CSV `id`(0..99) 나
   DB `cm_food_class.class_id` 와 일치하지 않는다. 반드시 이 파일을 써야 한다.
2. 영양 폴백 — `deploy/sql/cafe24-nutrition-food-class-seed.sql`
   운영 DB 에 적용된 것과 같은 값을 쓰기 위해 시드 SQL 을 파싱한다.
   (100종 영양값을 두 곳에 중복 관리하지 않으려는 의도)

사용법:
    python scripts/food-calorie/build_food_catalog.py \
        --names scripts/food-calorie/_model_meta/data.yaml \
        --out cama-plus-app/android/app/src/main/assets/foodvision/food_catalog.v1.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SEED_SQL = REPO_ROOT / "deploy" / "sql" / "cafe24-nutrition-food-class-seed.sql"
CATALOG_VERSION = "1.0.0"
EXPECTED_SEED_ROWS = 100

# (0,  'white_rice', '흰밥(공기밥)', '밥·면', 'P0', 210, 145, 31.7, 2.5, 0.4),
SEED_ROW = re.compile(
    r"\(\s*(?P<class_id>\d+)\s*,\s*"
    r"'(?P<class_key>[a-z0-9_]+)'\s*,\s*"
    r"'(?P<name_ko>[^']*)'\s*,\s*"
    r"'(?P<category_nm>[^']*)'\s*,\s*"
    r"'(?P<priority_cd>[^']*)'\s*,\s*"
    r"(?P<serving_g>[\d.]+)\s*,\s*"
    r"(?P<kcal>[\d.]+)\s*,\s*"
    r"(?P<carb>[\d.]+)\s*,\s*"
    r"(?P<protein>[\d.]+)\s*,\s*"
    r"(?P<fat>[\d.]+)\s*\)"
)


def parse_model_names(path: Path) -> dict[int, str]:
    """data.yaml 의 `names:` 블록만 읽는다 (yaml 의존성 없이)."""
    names: dict[int, str] = {}
    in_names = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if re.match(r"^names:\s*$", line):
            in_names = True
            continue
        if not in_names:
            continue
        matched = re.match(r"^\s+(\d+)\s*:\s*(\S+)\s*$", line)
        if not matched:
            break
        names[int(matched.group(1))] = matched.group(2)

    if not names:
        raise SystemExit(f"모델 클래스 목록을 읽지 못했습니다: {path}")

    expected = set(range(len(names)))
    if set(names) != expected:
        missing = sorted(expected - set(names))
        raise SystemExit(f"모델 인덱스가 연속적이지 않습니다. 누락: {missing}")
    return names


def parse_seed_nutrition(path: Path) -> dict[str, dict]:
    rows = {}
    for match in SEED_ROW.finditer(path.read_text(encoding="utf-8")):
        group = match.groupdict()
        rows[group["class_key"]] = {
            "nameKo": group["name_ko"],
            "servingG": float(group["serving_g"]),
            "kcalPer100g": float(group["kcal"]),
            "carbPer100g": float(group["carb"]),
            "proteinPer100g": float(group["protein"]),
            "fatPer100g": float(group["fat"]),
        }

    if len(rows) != EXPECTED_SEED_ROWS:
        raise SystemExit(
            f"시드 SQL 파싱 결과가 {len(rows)}건입니다 "
            f"(기대 {EXPECTED_SEED_ROWS}건). 정규식과 SQL 형식을 확인하세요."
        )
    return rows


def build(names: dict[int, str], nutrition: dict[str, dict]) -> dict:
    classes = []
    unknown = []
    for class_id in sorted(names):
        class_key = names[class_id]
        entry = nutrition.get(class_key)
        if entry is None:
            unknown.append(class_key)
            continue
        classes.append(
            {
                "classId": class_id,
                "classKey": class_key,
                # 숫자를 정수로 떨어질 때는 정수로 (JSON 가독성)
                **{
                    key: (int(value) if isinstance(value, float) and value.is_integer() else value)
                    for key, value in entry.items()
                },
            }
        )

    if unknown:
        raise SystemExit(
            "시드 SQL 에 없는 모델 클래스가 있습니다. "
            f"class_key 표기를 맞춰야 합니다: {unknown}"
        )

    return {
        "catalogVersion": CATALOG_VERSION,
        "modelClassCount": len(classes),
        "classes": classes,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--names", required=True, type=Path, help="data.yaml 경로")
    parser.add_argument("--seed", default=SEED_SQL, type=Path, help="시드 SQL 경로")
    parser.add_argument(
        "--out",
        required=True,
        type=Path,
        nargs="+",
        help="출력 JSON 경로 (여러 개 지정 가능: Android/iOS)",
    )
    args = parser.parse_args()

    names = parse_model_names(args.names)
    nutrition = parse_seed_nutrition(args.seed)
    catalog = build(names, nutrition)

    payload = json.dumps(catalog, ensure_ascii=False, indent=2) + "\n"
    for target in args.out:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(payload, encoding="utf-8")
        print(f"wrote {target} ({len(payload):,} bytes)")

    print(f"catalogVersion={catalog['catalogVersion']} classes={catalog['modelClassCount']}")
    skipped = sorted(set(nutrition) - set(names.values()))
    print(f"모델 미포함(수동 입력 전용) {len(skipped)}종: {', '.join(skipped)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
