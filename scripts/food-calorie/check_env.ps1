# Food calorie training environment check (Windows)
# Usage: .\scripts\food-calorie\check_env.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $root

Write-Host "=== CAMA food-calorie env check ===" -ForegroundColor Cyan
Write-Host "Project root: $root"

$checks = @()

function Add-Check([string]$name, [bool]$ok, [string]$detail) {
    $script:checks += [pscustomobject]@{ Name = $name; Ok = $ok; Detail = $detail }
    $color = if ($ok) { "Green" } else { "Red" }
    $mark = if ($ok) { "[OK]" } else { "[FAIL]" }
    Write-Host "$mark $name" -ForegroundColor $color
    if ($detail) { Write-Host "     $detail" }
}

$venvPython = Join-Path $root ".venv\Scripts\python.exe"
Add-Check "Python venv" (Test-Path $venvPython) $venvPython

$csv = Join-Path $root "docs\food_mvp_100_classes.csv"
Add-Check "food_mvp_100_classes.csv" (Test-Path $csv) $csv

foreach ($dir in @(
    "data\aihub\raw",
    "data\aihub\downloads",
    "data\aihub\mapped",
    "datasets\food_mvp",
    "exports",
    "runs\food"
)) {
    $path = Join-Path $root $dir
    Add-Check "dir $dir" (Test-Path $path) $path
}

if (Test-Path $venvPython) {
    $pyOut = & $venvPython -c @"
import sys
print('python', sys.version.split()[0])
try:
    import torch
    print('torch', torch.__version__)
    print('cuda_available', torch.cuda.is_available())
    if torch.cuda.is_available():
        print('cuda_device', torch.cuda.get_device_name(0))
except Exception as e:
    print('torch_error', e)
try:
    import ultralytics
    print('ultralytics', ultralytics.__version__)
except Exception as e:
    print('ultralytics_error', e)
"@ 2>&1
    foreach ($line in $pyOut) {
        Write-Host "     $line"
        if ($line -match '^cuda_available\s+True') {
            Add-Check "CUDA (torch)" $true "torch.cuda.is_available() == True"
        }
        if ($line -match '^cuda_available\s+False') {
            Add-Check "CUDA (torch)" $false "torch.cuda.is_available() == False"
        }
        if ($line -match '^ultralytics\s+') {
            Add-Check "ultralytics" $true $line
        }
    }
}

$failed = @($checks | Where-Object { -not $_.Ok })
Write-Host ""
if ($failed.Count -eq 0) {
    Write-Host "All checks passed." -ForegroundColor Green
    exit 0
} else {
    Write-Host "$($failed.Count) check(s) failed." -ForegroundColor Red
    exit 1
}
