package com.camaplus.app.nativebridge.foodvision;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * YOLO26n Int8 TFLite 출력을 탐지 목록으로 디코드한다.
 *
 * <p>실측한 출력 규격 (`scripts/food-calorie/probe_tflite_output.py`):
 *
 * <pre>
 *   shape   = [1, 4 + numClasses, numAnchors]   (416 → 66 x 3549, 320 → 66 x 2100)
 *   ch 0..3 = cx, cy, w, h   — 입력 기준 정규화 0~1 (픽셀 아님)
 *   ch 4..  = 클래스별 sigmoid 점수 0~1 (합이 1이 아닌 multi-label)
 * </pre>
 *
 * <p><b>NMS 는 모델에 포함되어 있지 않다.</b> export 시 {@code nms=True} 를 주지 않았으므로 같은
 * 객체가 10개 안팎의 인접 앵커로 중복 출력된다. 따라서 여기서 class-wise NMS 를 수행한다.
 *
 * <p>Int8 양자화 때문에 점수 상한이 약 0.944 다. 임계값은 이 상한을 기준으로 해석한다.
 */
public final class FoodVisionDecoder {

  /** 항목으로 채택할 최소 confidence. */
  public static final float DEFAULT_MIN_CONFIDENCE = 0.35f;

  /** 차선 후보로 보여줄 최소 confidence. */
  public static final float CANDIDATE_MIN_CONFIDENCE = 0.20f;

  public static final float NMS_IOU_THRESHOLD = 0.45f;

  public static final int MAX_CANDIDATES = 3;

  /** bbox 가 차지하는 선행 채널 수. */
  public static final int BOX_CHANNELS = 4;

  /** 디코드 단계에서 유지할 박스 상한. 병리적인 입력에서 NMS 비용이 폭발하지 않게 막는다. */
  private static final int MAX_RAW_DETECTIONS = 300;

  private FoodVisionDecoder() {}

  /**
   * @param output {@code [4 + numClasses][numAnchors]} — 배치 차원을 제거한 텐서
   * @param minConfidence 채택 임계값
   * @param includeCandidates 차선 후보 계산 여부
   */
  public static List<FoodDetection> decode(
      float[][] output, float minConfidence, boolean includeCandidates) {
    if (output == null || output.length <= BOX_CHANNELS) {
      return Collections.emptyList();
    }

    int numClasses = output.length - BOX_CHANNELS;
    int numAnchors = output[0].length;

    List<FoodDetection> raw = new ArrayList<>();
    for (int anchor = 0; anchor < numAnchors; anchor++) {
      int bestClass = -1;
      float bestScore = 0f;
      for (int cls = 0; cls < numClasses; cls++) {
        float score = output[BOX_CHANNELS + cls][anchor];
        if (score > bestScore) {
          bestScore = score;
          bestClass = cls;
        }
      }

      if (bestClass < 0 || bestScore < minConfidence) {
        continue;
      }

      float cx = output[0][anchor];
      float cy = output[1][anchor];
      float w = output[2][anchor];
      float h = output[3][anchor];
      if (w <= 0f || h <= 0f) {
        continue;
      }

      int[] candidateIds;
      float[] candidateScores;
      if (includeCandidates) {
        candidateIds = new int[MAX_CANDIDATES];
        candidateScores = new float[MAX_CANDIDATES];
        int found = topCandidates(output, anchor, numClasses, candidateIds, candidateScores);
        if (found < MAX_CANDIDATES) {
          candidateIds = trim(candidateIds, found);
          candidateScores = trim(candidateScores, found);
        }
      } else {
        candidateIds = new int[] {bestClass};
        candidateScores = new float[] {bestScore};
      }

      raw.add(
          new FoodDetection(
              bestClass,
              bestScore,
              cx - w / 2f,
              cy - h / 2f,
              cx + w / 2f,
              cy + h / 2f,
              candidateIds,
              candidateScores));
    }

    if (raw.isEmpty()) {
      return Collections.emptyList();
    }

    raw.sort(Comparator.comparingDouble((FoodDetection item) -> item.confidence).reversed());
    if (raw.size() > MAX_RAW_DETECTIONS) {
      raw = new ArrayList<>(raw.subList(0, MAX_RAW_DETECTIONS));
    }
    return nonMaxSuppression(raw, NMS_IOU_THRESHOLD);
  }

  /**
   * class-wise greedy NMS. 입력은 confidence 내림차순으로 정렬되어 있어야 한다.
   *
   * <p>서로 다른 클래스는 억제하지 않는다. 한 접시에 겹쳐 담긴 반찬을 각각 남겨야 하기 때문이다.
   */
  static List<FoodDetection> nonMaxSuppression(List<FoodDetection> sorted, float iouThreshold) {
    List<FoodDetection> kept = new ArrayList<>();
    boolean[] suppressed = new boolean[sorted.size()];

    for (int i = 0; i < sorted.size(); i++) {
      if (suppressed[i]) {
        continue;
      }
      FoodDetection candidate = sorted.get(i);
      kept.add(candidate);

      for (int j = i + 1; j < sorted.size(); j++) {
        if (suppressed[j]) {
          continue;
        }
        FoodDetection other = sorted.get(j);
        if (other.classId == candidate.classId
            && FoodDetection.iou(candidate, other) > iouThreshold) {
          suppressed[j] = true;
        }
      }
    }
    return kept;
  }

  /** 상위 {@link #MAX_CANDIDATES} 개 클래스를 채워 넣고 채운 개수를 돌려준다. */
  private static int topCandidates(
      float[][] output, int anchor, int numClasses, int[] outIds, float[] outScores) {
    int found = 0;
    for (int cls = 0; cls < numClasses; cls++) {
      float score = output[BOX_CHANNELS + cls][anchor];
      if (score < CANDIDATE_MIN_CONFIDENCE) {
        continue;
      }

      // 삽입 정렬: 후보가 3개뿐이라 정렬 비용이 무의미하다
      int position = found < MAX_CANDIDATES ? found : MAX_CANDIDATES - 1;
      if (found >= MAX_CANDIDATES && score <= outScores[position]) {
        continue;
      }
      while (position > 0 && outScores[position - 1] < score) {
        outIds[position] = outIds[position - 1];
        outScores[position] = outScores[position - 1];
        position--;
      }
      outIds[position] = cls;
      outScores[position] = score;
      if (found < MAX_CANDIDATES) {
        found++;
      }
    }
    return found;
  }

  private static int[] trim(int[] source, int length) {
    int[] result = new int[length];
    System.arraycopy(source, 0, result, 0, length);
    return result;
  }

  private static float[] trim(float[] source, int length) {
    float[] result = new float[length];
    System.arraycopy(source, 0, result, 0, length);
    return result;
  }
}
