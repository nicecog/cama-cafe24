# Cafe24 VPS — react-app-dawplus dist 업로드 + (선택) nginx 반영
# 사용:
#   .\deploy-react-app-cafe24.ps1 -Build
#   .\deploy-react-app-cafe24.ps1 -SshTarget root@1.2.3.4 -ApplyNginx
param(
    [switch]$Build,
    [switch]$ApplyNginx,
    [string]$SshTarget = $(if ($env:CAMA_SSH_TARGET) { $env:CAMA_SSH_TARGET } else { "root@210.114.18.156" }),
    [string]$RemoteDir = "/opt/cama/www/react-app"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$AppRoot = Join-Path $RepoRoot "react-app-dawplus"
$Dist = Join-Path $AppRoot "dist"

if ($Build -or -not (Test-Path $Dist)) {
    Write-Host "Building react-app-dawplus for Cafe24..."
    node (Join-Path $PSScriptRoot "build-react-app-cafe24.mjs")
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not (Test-Path (Join-Path $Dist "index.html"))) {
    throw "dist/index.html missing. Run with -Build."
}

if (-not $SshTarget) {
    Write-Host ""
    Write-Host "Build OK: $Dist"
    Write-Host "Upload manually:"
    Write-Host "  ssh user@VPS `"mkdir -p $RemoteDir`""
    Write-Host "  scp -r dist/* user@VPS:${RemoteDir}/"
    Write-Host "Or set CAMA_SSH_TARGET and re-run without skipping upload."
    exit 0
}

Write-Host "Uploading to ${SshTarget}:${RemoteDir} ..."
ssh $SshTarget "mkdir -p $RemoteDir"
scp -r "$Dist\*" "${SshTarget}:${RemoteDir}/"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($ApplyNginx) {
    $Snippet = Join-Path $RepoRoot "deploy\nginx\cama-patient-spa-locations.conf"
    $ApplyPy = Join-Path $PSScriptRoot "apply-patient-spa-nginx.py"
    scp $Snippet "${SshTarget}:/tmp/cama-patient-spa-locations.conf"
    scp $ApplyPy "${SshTarget}:/tmp/apply-patient-spa-nginx.py"
    ssh $SshTarget "sudo python3 /tmp/apply-patient-spa-nginx.py /tmp/cama-patient-spa-locations.conf && sudo nginx -t && sudo systemctl reload nginx"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "nginx reloaded."
}

Write-Host "Done. Test: https://camaplus.cafe24.com/webview/help"
