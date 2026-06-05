#!/usr/bin/env python3
import json
import urllib.request

try:
    with urllib.request.urlopen("http://127.0.0.1:8080/v3/api-docs") as resp:
        doc = json.load(resp)
except Exception as e:
    print("openapi error:", e)
    raise SystemExit(1)

paths = sorted(doc.get("paths", {}).keys())
patient = [p for p in paths if "patient" in p]
find_paths = [p for p in paths if "find" in p]
print("=== patient paths ===")
for p in patient:
    print(p)
print("=== find paths ===")
for p in find_paths:
    print(p)
