#Requires -Version 5.1
<#
.SYNOPSIS
  로컬 cama-plus-server 기동 확인 + mobile API smoke test 실행

  1) cama-plus-server/scripts/run-local-gabia.ps1 로 서버를 먼저 실행해 두세요.
  2) 이 스크립트는 연결 가능 여부와 앱 API smoke 를 검증합니다.
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$ServerRoot = Join-Path (Split-Path $Root -Parent) 'cama-plus-server'
$BaseUrl = if ($env:SERVER_PORT) { "http://localhost:$($env:SERVER_PORT)" } else { 'http://localhost:8080' }

Write-Host "Checking server at $BaseUrl ..." -ForegroundColor Cyan
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 5
    if ($r.Content -notmatch 'cama-back') { throw 'unexpected response' }
    Write-Host "Server OK" -ForegroundColor Green
}
catch {
    Write-Host "Server not reachable. Start it first:" -ForegroundColor Red
    Write-Host "  cd $ServerRoot" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\run-local-gabia.ps1" -ForegroundColor Yellow
    exit 1
}

& "$Root\scripts\smoke-test-mobile-api.ps1" -BaseUrl $BaseUrl
