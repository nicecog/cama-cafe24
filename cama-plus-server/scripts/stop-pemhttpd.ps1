#Requires -RunAsAdministrator
<#
.SYNOPSIS
  EnterpriseDB PEMHTTPD(Apache)가 8080을 점유할 때 중지합니다. Gabia와 동일하게 8080 사용 전 1회 실행.
#>
$ErrorActionPreference = 'Stop'
$svc = Get-Service -Name 'PEMHTTPD-x64' -ErrorAction SilentlyContinue
if (-not $svc) {
    Write-Host 'PEMHTTPD-x64 service not found.' -ForegroundColor Yellow
    exit 0
}
if ($svc.Status -eq 'Running') {
    Write-Host 'Stopping PEMHTTPD-x64...' -ForegroundColor Cyan
    Stop-Service -Name 'PEMHTTPD-x64' -Force
    Set-Service -Name 'PEMHTTPD-x64' -StartupType Manual
    Write-Host 'PEMHTTPD-x64 stopped (startup=Manual).' -ForegroundColor Green
}
else {
    Write-Host 'PEMHTTPD-x64 already stopped.' -ForegroundColor Green
}
$hit = netstat -ano | Select-String ':8080\s'
if ($hit) {
    Write-Host "Port 8080 still in use:`n$hit" -ForegroundColor Red
    exit 1
}
Write-Host 'Port 8080 is free.' -ForegroundColor Green
