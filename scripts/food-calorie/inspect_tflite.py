"""TFLite 모델의 입출력 텐서 규격을 덤프한다.

디코더(`FoodVisionDecoder`)를 작성하기 전에 실제 export 텐서 형태를 확인하는 용도.
설계서 4.3 의 "실제 export 텐서 형태를 통합 시점에 반드시 확인" 항목에 대응한다.

사용법:
    python scripts/food-calorie/inspect_tflite.py <model.tflite> [...]
"""

from __future__ import annotations

import sys
from pathlib import Path

from ai_edge_litert.interpreter import Interpreter


def dump(model_path: Path) -> None:
    interpreter = Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()

    print(f"=== {model_path.name} ({model_path.stat().st_size:,} bytes) ===")
    for label, details in (
        ("INPUT", interpreter.get_input_details()),
        ("OUTPUT", interpreter.get_output_details()),
    ):
        for detail in details:
            quant = detail.get("quantization_parameters", {})
            scales = quant.get("scales")
            zeros = quant.get("zero_points")
            print(
                f"  {label} #{detail['index']} {detail['name']!r}\n"
                f"    shape={list(detail['shape'])} dtype={detail['dtype'].__name__}\n"
                f"    scale={scales[0] if scales is not None and len(scales) else None}"
                f" zero_point={zeros[0] if zeros is not None and len(zeros) else None}"
            )
    print()


def main() -> int:
    paths = [Path(arg) for arg in sys.argv[1:]]
    if not paths:
        print(__doc__)
        return 2
    for path in paths:
        if not path.exists():
            print(f"missing: {path}")
            return 1
        dump(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
