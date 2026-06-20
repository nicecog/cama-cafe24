import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[2] / "cama-back-batch"
out = Path(__file__).resolve().parents[1] / "cama-back-batch-src.zip"

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write(root / "pom.xml", "pom.xml")
    for path in (root / "src").rglob("*"):
        if path.is_file():
            arc = path.relative_to(root).as_posix()
            zf.write(path, arc)

print(f"created {out} ({out.stat().st_size} bytes)")
