#Requires -Version 5.1
<#
.SYNOPSIS
  AWS dev RDS(cama) public 스키마 전체 데이터를 로컬 Docker PostgreSQL(55432)로 mig 합니다.

.EXAMPLE
  cd F:\cama_pjt\cama-plus-server
  powershell -ExecutionPolicy Bypass -File .\scripts\import-from-dev-rds.ps1

  # 참조 테이블만 (로컬 account/track 유지) — 레거시
  powershell -ExecutionPolicy Bypass -File .\scripts\import-from-dev-rds.ps1 -ReferenceOnly

  $env:CAMA_DEV_DB_PASSWORD = '...'
  powershell -ExecutionPolicy Bypass -File .\scripts\import-from-dev-rds.ps1
#>
param(
    [string]$DevHost = 'cama-dev.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com',
    [string]$DevUser = 'maca',
    [string]$DevDb = 'cama',
    [string]$LocalHost = '127.0.0.1',
    [int]$LocalPort = 55432,
    [string]$LocalUser = 'cama',
    [string]$LocalDb = 'cama',
    [string]$DockerContainer = 'cama-local-postgres',
    [string]$PgBin = 'C:\Program Files\PostgreSQL\17\bin',
    [switch]$ReferenceOnly
)

$ErrorActionPreference = 'Stop'

$DevPassword = $env:CAMA_DEV_DB_PASSWORD
if (-not $DevPassword) { throw 'Set CAMA_DEV_DB_PASSWORD before running this script.' }

$PgDump = Join-Path $PgBin 'pg_dump.exe'
if (-not (Test-Path $PgDump)) { throw "pg_dump not found: $PgDump" }

$state = docker inspect -f '{{.State.Health.Status}}' $DockerContainer 2>$null
if ($state -ne 'healthy') { throw "$DockerContainer is not healthy (run docker compose -f docker-compose.local.yml up -d)" }

# ReferenceOnly: 기존 부분 mig (계정·트랙 유지)
$ReferenceTables = @(
    'care_time_type',
    'cm_hospital',
    'cm_department',
    'cm_disease',
    'cm_disease_detail',
    'cm_doctor',
    'cm_doctor_disease',
    'hp_disease',
    'hp_disease_option',
    'hp_disease_treatment',
    'cm_wellbeing_resources',
    'cm_contents',
    'cm_contents_video',
    'coaching_exercise_contents_mst',
    'coaching_question_info',
    'coaching_question_detail_info'
)

$ReferenceSequences = @(
    'care_type_seq_seq',
    'cm_hospital_seq_seq',
    'cm_department_seq_seq',
    'cm_disease_seq_seq',
    'cm_disease_detail_seq_seq',
    'cm_doctor_seq_seq',
    'cm_doctor_disease_seq_seq',
    'hp_disease_seq_seq',
    'hp_disease_option_seq_seq',
    'hp_disease_treatment_seq_seq',
    'cm_wellbeing_resources_seq',
    'cm_contents_seq_seq',
    'cm_contents_video_seq',
    'coaching_exercise_contents_mst_seq'
)

function Invoke-LocalPsql([string]$Sql) {
    docker exec -i $DockerContainer psql -U $LocalUser -d $LocalDb -v ON_ERROR_STOP=1 -c $Sql | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Local psql failed' }
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

function Invoke-LocalPsqlFile([string]$Path) {
    # Windows PowerShell pipe breaks Korean UTF-8 — copy file into container and psql -f
    $containerPath = "/tmp/cama-import-$([Guid]::NewGuid().ToString('N')).sql"
    docker cp $Path "${DockerContainer}:${containerPath}"
    if ($LASTEXITCODE -ne 0) { throw "docker cp failed: $Path" }
    docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -v ON_ERROR_STOP=1 `
        -c "SET client_encoding TO 'UTF8';" -f $containerPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Local psql file failed: $Path" }
    docker exec $DockerContainer rm -f $containerPath | Out-Null
}

function Get-SanitizedDump([string]$Path) {
    $utf8 = New-Object System.Text.UTF8Encoding $false
    $lines = [System.IO.File]::ReadAllText($Path, $utf8) -split "`r?`n"
    $filtered = $lines | Where-Object {
        $_ -notmatch '^\s*SET\s+transaction_timeout\s*=' `
            -and $_ -notmatch '^\s*\\restrict\b' `
            -and $_ -notmatch '^\s*\\unrestrict\b'
    }
    return ($filtered -join "`n")
}

function Get-LocalPublicTables() {
    $raw = docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -c `
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
    return @($raw | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Reset-AllSequences() {
    $seqs = docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -c `
        "SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' ORDER BY 1;"
    foreach ($seq in ($seqs | Where-Object { $_ })) {
        $table = $seq -replace '_seq_seq$', '' -replace '_seq$', ''
        switch ($seq) {
            'care_type_seq_seq' { $table = 'care_time_type' }
            'account_batch_schedule_seq_seq' { $table = 'account_batch_schedule' }
            'account_recent_notification_seq_seq' { $table = 'account_recent_notification' }
            'account_schedule_seq_seq' { $table = 'account_schedule' }
            'account_secure_seq_seq' { $table = 'account_secure' }
            'cm_contents_check_seq_seq' { $table = 'cm_contents_check' }
            'cm_contents_log_seq_seq' { $table = 'cm_contents_log' }
            'cm_schedule_seq_seq' { $table = 'cm_schedule' }
            'firebase_token_seq_seq' { $table = 'firebase_token' }
            'hospital_service_seq_seq' { $table = 'hospital_service' }
            'track_service_seq_seq' { $table = 'track_service' }
        }
        $col = 'seq'
        try {
            Invoke-LocalPsql "SELECT setval('$seq', COALESCE((SELECT MAX($col) FROM $table), 1), true);"
        }
        catch {
            Write-Host "  (skip sequence $seq)" -ForegroundColor DarkGray
        }
    }
}

$modeLabel = if ($ReferenceOnly) { 'reference tables only' } else { 'FULL public schema' }
$dumpFile = Join-Path $env:TEMP ("cama-dev-{0}-{1}.sql" -f ($(if ($ReferenceOnly) { 'ref' } else { 'full' })), (Get-Date -Format 'yyyyMMddHHmmss'))

Write-Host "=== dev RDS -> local mig ($modeLabel) ===" -ForegroundColor Cyan
Write-Host "Source: $DevHost/$DevDb" -ForegroundColor DarkGray
Write-Host "Target: ${LocalHost}:${LocalPort}/$LocalDb (docker $DockerContainer)" -ForegroundColor DarkGray

Write-Host "`n[1/5] pg_dump (data-only) ..." -ForegroundColor Cyan
$dumpArgs = @(
    '-h', $DevHost,
    '-U', $DevUser,
    '-d', $DevDb,
    '--data-only',
    '--no-owner',
    '--no-privileges',
    '--encoding=UTF8',
    '-f', $dumpFile
)
if ($ReferenceOnly) {
    foreach ($t in $ReferenceTables) {
        $dumpArgs += @('-t', "public.$t")
    }
}
else {
    $dumpArgs += @('--schema=public')
}
$env:PGPASSWORD = $DevPassword
& $PgDump @dumpArgs
if ($LASTEXITCODE -ne 0) { throw 'pg_dump failed' }
$sizeKb = [math]::Round((Get-Item $dumpFile).Length / 1KB, 1)
Write-Host "  dump: $dumpFile ($sizeKb KB)" -ForegroundColor Green

$tablesToTruncate = if ($ReferenceOnly) { $ReferenceTables } else { Get-LocalPublicTables }
Write-Host "`n[2/5] truncate $($tablesToTruncate.Count) table(s) ..." -ForegroundColor Cyan
$truncateList = ($tablesToTruncate[($tablesToTruncate.Count - 1)..0] -join ', ')
Invoke-LocalPsql "TRUNCATE TABLE $truncateList RESTART IDENTITY CASCADE;"

Write-Host "`n[3/5] import dev data ..." -ForegroundColor Cyan
$wrapper = Join-Path $env:TEMP ("cama-dev-import-wrapper-{0}.sql" -f (Get-Date -Format 'yyyyMMddHHmmss'))
Write-Utf8NoBom $wrapper @"
SET session_replication_role = replica;
$(Get-SanitizedDump $dumpFile)
SET session_replication_role = DEFAULT;
"@
Invoke-LocalPsqlFile $wrapper

Write-Host "`n[4/5] reset sequences ..." -ForegroundColor Cyan
if ($ReferenceOnly) {
    foreach ($seq in $ReferenceSequences) {
        $table = $seq -replace '_seq_seq$', '' -replace '_seq$', ''
        if ($table -eq 'care_type') { $table = 'care_time_type' }
        try {
            Invoke-LocalPsql "SELECT setval('$seq', COALESCE((SELECT MAX(seq) FROM $table), 1), true);"
        }
        catch {
            Write-Host "  (skip sequence $seq)" -ForegroundColor DarkGray
        }
    }
}
else {
    Reset-AllSequences
}

Write-Host "`n[5/5] row counts (local) ===" -ForegroundColor Cyan
$countTables = if ($ReferenceOnly) { $ReferenceTables } else { Get-LocalPublicTables }
$countSql = ($countTables | ForEach-Object { "SELECT '$_' AS tbl, COUNT(*)::text AS cnt FROM $_" }) -join ' UNION ALL '
docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -c $countSql

if ($ReferenceOnly) {
    Write-Host "`nDone. Preserved: account, hospital_service, track_service, sys_code_*" -ForegroundColor Green
}
else {
    Write-Host "`nDone. All public tables replaced with dev RDS data." -ForegroundColor Green
    Write-Host "Local test accounts were overwritten — use dev accounts or re-register." -ForegroundColor DarkYellow
}
Write-Host "Optional: restart local server if running." -ForegroundColor DarkGray
