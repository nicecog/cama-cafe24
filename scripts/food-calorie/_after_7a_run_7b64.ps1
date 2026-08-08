$ErrorActionPreference = "Continue"
Set-Location "F:\cama_pjt\cama-cafe24"
$env:PYTHONUNBUFFERED = "1"
$py = ".\.venv\Scripts\python.exe"

# Wait until no 7A training process is running
Write-Host ("==== wait for 7A finish " + (Get-Date -Format o) + " ====")
while ($true) {
  $alive = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -match 'yolo26n_mvp_1000\\weights\\last\.pt|resume=True'
  }
  if (-not $alive) { break }
  Start-Sleep -Seconds 60
}
Write-Host ("==== 7A finished " + (Get-Date -Format o) + " ====")

Write-Host ("==== train7b batch=64 workers=4 " + (Get-Date -Format o) + " ====")
& $py -u scripts\food-calorie\run_mvp_pipeline.py train7b --out D:\food_mvp --batch 64 --workers 4
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL train7b exit=$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host ("==== export8 " + (Get-Date -Format o) + " ====")
& $py -u scripts\food-calorie\run_mvp_pipeline.py export8 --out D:\food_mvp
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL export8 exit=$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host ("==== ALL DONE " + (Get-Date -Format o) + " ====")
