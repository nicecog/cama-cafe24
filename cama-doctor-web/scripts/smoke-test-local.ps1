#Requires -Version 5.1
param(
    [string]$BaseUrl = $(if ($env:DOCTOR_WEB_PORT) { "http://localhost:$($env:DOCTOR_WEB_PORT)" } else { 'http://localhost:8081' })
)

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0

function Test-Case($Name, [scriptblock]$Action) {
    try {
        & $Action
        $script:passed++
        Write-Host "[PASS] $Name" -ForegroundColor Green
    } catch {
        $script:failed++
        Write-Host "[FAIL] $Name — $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "=== cama-doctor-web smoke @ $BaseUrl ===" -ForegroundColor Cyan

Test-Case 'health' {
    $r = Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -TimeoutSec 10
    if ($r.status -ne 'UP') { throw "status=$($r.status)" }
}

Test-Case 'login page' {
    $r = Invoke-WebRequest -Uri "$BaseUrl/login" -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
}

Write-Host "=== Summary: PASS=$passed FAIL=$failed ===" -ForegroundColor Cyan
if ($failed -gt 0) { exit 1 }
