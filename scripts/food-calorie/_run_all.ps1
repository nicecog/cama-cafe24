$ErrorActionPreference = 'Continue'
Set-Location 'F:\cama_pjt\cama-cafe24'
$py = '.\.venv\Scripts\python.exe'
$logDir = 'data\aihub\mapped'

function Run-Step([string]$Name, [string]$Cmd) {
  $stamp = Get-Date -Format o
  Write-Host "==== $Name $stamp ===="
  & $py scripts\food-calorie\run_mvp_pipeline.py $Cmd
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAIL $Name exit=$LASTEXITCODE"
    exit $LASTEXITCODE
  }
}

Run-Step 'map' 'map'
Run-Step 'convert' 'convert'
Run-Step 'preview' 'preview'
Run-Step 'train7a' 'train7a'
Run-Step 'train7b' 'train7b'
Run-Step 'export8' 'export8'
Write-Host ("==== ALL DONE " + (Get-Date -Format o) + " ====")
