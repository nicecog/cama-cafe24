#Requires -Version 5.1
<#
.SYNOPSIS
  Docker PostgreSQL에 DDL(cama_schema.sql) + 참조 시드 + 로컬 관리자 계정을 적용합니다.
#>
param(
    [switch]$RecreateVolume,
    [switch]$SkipSchema
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$SchemaFile = Join-Path $Root 'docs\cama_schema.sql'
$SeedFile = Join-Path $Root 'docs\cama_local_seed.sql'
$AdminSeedFile = Join-Path $Root 'docs\cama_local_admin_seed.sql'
$ComposeFile = Join-Path $Root 'docker-compose.local.yml'

if (-not (Test-Path $SchemaFile)) {
    throw "Schema file missing: $SchemaFile (run scripts/export-cama-schema.ps1 first)"
}

if ($RecreateVolume) {
    Write-Host 'Recreating PostgreSQL volume (PG 15)...' -ForegroundColor Yellow
    docker compose -f $ComposeFile down -v | Out-Null
}

Write-Host 'Starting PostgreSQL container...' -ForegroundColor Cyan
docker compose -f $ComposeFile up -d | Out-Null

$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    $state = docker inspect -f '{{.State.Health.Status}}' cama-local-postgres 2>$null
    if ($state -eq 'healthy') { $ready = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $ready) { throw 'PostgreSQL container not healthy' }

function Invoke-LocalPsqlFile {
    param(
        [string]$Path,
        [string]$Label,
        [switch]$Skip
    )
    if ($Skip) {
        Write-Host "Skipping $Label" -ForegroundColor DarkGray
        return
    }
    if (-not (Test-Path $Path)) { return }
    Write-Host "Applying $Label ..." -ForegroundColor Cyan
    $remote = "/tmp/$(Split-Path $Path -Leaf)"
    docker cp $Path "cama-local-postgres:${remote}"
    docker exec cama-local-postgres sh -c "sed -i '/^\\\\restrict/d; /^SET transaction_timeout/d' ${remote}"
    docker exec cama-local-postgres psql -U cama -d cama -v ON_ERROR_STOP=1 -f $remote
    if ($LASTEXITCODE -ne 0) { throw "$Label apply failed" }
}

Invoke-LocalPsqlFile -Path $SchemaFile -Label 'schema (DDL)' -Skip:($SkipSchema -and -not $RecreateVolume)
Invoke-LocalPsqlFile -Path $SeedFile -Label 'reference seed'
Invoke-LocalPsqlFile -Path $AdminSeedFile -Label 'local admin seed'

$tableCount = (docker exec cama-local-postgres psql -U cama -d cama -t -c `
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';").Trim()
Write-Host "Done. public tables: $tableCount" -ForegroundColor Green
