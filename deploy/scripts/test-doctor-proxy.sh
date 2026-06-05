#!/bin/bash
set -euo pipefail

LOGIN_JSON='{"principal":"cama","credentials":"admincama!"}'

echo "=== 1) Login via doctor-web proxy ==="
LOGIN_RESP=$(curl -s -X POST http://127.0.0.1:8081/proxy/api/auth/doctor \
  -H 'Content-Type: application/json' \
  -d "$LOGIN_JSON")
echo "$LOGIN_RESP" | head -c 200
echo "..."

TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
echo "TOKEN length: ${#TOKEN}"

echo ""
echo "=== 2) GET /proxy/api/doctor/me via doctor-web ==="
curl -s -w "\nHTTP:%{http_code}\n" \
  http://127.0.0.1:8081/proxy/api/doctor/me \
  -H 'Accept: application/json' \
  -H "api_key: Bearer $TOKEN"

echo ""
echo "=== 3) GET /proxy/api/doctor/contents via doctor-web ==="
curl -s -w "\nHTTP:%{http_code}\n" \
  'http://127.0.0.1:8081/proxy/api/doctor/contents?page=1&searchType=title&searchText=' \
  -H 'Accept: application/json' \
  -H "api_key: Bearer $TOKEN"

echo ""
echo "=== 4) Via nginx 443 with Host header ==="
curl -sk -w "\nHTTP:%{http_code}\n" \
  'https://127.0.0.1/proxy/api/doctor/me' \
  -H 'Host: camaplus.cafe24.com' \
  -H 'Accept: application/json' \
  -H "api_key: Bearer $TOKEN"

echo ""
echo "=== 5) Via nginx 443 with Authorization header ==="
curl -sk -w "\nHTTP:%{http_code}\n" \
  'https://127.0.0.1/proxy/api/doctor/me' \
  -H 'Host: camaplus.cafe24.com' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
