"""실제 이미지로 TFLite 출력 규격을 실측한다.

Java `FoodVisionDecoder` 를 추측 없이 작성하기 위한 사전 확인용:
  - 입력 정규화(0~1 여부)와 레이아웃(NCHW)
  - 출력 채널 배치 (bbox 4 + class 62)
  - 박스 좌표 스케일 (정규화 0~1 vs 픽셀)
  - 클래스 점수 범위 (sigmoid 적용 여부)
  - NMS 적용 여부 (중복 박스 존재 여부)

사용법:
    python scripts/food-calorie/probe_tflite_output.py <model.tflite> <image> [names.yaml]
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from ai_edge_litert.interpreter import Interpreter
from PIL import Image


def load_names(yaml_path: Path) -> dict[int, str]:
    names: dict[int, str] = {}
    in_names = False
    for line in yaml_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("names:"):
            in_names = True
            continue
        if in_names:
            stripped = line.strip()
            if not stripped or not stripped[0].isdigit():
                break
            index, _, label = stripped.partition(":")
            names[int(index)] = label.strip()
    return names


def letterbox(image: Image.Image, size: int) -> tuple[np.ndarray, float, int, int]:
    """비율 유지 패딩. Java 전처리와 동일한 규칙을 쓴다."""
    width, height = image.size
    scale = min(size / width, size / height)
    new_w, new_h = round(width * scale), round(height * scale)
    resized = image.resize((new_w, new_h), Image.BILINEAR)
    canvas = Image.new("RGB", (size, size), (114, 114, 114))
    pad_x, pad_y = (size - new_w) // 2, (size - new_h) // 2
    canvas.paste(resized, (pad_x, pad_y))
    return np.asarray(canvas, dtype=np.float32) / 255.0, scale, pad_x, pad_y


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    model_path = Path(sys.argv[1])
    image_path = Path(sys.argv[2])
    names = load_names(Path(sys.argv[3])) if len(sys.argv) > 3 else {}

    interpreter = Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()
    input_detail = interpreter.get_input_details()[0]
    output_detail = interpreter.get_output_details()[0]

    size = int(input_detail["shape"][2])
    hwc, scale, pad_x, pad_y = letterbox(
        Image.open(image_path).convert("RGB"), size
    )
    # 입력이 NCHW 이므로 transpose 가 필요하다
    tensor = np.transpose(hwc, (2, 0, 1))[None, ...]

    interpreter.set_tensor(input_detail["index"], tensor)
    interpreter.invoke()
    raw = interpreter.get_tensor(output_detail["index"])[0]  # (66, N)

    channels, num = raw.shape
    num_classes = channels - 4
    boxes = raw[:4]
    scores = raw[4:]

    print(f"image      : {image_path.name}")
    print(f"input      : {list(input_detail['shape'])} scale={scale:.4f} pad=({pad_x},{pad_y})")
    print(f"output     : {raw.shape} → bbox 4 + classes {num_classes}")
    print(f"box  range : min={boxes.min():.4f} max={boxes.max():.4f}")
    for row, label in enumerate("xywh"):
        print(f"  ch{row} {label}: min={boxes[row].min():.4f} max={boxes[row].max():.4f}")
    print(f"score range: min={scores.min():.6f} max={scores.max():.6f}")
    print(f"score sum per anchor (max) : {scores.sum(axis=0).max():.4f}")

    best_class = scores.max(axis=0)
    order = np.argsort(-best_class)[:12]
    print(f"\ntop 12 anchors (conf desc), 총 anchors={num}")
    for rank, anchor in enumerate(order):
        cls = int(scores[:, anchor].argmax())
        conf = float(best_class[anchor])
        x, y, w, h = (float(v) for v in boxes[:, anchor])
        print(
            f"  #{rank:2d} anchor={anchor:5d} conf={conf:.3f} "
            f"cls={cls:2d} {names.get(cls, '?'):<20} "
            f"box=({x:8.3f},{y:8.3f},{w:8.3f},{h:8.3f})"
        )

    over_035 = int((best_class >= 0.35).sum())
    print(f"\nanchors with conf>=0.35 : {over_035}  (NMS 필요 여부 판단용)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
