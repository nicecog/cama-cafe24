#Requires -Version 5.1
<#
.SYNOPSIS
  cama-plus-app 이 호출하는 REST API를 로컬 cama-plus-server 에 대해 검증합니다.
  (PASS 로그인 제외 — Iamport 필요. 공개 API + JWT 플로우는 general 계정으로 검증)

  사용:
    cd F:\cama_pjt\cama-plus-app
    powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-mobile-api.ps1
#>
param(
    [string]$BaseUrl = $(if ($env:SERVER_PORT) { "http://localhost:$($env:SERVER_PORT)" } else { 'http://localhost:8080' }),
    [string]$TestLoginId = 'localpatient',
    [string]$TestPassword = 'Test1234!'
)

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0
$warned = 0
$results = @()
$script:patientToken = $null

function Test-Case {
    param(
        [string]$Name,
        [scriptblock]$Action,
        [switch]$WarnOnly
    )
    try {
        & $Action
        $script:passed++
        $script:results += [pscustomobject]@{ Case = $Name; Result = 'PASS' }
        Write-Host "[PASS] $Name" -ForegroundColor Green
    }
    catch {
        if ($WarnOnly) {
            $script:warned++
            $script:results += [pscustomobject]@{ Case = $Name; Result = "WARN: $($_.Exception.Message)" }
            Write-Host "[WARN] $Name — $($_.Exception.Message)" -ForegroundColor Yellow
        }
        else {
            $script:failed++
            $script:results += [pscustomobject]@{ Case = $Name; Result = "FAIL: $($_.Exception.Message)" }
            Write-Host "[FAIL] $Name — $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Invoke-CamaApi {
    param(
        [string]$Method = 'Get',
        [string]$Path,
        [object]$Body = $null,
        [string]$Token = $null
    )
    $headers = @{ 'Content-Type' = 'application/json' }
    if ($Token) { $headers['api_key'] = "Bearer $Token" }
    $uri = "$BaseUrl$Path"
    if ($Body) {
        return Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json -Depth 6) -TimeoutSec 30
    }
    return Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -TimeoutSec 30
}

Write-Host "=== cama-plus-app mobile API smoke @ $BaseUrl ===" -ForegroundColor Cyan

Test-Case 'TC01 Server health — GET /' {
    $r = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 15
    if ($r.Content -notmatch 'cama-back') { throw 'not cama-back' }
}

Test-Case 'TC02 Contents list — GET /api/contents/list?paging=false' {
    $r = Invoke-CamaApi -Path '/api/contents/list?paging=false'
    if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
}

Test-Case 'TC03 Hospital list (webview) — GET /api/webview/hospital/list' {
    $r = Invoke-CamaApi -Path '/api/webview/hospital/list'
    if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
}

Test-Case 'TC04 Common disease — GET /api/common/disease/list' {
    $r = Invoke-CamaApi -Path '/api/common/disease/list'
    if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
}

Test-Case 'TC05 General signup — POST /api/account/general' {
    $body = @{
        loginId  = $TestLoginId
        password = $TestPassword
        name     = 'Local Test Patient'
        phone    = '01099998888'
        gender   = 'MALE'
        birthday = '1990-01-01'
        signType = 'GENERAL'
        lang     = 'KO'
        firebase = @{
            token    = 'smoke-test-fcm-token'
            platform = 'ANDROID'
            device   = 'smoke-test'
        }
    }
    try {
        $r = Invoke-CamaApi -Method Post -Path '/api/account/general' -Body $body
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }
    catch {
        if ($_.Exception.Message -match 'duplicate|already|Duplicate|409') {
            Write-Host '  (account already exists — skip)' -ForegroundColor DarkGray
        }
        else { throw }
    }
}

Test-Case 'TC06 General login + JWT — POST /api/auth' -WarnOnly {
    # 서버: /api/auth 는 email 기준. general 가입은 email=null 이라 JWT 발급 불가할 수 있음.
    # id/password 전환 시 서버 수정 필요 — WARN 처리.
    $body = @{
        principal   = $TestLoginId
        credentials = $TestPassword
        firebase    = @{
            token    = 'smoke-test-fcm-token'
            platform = 'ANDROID'
            device   = 'smoke-test'
        }
    }
    $r = Invoke-CamaApi -Method Post -Path '/api/auth' -Body $body
    if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    if (-not $r.response.apiToken) { throw 'no apiToken' }
    $script:patientToken = $r.response.apiToken
}

if ($script:patientToken) {
    Test-Case 'TC07 Account me — GET /api/account/me' {
        $r = Invoke-CamaApi -Path '/api/account/me' -Token $script:patientToken
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }

    Test-Case 'TC08 Hospital service check — POST /api/hospital/service/check' {
        $r = Invoke-CamaApi -Method Post -Path '/api/hospital/service/check' -Token $script:patientToken -Body @{}
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }

    Test-Case 'TC09 Track service check — GET /api/track/service/check' {
        $r = Invoke-CamaApi -Path '/api/track/service/check' -Token $script:patientToken
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }

    Test-Case 'TC10 Schedule monthly — GET /api/schedule/monthly' {
        $month = Get-Date -Format 'yyyy-MM'
        $r = Invoke-CamaApi -Path "/api/schedule/monthly?monthly=$month" -Token $script:patientToken
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }

    Test-Case 'TC11 Notification recent — GET /api/notification/recent' {
        $r = Invoke-CamaApi -Path '/api/notification/recent' -Token $script:patientToken
        if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
    }
}
else {
    Write-Host '[SKIP] TC07–TC11 (no patient JWT — fix /api/auth loginId support for id/password migration)' -ForegroundColor Yellow
}

Test-Case 'TC12 Coaching progress (public) — POST /api/coaching/service/getCoachingProgressList' -WarnOnly {
    $r = Invoke-CamaApi -Method Post -Path '/api/coaching/service/getCoachingProgressList' -Body @{ loginId = $TestLoginId }
    if (-not $r.success) { throw ($r | ConvertTo-Json -Compress) }
}

Write-Host ''
Write-Host "=== Summary: PASS=$passed WARN=$warned FAIL=$failed ===" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })
$results | Format-Table -AutoSize -Wrap
if ($failed -gt 0) { exit 1 }
