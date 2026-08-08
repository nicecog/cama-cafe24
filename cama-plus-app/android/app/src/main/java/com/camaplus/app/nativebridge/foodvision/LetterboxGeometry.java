package com.camaplus.app.nativebridge.foodvision;

/**
 * letterbox 변환 정보. 모델 출력 좌표를 원본 이미지 좌표로 되돌리는 데 쓴다.
 *
 * <p>비율을 유지한 채 축소하고 남는 여백을 회색(114)으로 채우므로, 모델이 낸 좌표에는 여백 오프셋이
 * 섞여 있다. 이를 빼고 스케일을 되돌려야 원본 기준 좌표가 된다.
 */
public final class LetterboxGeometry {

  public final int inputSize;
  public final int sourceWidth;
  public final int sourceHeight;
  public final float scale;
  public final int padX;
  public final int padY;

  public LetterboxGeometry(int inputSize, int sourceWidth, int sourceHeight) {
    this.inputSize = inputSize;
    this.sourceWidth = sourceWidth;
    this.sourceHeight = sourceHeight;
    this.scale = Math.min((float) inputSize / sourceWidth, (float) inputSize / sourceHeight);
    this.padX = Math.round((inputSize - sourceWidth * scale) / 2f);
    this.padY = Math.round((inputSize - sourceHeight * scale) / 2f);
  }

  public int scaledWidth() {
    return Math.round(sourceWidth * scale);
  }

  public int scaledHeight() {
    return Math.round(sourceHeight * scale);
  }

  /**
   * 모델 출력 좌표(letterbox 기준 정규화 x1,y1,x2,y2)를 원본 기준 정규화 {@code [x, y, w, h]} 로
   * 바꾼다. 브릿지 타입 {@code FoodDetectedItem.bbox} 가 이 형식이다.
   *
   * <p>여백에 걸친 박스는 0~1 로 클램프한다.
   */
  public float[] toSourceXywh(FoodDetection detection) {
    float left = restoreX(detection.x1);
    float top = restoreY(detection.y1);
    float right = restoreX(detection.x2);
    float bottom = restoreY(detection.y2);
    return new float[] {left, top, Math.max(0f, right - left), Math.max(0f, bottom - top)};
  }

  private float restoreX(float normalized) {
    float pixels = normalized * inputSize - padX;
    return clamp01(pixels / (sourceWidth * scale));
  }

  private float restoreY(float normalized) {
    float pixels = normalized * inputSize - padY;
    return clamp01(pixels / (sourceHeight * scale));
  }

  private static float clamp01(float value) {
    if (value < 0f) {
      return 0f;
    }
    return Math.min(value, 1f);
  }
}
