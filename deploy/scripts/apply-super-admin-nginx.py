#!/usr/bin/env python3
"""Insert or replace /admin/ nginx block in sites-enabled/cama."""
import re
import sys
from pathlib import Path

NGINX_PATH = Path("/etc/nginx/sites-enabled/cama")
if not NGINX_PATH.exists():
    NGINX_PATH = Path("/etc/nginx/sites-available/cama")

SCRIPT_DIR = Path(__file__).resolve().parent
SNIPPET = SCRIPT_DIR.parent / "nginx" / "cama-super-admin-locations.conf"
if len(sys.argv) > 1:
    SNIPPET = Path(sys.argv[1])

if not SNIPPET.is_file():
    raise SystemExit(f"snippet not found: {SNIPPET}")

snippet_text = SNIPPET.read_text(encoding="utf-8").strip()
text = NGINX_PATH.read_text(encoding="utf-8")

if "location /admin/" in text:
    new_text, n = re.subn(
        r"    # CAMA Super Admin SPA[\s\S]*?location /admin/ \{[\s\S]*?\n    \}\n",
        snippet_text + "\n\n",
        text,
        count=1,
    )
    if n != 1:
        new_text, n = re.subn(
            r"    location = /admin \{[\s\S]*?    location /admin/ \{[\s\S]*?\n    \}\n",
            snippet_text + "\n\n",
            text,
            count=1,
        )
else:
    marker = "    location / {"
    if marker not in text:
        raise SystemExit(f"anchor not found in {NGINX_PATH}")
    new_text = text.replace(
        marker,
        snippet_text + "\n\n" + marker,
        1,
    )
    n = 1

if n != 1:
    raise SystemExit(f"super-admin nginx block not applied in {NGINX_PATH}")

NGINX_PATH.write_text(new_text, encoding="utf-8")
print(f"updated super-admin nginx block in {NGINX_PATH}")
