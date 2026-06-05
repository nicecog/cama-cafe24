#!/bin/bash
set -euo pipefail
TOKEN=$(curl -s -X POST http://127.0.0.1:8081/proxy/api/auth/doctor \
  -H 'Content-Type: application/json' \
  -d '{"principal":"cama","credentials":"admincama!"}' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["response"]["apiToken"])')

echo "=== public api_key ==="
curl -sk -w "\nHTTP:%{http_code}\n" \
  'https://camaplus.cafe24.com/proxy/api/doctor/me' \
  -H 'Accept: application/json' \
  -H "api_key: Bearer $TOKEN"

echo "=== public Authorization ==="
curl -sk -w "\nHTTP:%{http_code}\n" \
  'https://camaplus.cafe24.com/proxy/api/doctor/me' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
