#!/usr/bin/env python3
"""Rewrite data.yaml path after migrating dataset to a new drive."""
from pathlib import Path
import re
import sys

out = Path(sys.argv[1]).resolve()
yaml_path = out / "data.yaml"
text = yaml_path.read_text(encoding="utf-8")
text2 = re.sub(r"(?m)^path:\s*.*$", f"path: {out.as_posix()}", text)
yaml_path.write_text(text2, encoding="utf-8")
print(f"updated {yaml_path}")
print(text2[:300])
