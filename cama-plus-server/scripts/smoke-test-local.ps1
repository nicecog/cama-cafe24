#Requires -Version 5.1
<#
.SYNOPSIS
  로컬 cama-back smoke / 케이스별 테스트 (서버 기동 후 별도 터미널에서 실행)
#>
param(
    [string]$BaseUrl = $(if ($env:SERVER_PORT) { "http://localhost:$($env:SERVER_PORT)" } else { 'http://localhost:8080' })
)

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0
$results = @()

function Test-Case {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
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

Write-Host "=== Smoke tests @ $BaseUrl ===" -ForegroundColor Cyan

Test-Case 'TC01 Health — GET /' {
    $r = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    if ($r.Content -notmatch 'cama-back') { throw "unexpected body: $($r.Content)" }
}

Test-Case 'TC02 CORS preflight — OPTIONS /api/common/images/upload' {
    $headers = @{
        Origin                         = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'POST'
    }
    $r = Invoke-WebRequest -Uri "$BaseUrl/api/common/images/upload" -Method Options -Headers $headers -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -notin 200, 204) { throw "status $($r.StatusCode)" }
}

Test-Case 'TC03 Image upload — POST multipart (local storage)' {
    $pngBytes = [Convert]::FromBase64String(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    )
    $tmp = [System.IO.Path]::GetTempFileName() + '.png'
    [System.IO.File]::WriteAllBytes($tmp, $pngBytes)
    try {
        $boundary = [System.Guid]::NewGuid().ToString()
        $fileName = 'smoke-test.png'
        $LF = "`r`n"
        $bodyLines = @(
            "--$boundary",
            "Content-Disposition: form-data; name=`"img`"; filename=`"$fileName`"",
            'Content-Type: image/png',
            '',
            [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($pngBytes),
            "--$boundary--",
            ''
        )
        $bodyRaw = $bodyLines -join $LF
        $bodyBytes = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetBytes($bodyRaw)
        $r = Invoke-WebRequest -Uri "$BaseUrl/api/common/images/upload" `
            -Method Post `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $bodyBytes `
            -UseBasicParsing `
            -TimeoutSec 30
        if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
        if ($r.Content -notmatch '/files/') { throw "no public URL in response: $($r.Content)" }
        $script:uploadedUrl = ($r.Content | Select-String -Pattern 'http[^"]+/files/[^"]+' -AllMatches).Matches[0].Value
    }
    finally {
        Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    }
}

Test-Case 'TC04 Image read — GET uploaded file URL' {
    if (-not $script:uploadedUrl) { throw 'no URL from TC03' }
    $r = Invoke-WebRequest -Uri $script:uploadedUrl -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    if ($r.RawContentLength -lt 10) { throw 'empty image body' }
}

Test-Case 'TC05 Protected API without token — GET /api/account/me (expect 401)' {
    try {
        Invoke-WebRequest -Uri "$BaseUrl/api/account/me" -UseBasicParsing -TimeoutSec 15 | Out-Null
        throw 'expected 401 but got success'
    }
    catch [System.Net.WebException] {
        $resp = $_.Exception.Response
        if ($null -eq $resp) { throw $_.Exception.Message }
        $code = [int]$resp.StatusCode
        if ($code -ne 401) { throw "expected 401 got $code" }
    }
}

Write-Host ''
Write-Host "=== Summary: PASS=$passed FAIL=$failed ===" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })
$results | Format-Table -AutoSize
if ($failed -gt 0) { exit 1 }
