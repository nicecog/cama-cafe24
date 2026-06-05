#Requires -Version 5.1
<#
.SYNOPSIS
  로컬 PostgreSQL(:55432)에 cama_doctor DB가 없으면 생성합니다.
#>
param(
    [string]$ContainerName = 'cama-cafe24-postgres',
    [string]$FallbackContainer = 'cama-local-postgres',
    [string]$DbUser = 'cama',
    [string]$DbName = 'cama_doctor'
)

$ErrorActionPreference = 'Stop'

function Get-RunningPostgresContainer([string[]]$Names) {
    foreach ($n in $Names) {
        $found = docker ps -a --filter "name=^/${n}$" --format '{{.Names}}' 2>$null
        if ($found -eq $n) { return $n }
    }
    return $null
}

$container = Get-RunningPostgresContainer @($ContainerName, $FallbackContainer)
if (-not $container) {
    throw "Postgres container not found ($ContainerName / $FallbackContainer). Start docker compose or cama-local-postgres on :55432."
}

$exists = docker exec $container psql -U $DbUser -d cama -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName'" 2>$null
if ($exists -match '1') {
    Write-Host "Database '$DbName' already exists on $container." -ForegroundColor Green
    exit 0
}

docker exec $container psql -U $DbUser -d cama -c "CREATE DATABASE $DbName;"
Write-Host "Created database '$DbName' on $container." -ForegroundColor Green
