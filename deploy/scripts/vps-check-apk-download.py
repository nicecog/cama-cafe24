#!/usr/bin/env python3
import re, urllib.request, urllib.error
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {"host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1), "user": re.search(r"\*\*SSH\s*사용자\*\*\s*\|\s*`([^`]+)`", text).group(1), "password": re.search(r"\*\*SSH\s*비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)}

def fetch(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD", headers={"User-Agent": "audit"}), timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0

for url in [
    "http://210.114.18.156:8080/apk_down/app-release.apk",  # won't work - not exposed
    "https://camaplus.cafe24.com/apk_down/app-release.apk",
]:
    print(url, fetch(url))

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command("curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/apk_down/app-release.apk", timeout=30)
print("local8080", o.read().decode().strip())
c.close()
