#Requires -Version 5.1
<#
.SYNOPSIS
  AWS dev RDS(cama)에서 PostgreSQL DDL을 docs/cama_schema.sql 로 내보냅니다.
  환경변수 CAMA_DEV_DB_PASSWORD 가 없으면 application.yml local 프로필 비밀번호를 사용합니다.
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$OutFile = Join-Path $Root 'docs\cama_schema.sql'
$PgDump = 'C:\Program Files\PostgreSQL\17\bin\pg_dump.exe'

if (-not (Test-Path $PgDump)) {
    throw "pg_dump not found at $PgDump (install PostgreSQL 17 client tools)"
}

$host = 'cama-dev.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com'
$user = 'maca'
$db = 'cama'
$pass = $env:CAMA_DEV_DB_PASSWORD
if (-not $pass) { throw 'Set CAMA_DEV_DB_PASSWORD before running this script.' }

$env:PGPASSWORD = $pass
Write-Host "Exporting schema from $host/$db ..." -ForegroundColor Cyan
& $PgDump -h $host -U $user -d $db --schema-only --no-owner --no-privileges -f $OutFile
if ($LASTEXITCODE -ne 0) { throw 'pg_dump failed' }
Write-Host "Wrote $(Split-Path $OutFile -Leaf) ($((Get-Item $OutFile).Length) bytes)" -ForegroundColor Green
