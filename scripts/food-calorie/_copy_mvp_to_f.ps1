$ErrorActionPreference = "Continue"
$src = "K:\food_mvp"
$dst = "F:\food_mvp"
New-Item -ItemType Directory -Force -Path $dst | Out-Null

Write-Host "==== COPY START $(Get-Date -Format o) ===="

# 1) labels + yaml + classes (small, fast)
robocopy "$src\labels" "$dst\labels" /E /MT:8 /R:2 /W:3 /NFL /NDL /NP
robocopy "$src" "$dst" data.yaml classes.json /R:2 /W:3 /NFL /NDL /NP
if (Test-Path "$src\preview") {
  robocopy "$src\preview" "$dst\preview" /E /MT:8 /R:1 /W:2 /NFL /NDL /NP
}

Write-Host "==== IMAGES COPY START $(Get-Date -Format o) ===="
# 2) images (large) - /J unbuffered, /MT multithread
$rc = 0
robocopy "$src\images" "$dst\images" /E /MT:16 /R:3 /W:5 /J /NFL /NDL
$rc = $LASTEXITCODE
Write-Host "robocopy images exit=$rc (0-7 often OK)"

# 3) fix yaml path
Set-Location "F:\cama_pjt\cama-cafe24"
.\.venv\Scripts\python.exe scripts\food-calorie\fix_data_yaml_path.py "F:\food_mvp"

# 4) quick verify counts
$py = ".\.venv\Scripts\python.exe"
& $py -c @"
from pathlib import Path
for split in ('train','val'):
  ni=len(list((Path(r'F:/food_mvp')/'images'/split).glob('*')))
  nl=len(list((Path(r'F:/food_mvp')/'labels'/split).glob('*')))
  print(split, 'images', ni, 'labels', nl)
print('data.yaml exists', (Path(r'F:/food_mvp')/'data.yaml').is_file())
"@

Write-Host "==== COPY DONE $(Get-Date -Format o) ===="
