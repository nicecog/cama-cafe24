#!/usr/bin/env python3
"""Replace patient WebView SPA nginx block in sites-enabled/cama (CloudFront → react-app dist)."""
import re
import sys
from pathlib import Path

NGINX_PATH = Path("/etc/nginx/sites-enabled/cama")
if not NGINX_PATH.exists():
    NGINX_PATH = Path("/etc/nginx/sites-available/cama")

SCRIPT_DIR = Path(__file__).resolve().parent
SNIPPET = SCRIPT_DIR.parent / "nginx" / "cama-patient-spa-locations.conf"
if len(sys.argv) > 1:
    SNIPPET = Path(sys.argv[1])

if not SNIPPET.is_file():
    raise SystemExit(f"snippet not found: {SNIPPET}")

snippet_text = SNIPPET.read_text(encoding="utf-8")
text = NGINX_PATH.read_text(encoding="utf-8")

patterns = [
    r"    # react-app-dawplus[\s\S]*?    location / \{",
    r"    # Mobile app (?:WebView SPA|health coaching WebView)[\s\S]*?    location / \{",
    r"    location \^~ /assets/ \{[\s\S]*?    location / \{",
    r"    location ~ \^/\(webview[\s\S]*?    location / \{",
    r"    location \^~ /webview/ \{[\s\S]*?    location / \{",
]
replacement = snippet_text + "\n    location / {"
new_text = None
for pattern in patterns:
    new_text, n = re.subn(pattern, replacement, text, count=1)
    if n == 1:
        break

if not new_text or n != 1:
    raise SystemExit(f"patient SPA block not found/replaced in {NGINX_PATH}")

NGINX_PATH.write_text(new_text, encoding="utf-8")
print(f"updated patient SPA nginx block in {NGINX_PATH}")
