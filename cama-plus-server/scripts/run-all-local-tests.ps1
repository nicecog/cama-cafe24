#Requires -Version 5.1
<#
.SYNOPSIS
  Docker PG 기동 → 서버 백그라운드 실행 → smoke 테스트 → 서버 종료 (원샷)
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Jdk17 = (Get-ChildItem 'C:\Program Files\Microsoft\jdk-17*' | Sort-Object Name -Descending | Select-Object -First 1).FullName
$Jar = Join-Path $Root 'target\cama-back-1.0-SNAPSHOT.jar'
$EnvFile = Join-Path $PSScriptRoot 'local-gabia.env'
$LogFile = Join-Path $Root 'data\server-local.log'

if (-not (Test-Path $Jar)) {
    $env:JAVA_HOME = $Jdk17
    Push-Location $Root
    & mvn -q package -DskipTests
    Pop-Location
}

Write-Host 'Ensuring PostgreSQL container...' -ForegroundColor Cyan
docker compose -f (Join-Path $Root 'docker-compose.local.yml') up -d | Out-Null
Start-Sleep -Seconds 5

Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $pair = $_ -split '=', 2
    if ($pair.Length -eq 2) { Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim() }
}
$env:SPRING_PROFILES_ACTIVE = 'local-gabia'
$dataDir = Join-Path $Root 'data\cama-files'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$env:FILE_STORAGE_PATH = $dataDir

$port = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { '8080' }
$baseUrl = "http://localhost:$port"

Write-Host 'Starting server in background...' -ForegroundColor Cyan
$java = Join-Path $Jdk17 'bin\java.exe'
$proc = Start-Process -FilePath $java `
    -ArgumentList @('-Xms256m', '-Xmx768m', '-jar', $Jar, '--spring.profiles.active=local-gabia', "--server.port=$port") `
    -RedirectStandardOutput $LogFile `
    -RedirectStandardError (Join-Path $Root 'data\server-local.err.log') `
    -PassThru `
    -WindowStyle Hidden

try {
    $ready = $false
    for ($i = 0; $i -lt 60; $i++) {
        try {
            $r = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -eq 200 -and $r.Content -match 'cama-back') { $ready = $true; break }
        }
        catch { Start-Sleep -Seconds 2 }
    }
    if (-not $ready) {
        Write-Host 'Server failed to start. Log tail:' -ForegroundColor Red
        Get-Content $LogFile -Tail 40 -ErrorAction SilentlyContinue
        Get-Content (Join-Path $Root 'data\server-local.err.log') -Tail 40 -ErrorAction SilentlyContinue
        throw "Server not ready on :$port"
    }
    Write-Host "Server ready on $baseUrl" -ForegroundColor Green

    & (Join-Path $PSScriptRoot 'smoke-test-local.ps1') -BaseUrl $baseUrl
    if ($LASTEXITCODE -ne 0) { throw 'Smoke tests failed' }

    & (Join-Path $PSScriptRoot 'db-integration-test-local.ps1') -BaseUrl $baseUrl
}
finally {
    if (-not $proc.HasExited) {
        Write-Host 'Stopping server...' -ForegroundColor Cyan
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
}
