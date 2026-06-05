#!/bin/bash
set -euo pipefail
mkdir -p /tmp/jar-patch/BOOT-INF/classes/static/js
cp /tmp/cama-api.js /tmp/jar-patch/BOOT-INF/classes/static/js/cama-api.js
docker run --rm \
  -v /opt/cama/jars:/jars \
  -v /tmp/jar-patch:/patch \
  eclipse-temurin:21-jdk \
  jar uf /jars/cama-doctor-web-0.0.1-SNAPSHOT.jar -C /patch BOOT-INF/classes/static/js/cama-api.js
docker restart cama-doctor-web
sleep 12
curl -s http://127.0.0.1:8081/js/cama-api.js | grep Authorization | head -2
