# CAMA Plus — Mac Int8 Export Runbook (TFLite + CoreML)

> Cursor에서 **이 파일만** 열고 아래 순서대로 실행하면 됩니다.  
> Windows에서 학습·ONNX까지 완료된 상태이며, Mac에서는 **모바일용 Int8 패키징**만 합니다.

- 작성일: 2026-08-08  
- 모델: YOLO26n KD (`yolo26n-kd-best.pt`)  
- 클래스: 62  
- Windows 산출물: ONNX 416/320 완료 (`yolo26n-kd-416.onnx`, `yolo26n-kd-320.onnx`)

---

## 0. 이 폴더 구성 (NAS / 복사본)

작업 루트(이 MD가 있는 폴더):

```
food_학습/
├── MAC_EXPORT_RUNBOOK.md          ← 본 문서
├── yolo26n-kd-best.pt             ← 필수 (PyTorch 원본, ~5.5MB)
├── yolo26n-kd-416.onnx            ← 참고용 (Windows 완료분)
├── yolo26n-kd-320.onnx            ← 참고용
└── food_mvp_val/                  ← Int8 캘리브레이션용 val 서브셋 (~25GB)
    ├── data.yaml
    ├── classes.json
    ├── images/val/                ← 4176장
    └── labels/val/                ← 4176개
```

**가져오지 않은 것 (불필요):** `images/train` (~211GB), 전체 `runs/food` 학습 로그, AI Hub 원본.

---

## 1. 사전 준비 (Mac)

### 1.1 하드웨어
- Apple Silicon (M1/M2/M3) 16GB면 충분 (모델이 nano급)
- 여유 디스크: **40GB+** 권장 (데이터 25GB + 환경 + 산출물)

### 1.2 이 폴더를 Mac 로컬로 복사 (권장)

NAS 직접 export도 가능하지만, I/O·권한 이슈를 피하려면 **로컬 SSD로 복사** 후 작업:

```bash
# 예: NAS가 /Volumes/... 로 마운트된 경우
mkdir -p ~/cama_food_export
cp -R "/Volumes/<NAS>/휴딧workspace/food_학습/." ~/cama_food_export/
cd ~/cama_food_export
```

이후 작업 디렉터리를 `~/cama_food_export` 로 가정합니다.  
(경로가 다르면 아래 명령의 경로만 바꾸세요.)

### 1.3 Python 환경

```bash
cd ~/cama_food_export
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install ultralytics onnx onnxruntime coremltools
# TFLite/LiteRT는 ultralytics가 필요 시 추가 패키지를 안내/설치합니다.
```

Python **3.10+** 권장.

---

## 2. data.yaml 경로 수정 (필수)

`food_mvp_val/data.yaml` 의 `path` 를 **이 Mac에서의 절대 경로**로 고칩니다.

```bash
cd ~/cama_food_export
python3 - <<'PY'
from pathlib import Path
import re
root = Path("food_mvp_val").resolve()
yaml = root / "data.yaml"
text = yaml.read_text(encoding="utf-8")
text2 = re.sub(r"(?m)^path:\s*.*$", f"path: {root.as_posix()}", text)
# val-only: train/val 모두 images/val
if "train:" not in text2:
    pass
text2 = re.sub(r"(?m)^train:\s*.*$", "train: images/val", text2)
text2 = re.sub(r"(?m)^val:\s*.*$", "val: images/val", text2)
yaml.write_text(text2, encoding="utf-8")
print(yaml.read_text(encoding="utf-8")[:400])
print("images", len(list((root/"images"/"val").glob("*"))))
print("labels", len(list((root/"labels"/"val").glob("*"))))
PY
```

확인:
- `images/val` ≈ **4176**
- `labels/val` ≈ **4176**

---

## 3. Export 실행 (핵심)

산출물 폴더:

```bash
mkdir -p ~/cama_food_export/exports
cd ~/cama_food_export
source .venv/bin/activate
```

### 3.1 Android — TFLite / LiteRT Int8 (416, 320)

```bash
python3 - <<'PY'
from pathlib import Path
from ultralytics import YOLO
import shutil

root = Path(".").resolve()
pt = root / "yolo26n-kd-best.pt"
data = root / "food_mvp_val" / "data.yaml"
out = root / "exports"
out.mkdir(exist_ok=True)
model = YOLO(str(pt))

for imgsz in (416, 320):
    print(f"=== TFLite int8 imgsz={imgsz} ===")
    # ultralytics 최신은 format='tflite' 를 litert 로 리다이렉트할 수 있음
    exported = model.export(
        format="tflite",
        imgsz=imgsz,
        int8=True,
        data=str(data),
    )
    src = Path(exported) if exported else None
    # fallback: weights 옆 생성물 탐색
    cands = list(pt.parent.glob(f"*{imgsz}*.tflite")) + list(pt.parent.glob("*.tflite"))
    if src and Path(src).exists():
        cands.insert(0, Path(src))
    # 가장 최근 tflite 복사
    tflites = sorted(set(p for p in cands if p.suffix == ".tflite"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not tflites:
        # recursive near model
        tflites = sorted(pt.parent.rglob("*.tflite"), key=lambda p: p.stat().st_mtime, reverse=True)
    if tflites:
        dst = out / f"yolo26n-kd-{imgsz}-int8.tflite"
        shutil.copy2(tflites[0], dst)
        print("saved", dst, f"{dst.stat().st_size/1e6:.2f} MB")
    else:
        print("WARN: no tflite found for", imgsz)
print("done tflite")
PY
```

### 3.2 iOS — CoreML Int8 (416)

```bash
python3 - <<'PY'
from pathlib import Path
from ultralytics import YOLO
import shutil

root = Path(".").resolve()
pt = root / "yolo26n-kd-best.pt"
data = root / "food_mvp_val" / "data.yaml"
out = root / "exports"
out.mkdir(exist_ok=True)
model = YOLO(str(pt))

print("=== CoreML int8 imgsz=416 ===")
exported = model.export(
    format="coreml",
    imgsz=416,
    int8=True,
    data=str(data),
)
src = Path(exported) if exported else None
# CoreML은 보통 .mlpackage 디렉터리
cands = []
if src and Path(src).exists():
    cands.append(Path(src))
cands += list(pt.parent.glob("*.mlpackage"))
cands += list(pt.parent.rglob("*.mlpackage"))
if cands:
    src = cands[0]
    dst = out / "yolo26n-kd-416-int8.mlpackage"
    if dst.exists():
        shutil.rmtree(dst)
    if src.is_dir():
        shutil.copytree(src, dst)
    else:
        shutil.copy2(src, dst)
    print("saved", dst)
else:
    print("WARN: no coreml package found")
print("done coreml")
PY
```

---

## 4. 예상 산출물

`exports/` 에 다음이 생기면 성공:

| 파일 | 용도 |
|------|------|
| `yolo26n-kd-416-int8.tflite` | Android 416 |
| `yolo26n-kd-320-int8.tflite` | Android 320 |
| `yolo26n-kd-416-int8.mlpackage` | iOS 416 |

(파일명이 ultralytics 기본명일 수 있음 → 위 스크립트가 `yolo26n-kd-...` 로 복사)

소요 시간(대략): **10–40분** (캘리브레이션 포함, M2 기준)

---

## 5. 간단 검증

### 5.1 TFLite / ONNX 스모크 (선택)

```bash
source .venv/bin/activate
python3 - <<'PY'
from pathlib import Path
from ultralytics import YOLO
img = next(Path("food_mvp_val/images/val").glob("*.jpg"))
# tflite가 로드되면:
for mpath in sorted(Path("exports").glob("*.tflite")):
    print("load", mpath)
    m = YOLO(str(mpath), task="detect")
    r = m.predict(str(img), imgsz=416 if "416" in mpath.name else 320, verbose=False)[0]
    print(" boxes", len(r.boxes))
    if len(r.boxes):
        print(" top", r.names[int(r.boxes.cls[0])], float(r.boxes.conf[0]))
print("OK")
PY
```

### 5.2 체크리스트
- [ ] `data.yaml` path 가 Mac 절대경로
- [ ] val 이미지/라벨 ~4176
- [ ] `exports/*-416-int8.tflite` 존재
- [ ] `exports/*-320-int8.tflite` 존재
- [ ] `exports/*-416-int8.mlpackage` 존재
- [ ] 샘플 이미지에서 박스 ≥ 1

---

## 6. Cursor Agent용 지시문 (복붙)

Mac Cursor에서 이 MD를 연 뒤 Agent에게:

```
이 MAC_EXPORT_RUNBOOK.md 를 따라 Mac에서 YOLO26n KD Int8 export를 완료해줘.
작업 루트는 이 MD가 있는 폴더(또는 ~/cama_food_export)야.
1) venv + ultralytics 설치
2) food_mvp_val/data.yaml path를 절대경로로 수정
3) TFLite int8 416/320 + CoreML int8 416 export
4) exports/ 에 yolo26n-kd-* 이름으로 정리
5) val 샘플 1장으로 스모크 테스트
실패 시 로그를 보여주고 수정해.
Windows에서는 TFLite/CoreML이 불가해서 Mac에서만 한다.
```

---

## 7. 문제 해결

| 증상 | 조치 |
|------|------|
| `LiteRT export only supported on Linux/macOS` | Windows에서 실행 중 → **Mac/Linux에서만** |
| `data` / 이미지 경로 오류 | `data.yaml` 의 `path` 절대경로 재확인 |
| Int8 calibration OOM | `workers=0`, 또는 val 일부를 더 줄인 yaml 사용 |
| coremltools 오류 | `pip install -U coremltools`, Xcode CLT 설치 |
| tflite 파일 못 찾음 | `find . -name '*.tflite'` 로 생성 위치 확인 후 `exports/` 로 복사 |
| 파일명에 한글/공백 | 가능하면 ASCII 경로(`~/cama_food_export`)에서 작업 |

---

## 8. 배경 (참고)

| 단계 | 상태 | 비고 |
|------|------|------|
| 7A YOLO26n baseline | 완료 | mAP50 ≈ 0.992 |
| 7B teacher YOLO26s | 완료 | mAP50 ≈ 0.993 |
| 7B student KD | 완료 | mAP50 ≈ 0.993 ← **이 가중치** |
| Windows ONNX 416/320 | 완료 | 본 폴더의 `.onnx` |
| Mac TFLite/CoreML Int8 | **할 일** | 본 런북 |

원본 학습 PC 경로(참고):
- 가중치: `F:\cama_pjt\cama-cafe24\runs\food\yolo26n_kd\weights\best.pt`
- 데이터셋: `D:\food_mvp` (전체 ~234GB; Mac에는 val만 복사)

---

## 9. 완료 후

1. `exports/` 전체를 NAS `food_학습/exports/` 로 다시 업로드하거나 공유  
2. Android/iOS 앱에 각각 tflite / mlpackage 연결  
3. Windows 개발은 계속 `.pt` 또는 `.onnx` 사용

끝.