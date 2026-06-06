#Requires -Version 5.1
<#
.SYNOPSIS
  cama-back-batch — Cafe24 스택 로컬 실행 (profile=local-cafe24).
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Jar = Join-Path $Root 'target/cama-batch-1.0-SNAPSHOT.jar'

function Find-Jdk {
    foreach ($pattern in @('jdk-21*', 'jdk-17*')) {
        $hit = Get-ChildItem "C:\Program Files\Microsoft\$pattern" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending | Select-Object -First 1
        if ($hit) { return $hit.FullName }
    }
    if ($env:JAVA_HOME -and (
        (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe')) -or
        (Test-Path (Join-Path $env:JAVA_HOME 'bin/java'))
    )) { return $env:JAVA_HOME }
    return $null
}

function Get-JavaCommand([string]$JdkHome) {
    $windowsJava = Join-Path $JdkHome 'bin\java.exe'
    if (Test-Path $windowsJava) { return $windowsJava }

    $unixJava = Join-Path $JdkHome 'bin/java'
    if (Test-Path $unixJava) { return $unixJava }

    throw "java executable not found under $JdkHome"
}

$jdk = Find-Jdk
if (-not $jdk) { throw 'JDK 17+ required.' }
$env:JAVA_HOME = $jdk
$javaCmd = Get-JavaCommand $jdk

if (-not (Test-Path $Jar)) {
    Push-Location $Root
    & mvn -q package -DskipTests
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Maven package failed' }
    Pop-Location
}

$port = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { '8082' }
$env:SPRING_PROFILES_ACTIVE = 'local-cafe24'
$env:DB_URL = if ($env:DB_URL) { $env:DB_URL } else { 'jdbc:postgresql://127.0.0.1:55432/cama' }
$env:DB_USER = if ($env:DB_USER) { $env:DB_USER } else { 'cama' }
$env:DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { 'cama_local_dev' }

Write-Host "Starting cama-back-batch (profile=local-cafe24, port=$port)..." -ForegroundColor Cyan
Write-Host "  http://localhost:$port/api/batch/dev/jobs" -ForegroundColor Yellow

& $javaCmd `
    -Xms128m -Xmx512m `
    -jar $Jar `
    --spring.profiles.active=local-cafe24 `
    --server.port=$port
