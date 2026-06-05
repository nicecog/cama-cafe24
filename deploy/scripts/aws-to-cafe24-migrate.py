#!/usr/bin/env python3
"""AWS → Cafe24 migration: S3 images, DB CDN URL rewrite, audit.

Usage:
  python deploy/scripts/aws-to-cafe24-migrate.py --audit
  python deploy/scripts/aws-to-cafe24-migrate.py --rewrite-db
  python deploy/scripts/aws-to-cafe24-migrate.py --sync-s3
  python deploy/scripts/aws-to-cafe24-migrate.py --verify
  python deploy/scripts/aws-to-cafe24-migrate.py --all

Credentials: deploy/local-aws-migrate.env (copy from .example) or env vars.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_DIR = SCRIPT_DIR.parent
ROOT = DEPLOY_DIR.parent
ENV_FILE = DEPLOY_DIR / "local-aws-migrate.env"
ACCESS_FILE = DEPLOY_DIR / "CAFE24_VPS_ACCESS.local.md"
SQL_FILE = DEPLOY_DIR / "sql" / "cafe24-rewrite-aws-urls.sql"
LEGACY_YML = ROOT.parent / "cama-plus-server" / "src" / "main" / "resources" / "application.yml"

AWS_PATTERNS = [
    "d3n20da161n8ia.cloudfront.net",
    "d2wzajvlsrz16a.cloudfront.net",
    "d3r7myc2vsc0rw.cloudfront.net",
    "amazonaws.com",
    "api.camaplus.me",
]

CAFE24_FILES_BASE = "https://camaplus.cafe24.com/files"


def load_dotenv(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def load_legacy_aws_from_yml() -> tuple[str, str]:
    if not LEGACY_YML.is_file():
        return "", ""
    text = LEGACY_YML.read_text(encoding="utf-8")
    ak = re.search(r"^\s*access-key:\s*(\S+)\s*$", text, re.M)
    sk = re.search(r"^\s*secret-key:\s*(\S+)\s*$", text, re.M)
    return (ak.group(1) if ak else "", sk.group(1) if sk else "")


def resolve_config(use_legacy: bool) -> dict[str, str]:
    cfg = load_dotenv(ENV_FILE)
    for k, v in os.environ.items():
        if k.startswith("AWS_") or k.startswith("CAMA_") or k.startswith("S3_") or k in {
            "CAFE24_FILES_BASE",
            "VPS_FILES_DIR",
        }:
            cfg.setdefault(k, v)

    if use_legacy and not cfg.get("AWS_ACCESS_KEY_ID"):
        ak, sk = load_legacy_aws_from_yml()
        if ak:
            cfg["AWS_ACCESS_KEY_ID"] = ak
            cfg["AWS_SECRET_KEY"] = sk

    cfg.setdefault("AWS_REGION", "ap-northeast-2")
    cfg.setdefault("S3_BUCKET", "cama-images")
    cfg.setdefault("CAFE24_FILES_BASE", CAFE24_FILES_BASE)
    cfg.setdefault("VPS_FILES_DIR", "/opt/cama/data/cama-files")
    return cfg


def load_ssh() -> tuple[str, str]:
    host, pw = "210.114.18.156", "admincama!"
    if ACCESS_FILE.is_file():
        text = ACCESS_FILE.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
    host = os.environ.get("CAMA_VPS_HOST", host)
    pw = os.environ.get("CAMA_VPS_SSH_PASSWORD", pw)
    return host, pw


def ssh_exec(host: str, pw: str, cmd: str, timeout: int = 600) -> tuple[str, str, int]:
    import paramiko

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    client.close()
    return out, err, code


def psql(host: str, pw: str, sql: str) -> str:
    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -t -A -v ON_ERROR_STOP=1"
    )
    out, err, code = ssh_exec(host, pw, cmd)
    if code != 0:
        raise RuntimeError(err or out or f"psql failed code={code}")
    return out.strip()


def audit_db(host: str, pw: str) -> None:
    print("=== DB audit: AWS-related URL strings ===")
    like = " OR ".join([f"col::text ILIKE '%{p}%'" for p in AWS_PATTERNS])
    sql = f"""
SELECT table_name, column_name, cnt FROM (
  SELECT c.table_name, c.column_name,
         (xpath('/row/c/text()', query_to_xml(
           format('select count(*)::int as c from %I.%I where %I::text ILIKE ''%%cloudfront%%'' OR %I::text ILIKE ''%%amazonaws%%'' OR %I::text ILIKE ''%%api.camaplus.me%%''', c.table_schema, c.table_name, c.column_name, c.column_name, c.column_name),
           false, true, '')))[1]::text::int AS cnt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.data_type IN ('character varying', 'text', 'json', 'jsonb')
) s WHERE cnt > 0
ORDER BY cnt DESC, table_name, column_name;
"""
    try:
        raw = psql(host, pw, sql)
        rows = [line.strip() for line in raw.splitlines() if line.strip()]
        if not rows:
            print("  (no AWS URL strings in any text/json column)")
        else:
            total = 0
            for line in rows:
                parts = line.split("|")
                if len(parts) >= 3:
                    table, col, cnt = parts[0], parts[1], int(parts[2])
                    print(f"  {table}.{col}: {cnt}")
                    total += cnt
            print(f"TOTAL flagged rows (all columns): {total}")
    except Exception as e:
        print(f"  full scan failed: {e}")
        checks = [
            ("cm_contents", "image"),
            ("cm_doctor", "profile_image"),
            ("account", "profile_image"),
        ]
        total = 0
        for table, col in checks:
            q = (
                f"SELECT count(*) FROM {table} WHERE {col} IS NOT NULL AND ("
                + " OR ".join([f"{col} ILIKE '%{p}%'" for p in AWS_PATTERNS])
                + ");"
            )
            try:
                raw = psql(host, pw, q)
                n = int((raw.splitlines() or ["0"])[0].strip() or "0")
                if n:
                    print(f"  {table}.{col}: {n}")
                    total += n
            except Exception as e2:
                print(f"  {table}.{col}: ERROR {e2}")
        print(f"TOTAL flagged rows (known columns): {total}")


def rewrite_db(host: str, pw: str) -> None:
    print("=== DB rewrite: CloudFront → Cafe24 /files ===")
    sql = SQL_FILE.read_text(encoding="utf-8")
    out = psql(host, pw, sql)
    print(out or "OK")
    audit_db(host, pw)


def ensure_vps_dirs(host: str, pw: str, files_dir: str) -> None:
    ssh_exec(host, pw, f"mkdir -p {files_dir} && chmod -R a+rX {files_dir} 2>/dev/null || true")


def sync_s3_local_boto3(cfg: dict[str, str], host: str, pw: str) -> None:
    try:
        import boto3
    except ImportError:
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "boto3", "-q"])
        import boto3

    import paramiko

    bucket = cfg["S3_BUCKET"]
    region = cfg["AWS_REGION"]
    files_dir = cfg["VPS_FILES_DIR"]
    ak = cfg["AWS_ACCESS_KEY_ID"]
    sk = cfg["AWS_SECRET_KEY"]

    s3 = boto3.client("s3", region_name=region, aws_access_key_id=ak, aws_secret_access_key=sk)
    paginator = s3.get_paginator("list_objects_v2")
    keys: list[tuple[str, int]] = []
    total_size = 0
    for page in paginator.paginate(Bucket=bucket):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.endswith("/"):
                continue
            size = int(obj.get("Size", 0))
            keys.append((key, size))
            total_size += size
    print(f"Objects: {len(keys)}, size: {total_size / 1024 / 1024:.1f} MB")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    sftp = client.open_sftp()
    done = skipped = 0
    for key, size in keys:
        remote = f"{files_dir}/{key}".replace("\\", "/")
        remote_dir = "/".join(remote.split("/")[:-1])
        try:
            st = sftp.stat(remote)
            if st.st_size == size:
                skipped += 1
                continue
        except OSError:
            pass
        ssh_exec(host, pw, f"mkdir -p '{remote_dir}'", timeout=30)
        with sftp.file(remote, "wb") as rf:
            s3.download_fileobj(bucket, key, rf)
        done += 1
        if done % 100 == 0:
            print(f"  uploaded {done}, skipped {skipped}...")
    sftp.close()
    client.close()
    print(f"S3 sync (local→VPS): uploaded={done}, skipped={skipped}")


def sync_s3(cfg: dict[str, str], host: str, pw: str) -> None:
    ak = cfg.get("AWS_ACCESS_KEY_ID", "")
    sk = cfg.get("AWS_SECRET_KEY", "")
    if not ak or not sk:
        print("ERROR: AWS credentials missing. Create deploy/local-aws-migrate.env", file=sys.stderr)
        raise SystemExit(1)

    bucket = cfg["S3_BUCKET"]
    region = cfg["AWS_REGION"]
    files_dir = cfg["VPS_FILES_DIR"]

    print(f"=== S3 sync s3://{bucket}/ → VPS:{files_dir} ===")
    ensure_vps_dirs(host, pw, files_dir)

    # Prefer AWS CLI on VPS (apt); fallback to local boto3 + SFTP
    cmd = (
        f"export AWS_ACCESS_KEY_ID='{ak}' AWS_SECRET_ACCESS_KEY='{sk}' AWS_DEFAULT_REGION='{region}'; "
        "if ! command -v aws >/dev/null 2>&1; then "
        "DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq awscli; "
        "fi; "
        f"aws s3 sync s3://{bucket}/ {files_dir}/ --region {region} --no-progress"
    )
    out, err, code = ssh_exec(host, pw, cmd, timeout=7200)
    print(out)
    if err.strip():
        print(err, file=sys.stderr)
    if code == 0:
        return
    print("VPS awscli sync failed — falling back to local boto3 upload...", file=sys.stderr)
    sync_s3_local_boto3(cfg, host, pw)


def verify(cfg: dict[str, str], host: str, pw: str) -> None:
    print("=== Verify sample images ===")
    sql = "SELECT image FROM cm_contents WHERE image IS NOT NULL AND image <> '' ORDER BY seq DESC LIMIT 3;"
    raw = psql(host, pw, sql)
    urls = [line.strip() for line in raw.splitlines() if line.strip().startswith("http")]
    ctx = __import__("ssl").create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = __import__("ssl").CERT_NONE
    ok = 0
    for url in urls:
        try:
            req = urllib.request.Request(url, method="GET")
            req.add_header("Range", "bytes=0-0")
            with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
                print(f"  OK {resp.status} {url[:90]}")
                ok += 1
        except Exception as e:
            print(f"  FAIL {url[:90]} -> {e}")
    print(f"GET checks OK: {ok}/{len(urls)}")

    print("=== VPS env storage check ===")
    out, err, code = ssh_exec(
        host,
        pw,
        "grep -E 'CAMA_STORAGE_TYPE|IMAGE_CDN_BASE_URL|FILE_STORAGE_PATH' /opt/cama/deploy/.env.cafe24 2>/dev/null || echo 'no .env.cafe24'",
    )
    print(out.strip() or err.strip())


def main() -> None:
    parser = argparse.ArgumentParser(description="AWS → Cafe24 full asset migration")
    parser.add_argument("--audit", action="store_true")
    parser.add_argument("--rewrite-db", action="store_true")
    parser.add_argument("--sync-s3", action="store_true")
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--use-legacy-aws-config", action="store_true", help="Read AWS keys from legacy application.yml")
    args = parser.parse_args()

    if not any([args.audit, args.rewrite_db, args.sync_s3, args.verify, args.all]):
        parser.print_help()
        raise SystemExit(1)

    cfg = resolve_config(args.use_legacy_aws_config)
    host, pw = load_ssh()
    print(f"VPS: {host}")

    if args.all or args.audit:
        audit_db(host, pw)
    if args.all or args.sync_s3:
        sync_s3(cfg, host, pw)
        legacy_bucket = cfg.get("S3_LEGACY_BUCKET", "cama-files")
        if legacy_bucket and legacy_bucket != cfg["S3_BUCKET"]:
            print(f"=== Secondary S3 bucket: {legacy_bucket} ===")
            cfg2 = {**cfg, "S3_BUCKET": legacy_bucket}
            sync_s3(cfg2, host, pw)
    if args.all or args.rewrite_db:
        rewrite_db(host, pw)
    if args.all or args.verify:
        verify(cfg, host, pw)

    print("Done.")


if __name__ == "__main__":
    main()
