import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[2] / "cama-doctor-web"
out = Path(__file__).resolve().parents[1] / "cama-doctor-web-src.zip"

include_roots = [
    root / "build.gradle",
    root / "settings.gradle",
    root / "gradle",
    root / "src",
]

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    for base in include_roots:
        if base.is_file():
            zf.write(base, base.name)
            continue
        for path in base.rglob("*"):
            if path.is_file():
                arc = path.relative_to(root).as_posix()
                zf.write(path, arc)

print(f"created {out} ({out.stat().st_size} bytes)")
