#!/usr/bin/env python3
"""Merge AI Hub split zip parts and extract to raw directory.

Usage (PowerShell):
  .\.venv\Scripts\python.exe scripts\food-calorie\prepare_aihub_download.py `
    --dataset 71564 `
    --downloads-dir data\aihub\downloads\71564 `
    --raw-dir data\aihub\raw\71564
"""

from __future__ import annotations

import argparse
import re
import zipfile
from pathlib import Path


PART_RE = re.compile(r"\.part(\d+)$", re.IGNORECASE)


def find_part_files(downloads_dir: Path) -> list[Path]:
    parts = [p for p in downloads_dir.rglob("*") if p.is_file() and PART_RE.search(p.name)]
    if parts:
        return sorted(parts, key=lambda p: int(PART_RE.search(p.name).group(1)))
    zips = sorted(downloads_dir.glob("*.zip"))
    return zips


def merge_parts(parts: list[Path], out_zip: Path) -> None:
    out_zip.parent.mkdir(parents=True, exist_ok=True)
    with out_zip.open("wb") as out:
        for part in parts:
            print(f"append {part}")
            with part.open("rb") as src:
                while chunk := src.read(8 * 1024 * 1024):
                    out.write(chunk)
    print(f"merged -> {out_zip} ({out_zip.stat().st_size:,} bytes)")


def extract_zip(zip_path: Path, raw_dir: Path) -> None:
    raw_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(raw_dir)
    print(f"extracted -> {raw_dir}")


def count_media(raw_dir: Path) -> dict[str, int]:
    exts = {".jpg", ".jpeg", ".png", ".json"}
    counts: dict[str, int] = {}
    for p in raw_dir.rglob("*"):
        if p.is_file() and p.suffix.lower() in exts:
            counts[p.suffix.lower()] = counts.get(p.suffix.lower(), 0) + 1
    return counts


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare AI Hub dataset from downloads")
    parser.add_argument("--dataset", default="71564", help="Dataset id, e.g. 71564")
    parser.add_argument("--downloads-dir", required=True, help="Folder with .zip.part* files")
    parser.add_argument("--raw-dir", required=True, help="Extraction target")
    parser.add_argument("--merged-name", default=None, help="Merged zip filename")
    parser.add_argument("--skip-merge", action="store_true")
    parser.add_argument("--skip-extract", action="store_true")
    args = parser.parse_args()

    downloads_dir = Path(args.downloads_dir)
    raw_dir = Path(args.raw_dir)
    if not downloads_dir.is_dir():
        raise SystemExit(f"downloads dir not found: {downloads_dir}")

    merged_name = args.merged_name or f"{args.dataset}.zip"
    merged_zip = downloads_dir / merged_name

    if not args.skip_merge:
        parts = find_part_files(downloads_dir)
        if not parts:
            raise SystemExit(f"No .zip.part* or .zip files under {downloads_dir}")
        if len(parts) == 1 and parts[0].suffix.lower() == ".zip":
            merged_zip = parts[0]
            print(f"use existing zip: {merged_zip}")
        else:
            merge_parts(parts, merged_zip)

    if not args.skip_extract:
        if not merged_zip.is_file() or merged_zip.stat().st_size == 0:
            raise SystemExit(f"merged zip missing or empty: {merged_zip}")
        extract_zip(merged_zip, raw_dir)

    if raw_dir.is_dir():
        counts = count_media(raw_dir)
        print("media counts:", counts)
        if counts.get(".json", 0) == 0:
            print("WARN: no JSON files found yet")


if __name__ == "__main__":
    main()
