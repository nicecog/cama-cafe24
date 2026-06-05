#!/usr/bin/env python3
import zipfile

jar = "/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar"
needles = [b"/find/", b"find/login-id", b"Authentication error"]
with zipfile.ZipFile(jar) as z:
    for name in z.namelist():
        if not name.endswith(".class"):
            continue
        data = z.read(name)
        hits = [n.decode("ascii", "ignore") for n in needles if n in data]
        if hits and "PatientAccount" in name or (hits and "Security" in name) or (hits and "Filter" in name):
            print(name, hits)

print("--- scan for /find/ in any class ---")
with zipfile.ZipFile(jar) as z:
    for name in z.namelist():
        if not name.endswith(".class"):
            continue
        data = z.read(name)
        if b"/find/" in data and "springframework" not in name.lower():
            print(name)
