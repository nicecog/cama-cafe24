#!/bin/bash
set -euo pipefail
echo "=== check phone ==="
curl -s -X POST http://127.0.0.1:8080/api/account/patient/check/phone \
  -H 'Content-Type: application/json' \
  -d '{"phone":"01032984763"}'
echo
echo "=== find login-id (correct name) ==="
curl -s -X POST http://127.0.0.1:8080/api/account/patient/find/login-id \
  -H 'Content-Type: application/json' \
  -d '{"name":"최완규","phone":"01032984763"}'
echo
echo "=== find login-id (wrong name) ==="
curl -s -X POST http://127.0.0.1:8080/api/account/patient/find/login-id \
  -H 'Content-Type: application/json' \
  -d '{"name":"홍길동","phone":"01032984763"}'
echo
echo "=== check login-id ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1:8080/api/account/patient/check/login-id \
  -H 'Content-Type: application/json' \
  -d '{"loginId":"newtestid999"}'
echo "=== register validation ==="
curl -s -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1:8080/api/account/patient/register \
  -H 'Content-Type: application/json' \
  -d '{"loginId":"x"}'
