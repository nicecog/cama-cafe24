#!/usr/bin/env python3
import ssl
import urllib.request

ctx = ssl._create_unverified_context()
host = "camaplus.cafe24.com"

def fetch(path):
    url = f"https://{host}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "CamaTest"})
    # force local nginx
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    # use curl via subprocess for resolve - simpler on VPS:
    import subprocess
    out = subprocess.check_output(
        [
            "curl", "-sS", "-k", "--resolve", f"{host}:443:127.0.0.1",
            f"https://{host}{path}",
        ],
        text=True,
    )
    return out

for path in [
    "/webview/coaching/C23IFZ39UWLD4",
    "/assets/index-D4nNh9Ug.js",
]:
    import subprocess
    code = subprocess.check_output(
        [
            "curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}",
            "-k", "--resolve", f"{host}:443:127.0.0.1",
            f"https://{host}{path}",
        ],
        text=True,
    )
    print(path, "status", code)

html = fetch("/webview/coaching/C23IFZ39UWLD4")
print("html head:", html[:150].replace("\n", " "))
print("inject script present:", "camaplus.cafe24.com" in html and "XMLHttpRequest" in html)
js = fetch("/assets/index-D4nNh9Ug.js")
print("api.camaplus.me in js:", js.count("api.camaplus.me"))
print("camaplus.cafe24.com in js:", js.count("camaplus.cafe24.com"))
i = js.find("baseURL")
print("baseURL snippet:", js[i : i + 80] if i >= 0 else "none")

# public URL (through Cafe24 domain DNS)
import subprocess
code = subprocess.check_output(
    ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", "https://camaplus.cafe24.com/webview/coaching/C23IFZ39UWLD4"],
    text=True,
)
print("public coaching status:", code)
