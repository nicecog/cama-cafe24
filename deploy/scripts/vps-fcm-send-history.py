#!/usr/bin/env python3
"""FCM send history and tokens for happycog."""
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}
remote = r"""
echo "=== Admin FCM logs (all time grep) ==="
docker logs cama-plus-server 2>&1 | grep -i "Admin FCM send" | tail -20

echo "=== FCM send failed/success ADMIN_001 ==="
docker logs cama-plus-server 2>&1 | grep -iE "ADMIN_001|Admin FCM" | tail -30

PG=$(docker ps --format '{{.Names}}' | grep -i postgres | head -1)
echo "=== all tokens account 121 ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT seq, is_enabled, length(token) len, left(token,12) prefix, updated_at
FROM firebase_token WHERE account_seq=121 ORDER BY updated_at DESC;"

echo "=== tokens like eFVa ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT account_seq, is_enabled, left(token,16) FROM firebase_token WHERE token LIKE 'eFVa%' LIMIT 5;"

echo "=== firebase key project ==="
python3 -c "import json; d=json.load(open('/opt/cama/secrets/firebase-adminsdk.json')); print(d.get('project_id'), d.get('client_email','')[:50])"
"""
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command(remote, timeout=90)
print(o.read().decode())
c.close()
