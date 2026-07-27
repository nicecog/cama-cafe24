#!/usr/bin/env python3
"""
AI Hub 음식 이미지 JSON 라벨 → Ultralytics YOLO txt 변환 유틸.

지원 스키마(대략):
  - 71564: data.image_info + data.2d_annotation (픽셀 xywh)
  - 71392: Name + Point(x,y) + W/H (정규화 중점·크기일 수 있음)
  - auto: 키 존재 여부로 추정

사용 예:
  python convert_aihub_to_yolo.py build-classes --raw-dir /data/raw --schema 71564 --top-k 120 --out classes.json
  python convert_aihub_to_yolo.py convert --raw-dir /data/raw --schema 71564 --classes classes.json --out datasets/food_mvp
  python convert_aihub_to_yolo.py write-yaml --out datasets/food_mvp --classes classes.json
"""

from __future__ import annotations

import argparse
import json
import random
import shutil
from collections import Counter
from pathlib import Path
from typing import Any


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"}


def clip01(v: float) -> float:
    return max(0.0, min(1.0, float(v)))


def xywh_pixel_to_yolo(
    x: float, y: float, w: float, h: float, img_w: float, img_h: float
) -> tuple[float, float, float, float]:
    cx = (x + w / 2.0) / img_w
    cy = (y + h / 2.0) / img_h
    return clip01(cx), clip01(cy), clip01(w / img_w), clip01(h / img_h)


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def find_image_for_json(json_path: Path, image_root: Path | None) -> Path | None:
    stem = json_path.stem
    search_roots = [json_path.parent]
    if image_root is not None:
        search_roots.insert(0, image_root)

    for root in search_roots:
        for ext in IMAGE_EXTS:
            cand = root / f"{stem}{ext}"
            if cand.is_file():
                return cand
        # 같은 폴더 외 재귀(비용 있음) — 파일명 일치만
        matches = list(root.rglob(f"{stem}.*"))
        for m in matches:
            if m.suffix in IMAGE_EXTS and m.is_file():
                return m
    return None


def detect_schema(obj: dict[str, Any]) -> str:
    if "data" in obj and isinstance(obj["data"], dict):
        data = obj["data"]
        if "2d_annotation" in data or "image_info" in data:
            return "71564"
    if "Name" in obj or "Point(x,y)" in obj or "Code Name" in obj:
        return "71392"
    # 리스트 래핑
    if isinstance(obj.get("images"), list):
        return "coco-like"
    return "unknown"


def iter_annotations_71564(obj: dict[str, Any]) -> list[dict[str, Any]]:
    data = obj.get("data", obj)
    info = data.get("image_info") or {}
    ann = data.get("2d_annotation")
    if ann is None:
        return []
    if isinstance(ann, dict):
        anns = [ann]
    elif isinstance(ann, list):
        anns = ann
    else:
        return []

    # 클래스명 후보
    food_type = data.get("food_type") or {}
    class_name = (
        food_type.get("fc")
        or info.get("food_name")
        or info.get("name")
        or data.get("food_name")
        or Path(str(info.get("file_name", "unknown"))).stem
    )
    out = []
    for a in anns:
        out.append(
            {
                "class_name": str(class_name),
                "x": float(a["x"]),
                "y": float(a["y"]),
                "w": float(a["width"]),
                "h": float(a["height"]),
                "img_w": float(info.get("width") or 0),
                "img_h": float(info.get("height") or 0),
                "normalized": False,
            }
        )
    return out


def parse_point(point: str | list[float] | tuple[float, float]) -> tuple[float, float]:
    if isinstance(point, (list, tuple)) and len(point) >= 2:
        return float(point[0]), float(point[1])
    s = str(point).strip().replace("(", "").replace(")", "")
    parts = [p.strip() for p in s.replace(",", " ").split() if p.strip()]
    if len(parts) < 2:
        raise ValueError(f"bad Point: {point}")
    return float(parts[0]), float(parts[1])


def iter_annotations_71392(obj: dict[str, Any]) -> list[dict[str, Any]]:
    # 단건 또는 리스트
    items = obj if isinstance(obj, list) else [obj]
    out = []
    for it in items:
        if not isinstance(it, dict):
            continue
        name = str(it.get("Name") or it.get("name") or "unknown")
        cx, cy = parse_point(it.get("Point(x,y)") or it.get("Point") or "0.5,0.5")
        w = float(it.get("W") or it.get("w") or 0)
        h = float(it.get("H") or it.get("h") or 0)
        out.append(
            {
                "class_name": name,
                "x": cx,  # already center if normalized schema
                "y": cy,
                "w": w,
                "h": h,
                "img_w": 1.0,
                "img_h": 1.0,
                "normalized": True,
            }
        )
    return out


def extract_boxes(obj: dict[str, Any], schema: str) -> list[dict[str, Any]]:
    if schema == "auto":
        schema = detect_schema(obj)
    if schema == "71564":
        return iter_annotations_71564(obj)
    if schema == "71392":
        return iter_annotations_71392(obj)
    raise ValueError(f"unsupported schema: {schema} (detected={detect_schema(obj)})")


def collect_json_files(raw_dir: Path) -> list[Path]:
    return sorted(p for p in raw_dir.rglob("*.json") if p.is_file())


def cmd_build_classes(args: argparse.Namespace) -> None:
    raw_dir = Path(args.raw_dir)
    counter: Counter[str] = Counter()
    for jp in collect_json_files(raw_dir):
        try:
            obj = load_json(jp)
            boxes = extract_boxes(obj if isinstance(obj, dict) else {"_": obj}, args.schema)
            for b in boxes:
                counter[b["class_name"]] += 1
        except Exception as e:  # noqa: BLE001
            print(f"[skip] {jp}: {e}")

    most = counter.most_common(args.top_k)
    classes = {name: idx for idx, (name, _) in enumerate(most)}
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema": args.schema,
        "top_k": args.top_k,
        "classes": classes,
        "counts": {name: count for name, count in most},
    }
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out} ({len(classes)} classes, from {sum(counter.values())} boxes)")


def cmd_convert(args: argparse.Namespace) -> None:
    raw_dir = Path(args.raw_dir)
    out_dir = Path(args.out)
    image_root = Path(args.image_root) if args.image_root else None
    class_payload = load_json(Path(args.classes))
    class_map: dict[str, int] = class_payload["classes"]

    pairs: list[tuple[Path, Path, list[str]]] = []  # img, label_lines later

    for jp in collect_json_files(raw_dir):
        try:
            obj = load_json(jp)
            if isinstance(obj, list):
                boxes = iter_annotations_71392(obj)  # type: ignore[arg-type]
            elif isinstance(obj, dict):
                boxes = extract_boxes(obj, args.schema)
            else:
                raise ValueError(f"unexpected json root type: {type(obj)}")
        except Exception as e:  # noqa: BLE001
            print(f"[skip json] {jp}: {e}")
            continue

        img = find_image_for_json(jp, image_root)
        if img is None:
            print(f"[skip no-image] {jp}")
            continue

        lines: list[str] = []
        for b in boxes:
            cid = class_map.get(b["class_name"])
            if cid is None:
                continue  # MVP top-k 밖 클래스는 스킵
            if b["normalized"]:
                cx, cy, w, h = (
                    clip01(b["x"]),
                    clip01(b["y"]),
                    clip01(b["w"]),
                    clip01(b["h"]),
                )
            else:
                img_w, img_h = b["img_w"], b["img_h"]
                if img_w <= 0 or img_h <= 0:
                    # PIL 없이 스킵 — 필요시 pillow로 보강
                    print(f"[skip bad size] {jp}")
                    continue
                cx, cy, w, h = xywh_pixel_to_yolo(b["x"], b["y"], b["w"], b["h"], img_w, img_h)
            if w <= 0 or h <= 0:
                continue
            lines.append(f"{cid} {cx:.6f} {cy:.6f} {w:.6f} {h:.6f}")

        if not lines and args.skip_empty:
            continue
        pairs.append((img, jp, lines))

    random.Random(args.seed).shuffle(pairs)
    n_val = max(1, int(len(pairs) * args.val_ratio)) if pairs else 0
    val_set = set(range(n_val))

    for split in ("train", "val"):
        (out_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (out_dir / "labels" / split).mkdir(parents=True, exist_ok=True)

    for i, (img, _jp, lines) in enumerate(pairs):
        split = "val" if i in val_set else "train"
        dst_img = out_dir / "images" / split / img.name
        dst_lbl = out_dir / "labels" / split / f"{img.stem}.txt"
        if args.copy_images:
            shutil.copy2(img, dst_img)
        else:
            if dst_img.exists() or dst_img.is_symlink():
                dst_img.unlink()
            dst_img.symlink_to(img.resolve())
        dst_lbl.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")

    print(f"converted {len(pairs)} images → {out_dir} (val≈{n_val})")


def cmd_write_yaml(args: argparse.Namespace) -> None:
    out_dir = Path(args.out).resolve()
    class_payload = load_json(Path(args.classes))
    classes: dict[str, int] = class_payload["classes"]
    # id -> name
    id_to_name = {idx: name for name, idx in classes.items()}
    names_block = "\n".join(f"  {i}: {id_to_name[i]}" for i in sorted(id_to_name))
    yaml_text = f"""# Auto-generated for Ultralytics YOLO26n / YOLOv8n
path: {out_dir}
train: images/train
val: images/val
names:
{names_block}
"""
    yaml_path = out_dir / "data.yaml"
    yaml_path.write_text(yaml_text, encoding="utf-8")
    print(f"wrote {yaml_path}")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="AI Hub JSON → YOLO txt")
    sub = p.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("build-classes", help="빈도 상위 클래스로 classes.json 생성")
    b.add_argument("--raw-dir", required=True)
    b.add_argument("--schema", default="auto", choices=["auto", "71564", "71392"])
    b.add_argument("--top-k", type=int, default=120)
    b.add_argument("--out", required=True)
    b.set_defaults(func=cmd_build_classes)

    c = sub.add_parser("convert", help="images/labels train·val 생성")
    c.add_argument("--raw-dir", required=True)
    c.add_argument("--schema", default="auto", choices=["auto", "71564", "71392"])
    c.add_argument("--classes", required=True)
    c.add_argument("--out", required=True)
    c.add_argument("--image-root", default=None)
    c.add_argument("--val-ratio", type=float, default=0.1)
    c.add_argument("--seed", type=int, default=42)
    c.add_argument("--copy-images", action="store_true")
    c.add_argument("--skip-empty", action="store_true", default=True)
    c.set_defaults(func=cmd_convert)

    y = sub.add_parser("write-yaml", help="data.yaml 생성")
    y.add_argument("--out", required=True)
    y.add_argument("--classes", required=True)
    y.set_defaults(func=cmd_write_yaml)

    return p


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
