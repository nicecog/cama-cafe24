#Requires -Version 5.1
<#
.SYNOPSIS
  cama-back-batch 를 local-gabia 프로필로 로컬 실행 (Docker PG :55432).
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Jar = Join-Path $Root 'target\cama-batch-1.0-SNAPSHOT.jar'

function Find-Jdk17 {
    $hit = Get-ChildItem 'C:\Program Files\Microsoft\jdk-17*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -First 1
    if ($hit) { return $hit.FullName }
    $javaHome = $env:JAVA_HOME
    if ($javaHome -and (Test-Path (Join-Path $javaHome 'bin\java.exe'))) { return $javaHome }
    return $null
}

$jdk = Find-Jdk17
if (-not $jdk) { throw 'JDK 17+ required.' }
$env:JAVA_HOME = $jdk

if (-not (Test-Path $Jar)) {
    Push-Location $Root
    & mvn -q package -DskipTests
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Maven package failed' }
    Pop-Location
}

$port = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { '8082' }
$env:SPRING_PROFILES_ACTIVE = 'local-gabia'
$env:DB_URL = if ($env:DB_URL) { $env:DB_URL } else { 'jdbc:postgresql://127.0.0.1:55432/cama' }
$env:DB_USER = if ($env:DB_USER) { $env:DB_USER } else { 'cama' }
$env:DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { 'cama_local_dev' }

Write-Host "Starting cama-back-batch (profile=local-gabia, port=$port)..." -ForegroundColor Cyan
Write-Host "  http://localhost:$port/" -ForegroundColor Yellow
Write-Host "  http://localhost:$port/api/batch/dev/jobs" -ForegroundColor Yellow

& "$jdk\bin\java.exe" `
    -Xms128m -Xmx512m `
    -jar $Jar `
    --spring.profiles.active=local-gabia `
    --server.port=$port
