#Requires -Version 5.1
<#
.SYNOPSIS
  cama-plus-server — Cafe24 스택 로컬 실행 (profile=local-cafe24, Docker PG :55432).
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$EnvFile = Join-Path $PSScriptRoot 'local-cafe24.env'
$Jar = Join-Path $Root 'target\cama-back-1.0-SNAPSHOT.jar'

function Find-Jdk {
    foreach ($pattern in @('jdk-21*', 'jdk-17*')) {
        $hit = Get-ChildItem "C:\Program Files\Microsoft\$pattern" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending | Select-Object -First 1
        if ($hit) { return $hit.FullName }
    }
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { return $env:JAVA_HOME }
    return $null
}

$jdk = Find-Jdk
if (-not $jdk) { throw 'JDK 17+ required.' }
$env:JAVA_HOME = $jdk

if (-not (Test-Path $Jar)) {
    Push-Location $Root
    & mvn -q package -DskipTests
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Maven package failed' }
    Pop-Location
}

if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $pair = $_ -split '=', 2
        if ($pair.Length -eq 2) {
            Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim()
        }
    }
}

$env:SPRING_PROFILES_ACTIVE = 'local-cafe24'
$dataDir = Join-Path $Root 'data\cama-files'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$env:FILE_STORAGE_PATH = $dataDir
$env:DB_URL = if ($env:DB_URL) { $env:DB_URL } else { 'jdbc:postgresql://127.0.0.1:55432/cama' }
$env:DB_USER = if ($env:DB_USER) { $env:DB_USER } else { 'cama' }
$env:DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { 'cama_local_dev' }
$env:JWT_CLIENT_SECRET = if ($env:JWT_CLIENT_SECRET) { $env:JWT_CLIENT_SECRET } else { 'local-dev-jwt-secret-change-me' }

$port = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { '8080' }
Write-Host "Starting cama-back (profile=local-cafe24, JDK=$jdk)..." -ForegroundColor Cyan
Write-Host "  http://localhost:$port/" -ForegroundColor Yellow
Write-Host "  http://localhost:$port/swagger-ui.html" -ForegroundColor Yellow

& "$jdk\bin\java.exe" `
    -Xms256m -Xmx1024m `
    -jar $Jar `
    --spring.profiles.active=local-cafe24 `
    --server.port=$port
