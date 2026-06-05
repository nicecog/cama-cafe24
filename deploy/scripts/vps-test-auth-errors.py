#!/usr/bin/env python3
import json
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"


def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


cases = [
    ("wrong password", {"principal": "happycog", "credentials": "OldTemp123!"}),
    ("unknown id", {"principal": "nosuchid9999", "credentials": "Test1234!"}),
    ("old id", {"principal": "C23IFZ39UWLD4", "credentials": "Cama2417!"}),
]

for label, body in cases:
    body = {**body, "firebase": {"token": "t", "platform": "ANDROID", "device": "t"}}
    code, resp = post("/api/auth", body)
    print(label, code, resp.get("error", {}).get("message"))
