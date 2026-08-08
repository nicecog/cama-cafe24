$ErrorActionPreference = "Continue"
$src = "F:\food_mvp"
$dst = "D:\food_mvp"
$log = "F:\cama_pjt\cama-cafe24\data\aihub\mapped\copy_mvp_to_d.log"

Write-Host ("==== copy $src -> $dst " + (Get-Date -Format o) + " ====")
New-Item -ItemType Directory -Path $dst -Force | Out-Null
robocopy $src $dst /E /COPY:DAT /DCOPY:T /R:2 /W:5 /MT:16 /NFL /NDL /NP /TEE /LOG:$log
$code = $LASTEXITCODE
Write-Host "robocopy exit=$code (bits <8 means success)"
if ($code -ge 8) { exit $code }

Set-Location "F:\cama_pjt\cama-cafe24"
.\.venv\Scripts\python.exe scripts\food-calorie\fix_data_yaml_path.py "D:\food_mvp"

.\.venv\Scripts\python.exe -c @"
from pathlib import Path
p = Path(r'D:/food_mvp')
for split in ('train','val'):
  ni=len(list((p/'images'/split).glob('*')))
  nl=len(list((p/'labels'/split).glob('*')))
  print(split, 'images', ni, 'labels', nl)
print('data.yaml exists', (p/'data.yaml').is_file())
print(p.joinpath('data.yaml').read_text(encoding='utf-8')[:120])
"@
