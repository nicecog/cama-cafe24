#Requires -Version 5.1
<#
.SYNOPSIS
  cama-doctor-web — Cafe24 스택 로컬 실행 (profile=local-cafe24, :8081, PG :55432).
  선행: cama-plus-server :8080, scripts/ensure-doctor-db.ps1
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Jar = Join-Path $Root 'build\libs\cama-doctor-web-0.0.1-SNAPSHOT.jar'

function Find-Jdk {
    foreach ($pattern in @('jdk-21*', 'jdk-17*')) {
        $hit = Get-ChildItem "C:\Program Files\Microsoft\$pattern" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending | Select-Object -First 1
        if (-not $hit) {
            $hit = Get-ChildItem "C:\Program Files\Eclipse Adoptium\$pattern" -ErrorAction SilentlyContinue |
                Sort-Object Name -Descending | Select-Object -First 1
        }
        if ($hit) { return $hit.FullName }
    }
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { return $env:JAVA_HOME }
    return $null
}

$jdk = Find-Jdk
if (-not $jdk) { throw 'JDK 21+ required.' }
$env:JAVA_HOME = $jdk

& (Join-Path $PSScriptRoot 'ensure-doctor-db.ps1')

if (-not (Test-Path $Jar)) {
    Push-Location $Root
    if (Test-Path '.\gradlew.bat') {
        & .\gradlew.bat bootJar -x test --no-daemon
    } else {
        & gradle bootJar -x test --no-daemon
    }
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Gradle bootJar failed' }
    Pop-Location
}

$env:SPRING_PROFILES_ACTIVE = 'local-cafe24'
$env:DOCTOR_DB_URL = if ($env:DOCTOR_DB_URL) { $env:DOCTOR_DB_URL } else { 'jdbc:postgresql://127.0.0.1:55432/cama_doctor' }
$env:DOCTOR_DB_USER = if ($env:DOCTOR_DB_USER) { $env:DOCTOR_DB_USER } else { 'cama' }
$env:DOCTOR_DB_PASSWORD = if ($env:DOCTOR_DB_PASSWORD) { $env:DOCTOR_DB_PASSWORD } else { 'cama_local_dev' }
$env:CAMA_BILLIVE_BASE_URL = if ($env:CAMA_BILLIVE_BASE_URL) { $env:CAMA_BILLIVE_BASE_URL } else { 'http://127.0.0.1:8080' }

$port = if ($env:DOCTOR_WEB_PORT) { $env:DOCTOR_WEB_PORT } else { '8081' }
Write-Host "Starting cama-doctor-web (profile=local-cafe24, JDK=$jdk)..." -ForegroundColor Cyan
Write-Host "  http://localhost:$port/login" -ForegroundColor Yellow
Write-Host "  Billive proxy -> $env:CAMA_BILLIVE_BASE_URL" -ForegroundColor Yellow

& "$jdk\bin\java.exe" `
    -Xms128m -Xmx512m `
    -jar $Jar `
    --spring.profiles.active=local-cafe24 `
    --server.port=$port
