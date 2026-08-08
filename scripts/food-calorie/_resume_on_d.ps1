$ErrorActionPreference = "Continue"
Set-Location "F:\cama_pjt\cama-cafe24"
$env:PYTHONUNBUFFERED = "1"
$py = ".\.venv\Scripts\python.exe"

Write-Host ("==== resume batch=48 workers=4 on D: " + (Get-Date -Format o) + " ====")

& $py -u -c @"
from pathlib import Path
import re
import torch
from ultralytics import YOLO

data = r'D:\food_mvp\data.yaml'
batch, workers = 48, 4
weights = Path(r'F:\cama_pjt\cama-cafe24\runs\food\yolo26n_mvp_1000\weights')

for name in ('last.pt', 'best.pt'):
    p = weights / name
    ckpt = torch.load(p, map_location='cpu', weights_only=False)
    ta = ckpt.get('train_args')
    if isinstance(ta, dict):
        ta['data'] = data
        ta['batch'] = batch
        ta['workers'] = workers
    else:
        ta.data = data
        ta.batch = batch
        ta.workers = workers
    torch.save(ckpt, p)
    print('patched', name)

args = Path(r'F:\cama_pjt\cama-cafe24\runs\food\yolo26n_mvp_1000\args.yaml')
text = args.read_text(encoding='utf-8')
text = re.sub(r'(?m)^data:\s*.*$', r'data: D:\\food_mvp\\data.yaml', text)
text = re.sub(r'(?m)^batch:\s*.*$', f'batch: {batch}', text)
text = re.sub(r'(?m)^workers:\s*.*$', f'workers: {workers}', text)
args.write_text(text, encoding='utf-8')
print('args ready')

model = YOLO(str(weights / 'last.pt'))
model.train(resume=True, device=0, workers=workers, batch=batch)
print('7A resume finished')
"@
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL resume7a exit=$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host ("==== train7b batch=64 workers=4 " + (Get-Date -Format o) + " ====")
& $py -u scripts\food-calorie\run_mvp_pipeline.py train7b --out D:\food_mvp --batch 64 --workers 4
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL train7b exit=$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host ("==== export8 " + (Get-Date -Format o) + " ====")
& $py -u scripts\food-calorie\run_mvp_pipeline.py export8 --out D:\food_mvp
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL export8 exit=$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host ("==== ALL DONE " + (Get-Date -Format o) + " ====")
