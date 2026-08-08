$ErrorActionPreference = 'Continue'
Set-Location 'F:\cama_pjt\cama-cafe24'
$env:PYTHONUNBUFFERED = '1'
$py = '.\.venv\Scripts\python.exe'

function Run-Step([string]$Name, [string]$Cmd) {
  Write-Host ("==== " + $Name + " " + (Get-Date -Format o) + " ====")
  & $py -u scripts\food-calorie\run_mvp_pipeline.py $Cmd
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("FAIL " + $Name + " exit=" + $LASTEXITCODE)
    exit $LASTEXITCODE
  }
}

# map already done; resume from convert
Run-Step 'convert' 'convert'
Run-Step 'preview' 'preview'
Run-Step 'train7a' 'train7a'
Run-Step 'train7b' 'train7b'
Run-Step 'export8' 'export8'
Write-Host ("==== ALL DONE " + (Get-Date -Format o) + " ====")
