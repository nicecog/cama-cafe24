package com.camaplus.app.nativebridge.foodvision;

import android.content.Context;
import android.content.res.AssetManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * 번들에 포함된 {@code food_catalog.v1.json} 을 읽어 모델 클래스 인덱스 → 음식 정보로 매핑한다.
 *
 * <p><b>주의</b>: 여기서 쓰는 {@code classId} 는 <b>모델 출력 인덱스(0..61)</b> 이고, 서버
 * {@code cm_food_class.class_id}(0..99) 와 다르다. 학습 데이터가 없어 제외된 38종 때문에 인덱스가
 * 재부여되었기 때문이다. 브릿지·서버로 나가는 식별자는 항상 {@code classKey} 문자열이다.
 *
 * <p>카탈로그는 {@code scripts/food-calorie/build_food_catalog.py} 가 학습 산출물의 {@code
 * data.yaml} 과 시드 SQL 을 합쳐 생성한다.
 */
public final class FoodCatalog {

  public static final String ASSET_PATH = "foodvision/food_catalog.v1.json";

  private final String catalogVersion;
  private final FoodClass[] byClassId;

  private FoodCatalog(String catalogVersion, FoodClass[] byClassId) {
    this.catalogVersion = catalogVersion;
    this.byClassId = byClassId;
  }

  public static FoodCatalog loadFromAssets(Context context) throws IOException, JSONException {
    return loadFromAssets(context, ASSET_PATH);
  }

  public static FoodCatalog loadFromAssets(Context context, String assetPath)
      throws IOException, JSONException {
    AssetManager assets = context.getAssets();
    String json;
    try (InputStream stream = assets.open(assetPath)) {
      json = readAll(stream);
    }
    return parse(json);
  }

  static FoodCatalog parse(String json) throws JSONException {
    JSONObject root = new JSONObject(json);
    String version = root.optString("catalogVersion", "unknown");
    JSONArray classes = root.getJSONArray("classes");

    // classId 가 0..n-1 연속이라는 전제 아래 배열 인덱싱을 쓴다 (앵커당 조회가 잦다)
    FoodClass[] table = new FoodClass[classes.length()];
    for (int i = 0; i < classes.length(); i++) {
      JSONObject entry = classes.getJSONObject(i);
      int classId = entry.getInt("classId");
      if (classId < 0 || classId >= table.length) {
        throw new JSONException(
            "classId " + classId + " 가 0.." + (table.length - 1) + " 범위를 벗어났습니다");
      }
      if (table[classId] != null) {
        throw new JSONException("classId " + classId + " 가 중복되었습니다");
      }
      table[classId] =
          new FoodClass(
              classId,
              entry.getString("classKey"),
              entry.optString("nameKo", null),
              (float) entry.optDouble("servingG", 0d),
              (float) entry.optDouble("kcalPer100g", 0d),
              (float) entry.optDouble("carbPer100g", 0d),
              (float) entry.optDouble("proteinPer100g", 0d),
              (float) entry.optDouble("fatPer100g", 0d));
    }

    for (int i = 0; i < table.length; i++) {
      if (table[i] == null) {
        throw new JSONException("classId " + i + " 항목이 없습니다");
      }
    }
    return new FoodCatalog(version, table);
  }

  public String version() {
    return catalogVersion;
  }

  /** 모델 출력 채널 수 검증에 쓰는 클래스 수. */
  public int size() {
    return byClassId.length;
  }

  /** 범위를 벗어나면 null. 모델과 카탈로그가 어긋난 경우를 호출부에서 걸러낸다. */
  public FoodClass get(int classId) {
    if (classId < 0 || classId >= byClassId.length) {
      return null;
    }
    return byClassId[classId];
  }

  private static String readAll(InputStream stream) throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream(Math.max(1024, stream.available()));
    byte[] chunk = new byte[8192];
    int read;
    while ((read = stream.read(chunk)) != -1) {
      buffer.write(chunk, 0, read);
    }
    return new String(buffer.toByteArray(), StandardCharsets.UTF_8);
  }

  /** 카탈로그 1행. */
  public static final class FoodClass {
    public final int classId;
    public final String classKey;
    public final String nameKo;
    public final float servingG;
    public final float kcalPer100g;
    public final float carbPer100g;
    public final float proteinPer100g;
    public final float fatPer100g;

    FoodClass(
        int classId,
        String classKey,
        String nameKo,
        float servingG,
        float kcalPer100g,
        float carbPer100g,
        float proteinPer100g,
        float fatPer100g) {
      this.classId = classId;
      this.classKey = classKey;
      this.nameKo = nameKo;
      this.servingG = servingG;
      this.kcalPer100g = kcalPer100g;
      this.carbPer100g = carbPer100g;
      this.proteinPer100g = proteinPer100g;
      this.fatPer100g = fatPer100g;
    }

    /**
     * 화면 표시 전용 미리보기 kcal. 서버 응답이 도착하면 덮어쓰이는 값이므로 반올림만 하고 끝낸다.
     *
     * @return 계산할 수 없으면 -1
     */
    public int previewKcal(float portionFactor, int quantity) {
      if (servingG <= 0f || kcalPer100g <= 0f) {
        return -1;
      }
      float grams = servingG * portionFactor * Math.max(1, quantity);
      return Math.round(kcalPer100g * grams / 100f);
    }
  }
}
