#Requires -Version 5.1
<#
.SYNOPSIS
  로컬 PostgreSQL에 엔티티-스키마 drift 패치 + (선택) 참조 시드를 적용합니다.
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$PatchFile = Join-Path $Root 'docs\cama_local_schema_patch.sql'
$SeedFile = Join-Path $Root 'docs\cama_local_seed.sql'
$AdminSeedFile = Join-Path $Root 'docs\cama_local_admin_seed.sql'

function Invoke-LocalPsqlFile {
    param([string]$Path, [string]$Label)
    if (-not (Test-Path $Path)) { throw "Missing: $Path" }
    Write-Host "Applying $Label ..." -ForegroundColor Cyan
    $remote = "/tmp/$(Split-Path $Path -Leaf)"
    docker cp $Path "cama-local-postgres:${remote}"
    docker exec cama-local-postgres sh -c "sed -i '/^\\\\restrict/d; /^SET transaction_timeout/d' ${remote} 2>/dev/null || true"
    docker exec cama-local-postgres psql -U cama -d cama -v ON_ERROR_STOP=1 -f $remote
    if ($LASTEXITCODE -ne 0) { throw "$Label apply failed" }
}

$state = docker inspect -f '{{.State.Health.Status}}' cama-local-postgres 2>$null
if ($state -ne 'healthy') { throw 'cama-local-postgres not healthy' }

Invoke-LocalPsqlFile -Path $PatchFile -Label 'schema drift patch'
foreach ($pair in @(
        @{ Path = $SeedFile; Label = 'reference seed' },
        @{ Path = $AdminSeedFile; Label = 'local admin seed' },
        @{ Path = (Join-Path $Root 'docs\cama_local_hospital_seed.sql'); Label = 'local hospital seed' }
    )) {
    if (-not (Test-Path $pair.Path)) { continue }
    try {
        Invoke-LocalPsqlFile -Path $pair.Path -Label $pair.Label
    }
    catch {
        Write-Host "  (skip $($pair.Label): already applied or duplicate data)" -ForegroundColor DarkGray
    }
}

Write-Host 'Schema patch done.' -ForegroundColor Green
