#Requires -Version 5.1
<#
.SYNOPSIS
  로컬 PC를 Gabia 서버(JDK 17)와 맞춰 cama-plus-server 개발 환경을 준비합니다.
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent

function Find-Jdk17 {
    $candidates = @(
        'C:\Program Files\Microsoft\jdk-17*',
        'C:\Program Files\Eclipse Adoptium\jdk-17*',
        'C:\Program Files\Java\jdk-17*'
    )
    foreach ($pattern in $candidates) {
        $hit = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            Select-Object -First 1
        if ($hit) { return $hit.FullName }
    }
    return $null
}

Write-Host '=== CAMA local Gabia-like setup ===' -ForegroundColor Cyan

$jdk17 = Find-Jdk17
if (-not $jdk17) {
    Write-Host 'JDK 17 not found. Install: winget install Microsoft.OpenJDK.17' -ForegroundColor Red
    exit 1
}
Write-Host "JDK 17: $jdk17" -ForegroundColor Green
$env:JAVA_HOME = $jdk17
$env:Path = "$jdk17\bin;" + (($env:Path -split ';' | Where-Object { $_ -notmatch 'Java\\jdk-' }) -join ';')

& "$jdk17\bin\java.exe" -version

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host 'Docker not found. Install Docker Desktop for PostgreSQL.' -ForegroundColor Red
    exit 1
}

Push-Location $Root
try {
    Write-Host 'Starting PostgreSQL 11 (docker compose)...' -ForegroundColor Cyan
    docker compose -f docker-compose.local.yml up -d
    docker compose -f docker-compose.local.yml ps

    $dataDir = Join-Path $Root 'data\cama-files'
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
    Write-Host "File storage: $dataDir" -ForegroundColor Green

    Write-Host 'Building with Maven (JDK 17)...' -ForegroundColor Cyan
    & mvn -q clean package -DskipTests
    if ($LASTEXITCODE -ne 0) { throw 'Maven build failed' }

    Write-Host 'Running unit/context tests...' -ForegroundColor Cyan
    & mvn -q test
    if ($LASTEXITCODE -ne 0) { throw 'Maven test failed' }

    Write-Host 'Setup complete.' -ForegroundColor Green
    Write-Host 'Next: .\scripts\run-local-gabia.ps1' -ForegroundColor Yellow
}
finally {
    Pop-Location
}
