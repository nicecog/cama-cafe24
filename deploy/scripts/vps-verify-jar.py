#!/usr/bin/env python3
import json
import zipfile
import urllib.request

jar = "/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar"
with zipfile.ZipFile(jar) as z:
    ctrl = z.read(
        "BOOT-INF/classes/com/cama/back/controller/account/PatientAccountRestController.class"
    ).decode("latin1", "ignore")
    sec = z.read("BOOT-INF/classes/com/cama/back/config/SecurityConfig.class").decode(
        "latin1", "ignore"
    )
print("controller recover/login-id:", "recover/login-id" in ctrl)
print("security recover/**:", "recover/**" in sec)
print("security patientRecoverSecurityFilterChain:", "patientRecoverSecurityFilterChain" in sec)

with urllib.request.urlopen("http://127.0.0.1:8080/v3/api-docs") as resp:
    doc = json.load(resp)
paths = [p for p in doc.get("paths", {}) if "recover" in p or "find" in p]
print("openapi paths:", paths)
