package com.camaplus.app.nativebridge.foodvision;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 탐지 박스를 화면에 보여줄 "음식 목록"으로 정리한다.
 *
 * <p>같은 음식이 여러 박스로 잡히면 항목을 여러 개 만들지 않고 <b>1개 항목 + quantity</b> 로 묶는다.
 * 사용자가 수정해야 할 줄 수를 줄이는 것이 목적이다.
 *
 * <p>정렬은 {@code confidence × bboxArea} 내림차순이다. 접시의 주요리가 위로 오게 하려는 의도로,
 * 확신이 높아도 아주 작게 잡힌 박스는 뒤로 밀린다.
 *
 * <p>같은 클래스 안에서 중복 객체를 다시 합치지는 않는다. {@link FoodVisionDecoder} 의 NMS 가 IoU
 * 0.45 로 이미 억제했으므로, 여기 도달한 같은 클래스 박스들은 서로 IoU 0.45 이하인 별개 객체다.
 */
public final class FoodVisionAggregator {

  private FoodVisionAggregator() {}

  public static List<AggregatedItem> aggregate(List<FoodDetection> detections, int maxItems) {
    Map<Integer, AggregatedItem> grouped = new LinkedHashMap<>();
    for (FoodDetection detection : detections) {
      AggregatedItem existing = grouped.get(detection.classId);
      if (existing == null) {
        grouped.put(detection.classId, new AggregatedItem(detection));
      } else {
        existing.add(detection);
      }
    }

    List<AggregatedItem> items = new ArrayList<>(grouped.values());
    items.sort(Comparator.comparingDouble(AggregatedItem::rank).reversed());
    if (maxItems > 0 && items.size() > maxItems) {
      return new ArrayList<>(items.subList(0, maxItems));
    }
    return items;
  }

  /** 하나의 음식 항목. {@code representative} 는 그룹에서 confidence 가 가장 높은 박스다. */
  public static final class AggregatedItem {
    public final int classId;
    private FoodDetection representative;
    private int quantity;

    AggregatedItem(FoodDetection first) {
      this.classId = first.classId;
      this.representative = first;
      this.quantity = 1;
    }

    void add(FoodDetection detection) {
      quantity++;
      if (detection.confidence > representative.confidence) {
        representative = detection;
      }
    }

    public FoodDetection representative() {
      return representative;
    }

    public int quantity() {
      return quantity;
    }

    public float confidence() {
      return representative.confidence;
    }

    double rank() {
      return representative.confidence * representative.area();
    }
  }
}
