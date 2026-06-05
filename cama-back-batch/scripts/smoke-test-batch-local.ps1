#Requires -Version 5.1
$ErrorActionPreference = 'Stop'
$Base = if ($env:BATCH_BASE_URL) { $env:BATCH_BASE_URL } else { 'http://localhost:8082' }

Write-Host "Batch smoke (Cafe24 stack): $Base" -ForegroundColor Cyan

$index = Invoke-RestMethod -Uri "$Base/" -Method Get
if ($index -ne 'cama-batch-back') { throw "Unexpected index: $index" }
Write-Host "PASS index" -ForegroundColor Green

$jobs = Invoke-RestMethod -Uri "$Base/api/batch/dev/jobs" -Method Get
Write-Host "PASS jobs ($($jobs.Count))" -ForegroundColor Green

foreach ($name in @('check1', 'check4', 'track-expire', 'statistics')) {
    $r = Invoke-RestMethod -Uri "$Base/api/batch/dev/run/$name" -Method Get
    Write-Host "PASS run/$name targets=$($r.targets)" -ForegroundColor Green
}

Write-Host "All batch smoke checks passed." -ForegroundColor Cyan
