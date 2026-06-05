#Requires -Version 5.1
<#
.SYNOPSIS
  DB 스키마 적용 후 실행하는 통합 테스트 (관리자 로그인, DB 조회 API 등)
  smoke-test-local.ps1 실행 후 또는 run-all-local-tests.ps1 에서 호출됩니다.
#>
param(
    [string]$BaseUrl = $(if ($env:SERVER_PORT) { "http://localhost:$($env:SERVER_PORT)" } else { 'http://localhost:8080' }),
    [string]$AdminLogin = 'localadmin',
    [string]$AdminPassword = 'localadmin123'
)

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0
$results = @()

function Test-Case {
    param([string]$Name, [scriptblock]$Action)
    try {
        & $Action
        $script:passed++
        $script:results += [pscustomobject]@{ Case = $Name; Result = 'PASS' }
        Write-Host "[PASS] $Name" -ForegroundColor Green
    }
    catch {
        $script:failed++
        $script:results += [pscustomobject]@{ Case = $Name; Result = "FAIL: $($_.Exception.Message)" }
        Write-Host "[FAIL] $Name — $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "=== DB integration tests @ $BaseUrl ===" -ForegroundColor Cyan

Test-Case 'TC06 DB — sys_code_mst has rows' {
    $raw = docker exec cama-local-postgres psql -U cama -d cama -t -A -c 'SELECT count(*) FROM sys_code_mst;'
    $count = ($raw | Out-String).Trim()
    if ([int]$count -lt 1) { throw "sys_code_mst empty ($count)" }
}

Test-Case 'TC07 Admin login — POST /api/auth/admin' {
    $body = @{ principal = $AdminLogin; credentials = $AdminPassword } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BaseUrl/api/auth/admin" -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 30
    if (-not $r.success) { throw "login failed: $($r | ConvertTo-Json -Compress)" }
    if (-not $r.response.apiToken) { throw 'no apiToken in response' }
    $script:adminToken = $r.response.apiToken
}

Test-Case 'TC08 Admin profile — GET /api/admin/account/me (with token)' {
    if (-not $script:adminToken) { throw 'no token from TC07' }
    $headers = @{ api_key = "Bearer $($script:adminToken)" }
    $r = Invoke-RestMethod -Uri "$BaseUrl/api/admin/account/me" -Headers $headers -TimeoutSec 30
    if (-not $r.success) { throw "api failed: $($r | ConvertTo-Json -Compress)" }
    if ($r.response.loginId -ne $AdminLogin) { throw "unexpected loginId: $($r.response.loginId)" }
}

Test-Case 'TC09 Public DB API — GET /api/webview/hospital/list' {
    $r = Invoke-RestMethod -Uri "$BaseUrl/api/webview/hospital/list" -TimeoutSec 30
    if (-not $r.success) { throw "api failed: $($r | ConvertTo-Json -Compress)" }
}

Write-Host ''
Write-Host "=== DB Summary: PASS=$passed FAIL=$failed ===" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })
$results | Format-Table -AutoSize
if ($failed -gt 0) { exit 1 }
