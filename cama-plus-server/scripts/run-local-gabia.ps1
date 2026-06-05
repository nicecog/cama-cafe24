#Requires -Version 5.1
<#
.SYNOPSIS
  Gabia-like 프로필로 Spring Boot 서버를 로컬에서 실행합니다.
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$EnvFile = Join-Path $PSScriptRoot 'local-gabia.env'
$Jar = Join-Path $Root 'target\cama-back-1.0-SNAPSHOT.jar'

function Find-Jdk17 {
    $hit = Get-ChildItem 'C:\Program Files\Microsoft\jdk-17*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -First 1
    if ($hit) { return $hit.FullName }
    return $null
}

$jdk17 = Find-Jdk17
if (-not $jdk17) { throw 'JDK 17 required. Run local-dev-setup.ps1 first.' }
$env:JAVA_HOME = $jdk17

if (-not (Test-Path $Jar)) {
    Push-Location $Root
    & mvn -q package -DskipTests
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

$env:SPRING_PROFILES_ACTIVE = 'local-gabia'
$dataDir = Join-Path $Root 'data\cama-files'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$env:FILE_STORAGE_PATH = $dataDir

$port = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { '8080' }
$baseUrl = "http://localhost:$port"

Write-Host "Starting cama-back (profile=local-gabia, JDK 17)..." -ForegroundColor Cyan
Write-Host "  $baseUrl/" -ForegroundColor Yellow
Write-Host "  $baseUrl/files/..." -ForegroundColor Yellow

& "$jdk17\bin\java.exe" `
    -Xms256m -Xmx768m `
    -jar $Jar `
    --spring.profiles.active=local-gabia `
    --server.port=$port
