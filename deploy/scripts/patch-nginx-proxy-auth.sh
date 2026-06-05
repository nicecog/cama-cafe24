#!/bin/bash
set -euo pipefail
CONF=/etc/nginx/sites-enabled/cama
python3 <<'PY'
from pathlib import Path
p = Path("/etc/nginx/sites-enabled/cama")
text = p.read_text()
old = "        proxy_set_header api_key $http_api_key;"
new = """        proxy_set_header api_key $proxy_api_key;
        proxy_set_header Authorization $http_authorization;"""
if old not in text:
    raise SystemExit("expected line not found")
p.write_text(text.replace(old, new, 1))
print("patched", p)
PY
nginx -t
systemctl reload nginx
grep -A10 'location /proxy' "$CONF"
