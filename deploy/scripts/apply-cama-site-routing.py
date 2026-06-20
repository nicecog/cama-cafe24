#!/usr/bin/env python3
"""Replace CAMA front-end nginx blocks (legacy doctor, patient SPA, super-admin, fallback)."""
import re
import sys
from pathlib import Path

NGINX_PATH = Path("/etc/nginx/sites-enabled/cama")
if not NGINX_PATH.exists():
    NGINX_PATH = Path("/etc/nginx/sites-available/cama")

SCRIPT_DIR = Path(__file__).resolve().parent
NGINX_DIR = SCRIPT_DIR.parent / "nginx"

SNIPPETS = [
    NGINX_DIR / "cama-legacy-doctor-locations.conf",
    NGINX_DIR / "cama-patient-spa-locations.conf",
    NGINX_DIR / "cama-super-admin-locations.conf",
    NGINX_DIR / "cama-site-fallback-locations.conf",
]

if len(sys.argv) > 1:
    SNIPPETS = [Path(p) for p in sys.argv[1:]]

for snippet in SNIPPETS:
    if not snippet.is_file():
        raise SystemExit(f"snippet not found: {snippet}")

combined = "\n".join(s.read_text(encoding="utf-8").strip() for s in SNIPPETS) + "\n"
text = NGINX_PATH.read_text(encoding="utf-8")

patterns = [
    r"    # CAMA legacy doctor-web[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"    # react-app-dawplus[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"    # Mobile app (?:WebView SPA|health coaching WebView)[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"    location \^~ /assets/ \{[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"# CAMA Super Admin SPA[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"    location \^~ /legacy/ \{[\s\S]*?    location / \{[\s\S]*?\n    \}\n",
    r"    location / \{[\s\S]*?proxy_pass http://127\.0\.0\.1:8081;[\s\S]*?\n    \}\n",
]

new_text = None
for pattern in patterns:
    new_text, n = re.subn(pattern, combined, text, count=1)
    if n == 1:
        break

if not new_text or n != 1:
    raise SystemExit(f"site routing block not found/replaced in {NGINX_PATH}")

NGINX_PATH.write_text(new_text, encoding="utf-8")
print(f"updated site routing blocks in {NGINX_PATH}")
