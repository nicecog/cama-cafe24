package com.camaplus.app.nativebridge.foodvision;

/**
 * 디코더가 낸 단일 탐지 박스.
 *
 * <p>좌표는 letterbox 된 <b>모델 입력 기준 정규화(0~1)</b> 값이다. 원본 이미지 좌표로 되돌리는
 * 것은 {@link LetterboxGeometry} 가 담당한다.
 */
public final class FoodDetection {

  public final int classId;
  public final float confidence;
  public final float x1;
  public final float y1;
  public final float x2;
  public final float y2;

  /** 차선 후보 (자기 자신 포함, confidence 내림차순). 한식 혼동 대응용. */
  public final int[] candidateClassIds;
  public final float[] candidateScores;

  public FoodDetection(
      int classId,
      float confidence,
      float x1,
      float y1,
      float x2,
      float y2,
      int[] candidateClassIds,
      float[] candidateScores) {
    this.classId = classId;
    this.confidence = confidence;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.candidateClassIds = candidateClassIds;
    this.candidateScores = candidateScores;
  }

  public float width() {
    return Math.max(0f, x2 - x1);
  }

  public float height() {
    return Math.max(0f, y2 - y1);
  }

  public float area() {
    return width() * height();
  }

  /** 두 박스의 IoU. NMS 와 중복 객체 판정에 공용으로 쓴다. */
  public static float iou(FoodDetection a, FoodDetection b) {
    float interX1 = Math.max(a.x1, b.x1);
    float interY1 = Math.max(a.y1, b.y1);
    float interX2 = Math.min(a.x2, b.x2);
    float interY2 = Math.min(a.y2, b.y2);

    float interW = interX2 - interX1;
    float interH = interY2 - interY1;
    if (interW <= 0f || interH <= 0f) {
      return 0f;
    }

    float intersection = interW * interH;
    float union = a.area() + b.area() - intersection;
    return union <= 0f ? 0f : intersection / union;
  }
}
