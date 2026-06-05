#!/bin/bash
set -e

echo "=== DB query ==="
docker exec cama-cafe24-postgres psql -U cama -d cama -c \
  "SELECT seq, login_id, name, phone, sign_type, is_enabled, is_dropped, created_at FROM account WHERE REPLACE(REPLACE(phone, '-', ''), ' ', '') = '01032984763' ORDER BY seq;"

echo ""
echo "=== check/phone ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST "http://127.0.0.1:8080/api/account/patient/check/phone" \
  -H "Content-Type: application/json" \
  -d '{"phone":"01032984763"}'

echo ""
echo "=== find/login-id (최완규) ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST "http://127.0.0.1:8080/api/account/patient/find/login-id" \
  -H "Content-Type: application/json" \
  -d '{"name":"최완규","phone":"01032984763"}'

echo ""
echo "=== find/login-id (wrong name) ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST "http://127.0.0.1:8080/api/account/patient/find/login-id" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","phone":"01032984763"}'

echo ""
echo "=== legacy find/id ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST "http://127.0.0.1:8080/api/account/find/id" \
  -H "Content-Type: application/json" \
  -d '{"name":"최완규","phone":"01032984763"}'
