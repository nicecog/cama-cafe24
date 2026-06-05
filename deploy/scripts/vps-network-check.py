#!/usr/bin/env python3
import subprocess

print("=== port 8080 listener ===")
subprocess.run("ss -tlnp | grep 8080 || netstat -tlnp | grep 8080", shell=True)

print("\n=== grep find in nginx ===")
subprocess.run("grep -ri find /etc/nginx 2>/dev/null | head -20", shell=True)

print("\n=== docker port ===")
subprocess.run("docker port cama-plus-server", shell=True)
