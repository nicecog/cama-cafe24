package com.camaplus.app.nativebridge.foodvision;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;

import org.json.JSONException;
import org.tensorflow.lite.Delegate;
import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.gpu.CompatibilityList;
import org.tensorflow.lite.gpu.GpuDelegate;
import org.tensorflow.lite.nnapi.NnApiDelegate;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.List;

import android.content.res.AssetFileDescriptor;

/**
 * 온디바이스 음식 인식 엔진. 모델 로드·가속기 폴백·추론·후처리를 담당한다.
 *
 * <p>사진은 이 클래스 밖으로 나가지 않는다. 서버로 보내는 것은 인식된 목록뿐이다.
 *
 * <p>스레드: {@link Interpreter} 는 스레드 안전하지 않으므로 모든 진입점을 {@code synchronized} 로
 * 묶는다. 호출부(브릿지 모듈)가 단일 워커 스레드에서만 부르므로 경합은 사실상 없다.
 */
public final class FoodVisionEngine {

  private static final String TAG = "FoodVisionEngine";

  /** 모델 산출물 식별자. 서버에 `clientMeta.modelVersion` 으로 기록된다. */
  public static final String MODEL_VERSION = "yolo26n-kd-int8-1.0";

  private static final int CPU_THREADS = 4;

  private final Context context;

  private FoodCatalog catalog;
  private Interpreter interpreter;
  private Delegate delegate;
  private FoodVisionProfile loadedProfile;
  private String accelerator = "cpu";

  public FoodVisionEngine(Context context) {
    this.context = context.getApplicationContext();
  }

  /** 카탈로그만 읽어 모델 로드 없이 정보를 돌려준다. 화면 진입 시 안내 문구용. */
  public synchronized Info info(String appVersion) throws IOException, JSONException {
    FoodCatalog loaded = ensureCatalog();
    FoodVisionProfile profile = FoodVisionProfile.resolve(context, appVersion);
    return new Info(MODEL_VERSION, loaded.version(), profile.key, loaded.size());
  }

  /**
   * 이미지 한 장을 분석한다.
   *
   * @param requestedProfile null 이면 저장된 프로필/기기 사양으로 자동 결정
   * @param maxItems 0 이하면 제한 없음
   */
  public synchronized Result analyze(
      Uri imageUri,
      String appVersion,
      FoodVisionProfile requestedProfile,
      float minConfidence,
      int maxItems,
      boolean includeCandidates)
      throws IOException, JSONException {

    FoodCatalog loaded = ensureCatalog();
    FoodVisionProfile profile =
        requestedProfile != null
            ? requestedProfile
            : FoodVisionProfile.resolve(context, appVersion);
    Interpreter active = ensureInterpreter(profile);

    int[] outputShape = active.getOutputTensor(0).shape();
    int channels = outputShape[1];
    int anchors = outputShape[2];
    int modelClasses = channels - FoodVisionDecoder.BOX_CHANNELS;
    if (modelClasses != loaded.size()) {
      // 카탈로그와 모델이 어긋난 상태로 추론하면 전부 다른 음식으로 표시된다
      throw new IllegalStateException(
          "모델 클래스 수("
              + modelClasses
              + ") 와 카탈로그("
              + loaded.size()
              + ") 가 다릅니다. food_catalog 재생성이 필요합니다.");
    }

    Bitmap bitmap = FoodImagePreprocessor.loadOriented(context, imageUri);
    int sourceWidth = bitmap.getWidth();
    int sourceHeight = bitmap.getHeight();
    LetterboxGeometry geometry =
        new LetterboxGeometry(profile.inputSize, sourceWidth, sourceHeight);

    float[][][] output = new float[1][channels][anchors];
    long startedAt;
    long elapsedMs;
    try {
      ByteBuffer input =
          FoodImagePreprocessor.toInputBuffer(bitmap, profile.inputSize, geometry);
      startedAt = System.nanoTime();
      active.run(input, output);
      elapsedMs = (System.nanoTime() - startedAt) / 1_000_000L;
    } finally {
      bitmap.recycle();
    }

    if (elapsedMs > FoodVisionProfile.DOWNGRADE_THRESHOLD_MS
        && profile == FoodVisionProfile.INPUT_416) {
      // 다음 실행부터 320 으로 내려간다 (이번 결과는 그대로 사용)
      FoodVisionProfile.remember(context, FoodVisionProfile.INPUT_320);
      Log.i(TAG, "inference " + elapsedMs + "ms → 320-int8 프로필로 강등");
    }

    List<FoodDetection> detections =
        FoodVisionDecoder.decode(output[0], minConfidence, includeCandidates);
    List<FoodVisionAggregator.AggregatedItem> items =
        FoodVisionAggregator.aggregate(detections, maxItems);

    return new Result(
        items,
        geometry,
        loaded,
        MODEL_VERSION,
        loaded.version(),
        profile.key,
        elapsedMs,
        sourceWidth,
        sourceHeight,
        accelerator);
  }

  public synchronized void close() {
    if (interpreter != null) {
      interpreter.close();
      interpreter = null;
    }
    closeDelegate();
    loadedProfile = null;
  }

  private FoodCatalog ensureCatalog() throws IOException, JSONException {
    if (catalog == null) {
      catalog = FoodCatalog.loadFromAssets(context);
    }
    return catalog;
  }

  private Interpreter ensureInterpreter(FoodVisionProfile profile) throws IOException {
    if (interpreter != null && loadedProfile == profile) {
      return interpreter;
    }
    if (interpreter != null) {
      interpreter.close();
      interpreter = null;
      closeDelegate();
    }

    MappedByteBuffer model = loadModel(profile.assetPath);

    // NNAPI → GPU → CPU 순서로 폴백한다. 기기·드라이버에 따라 앞의 두 개가
    // 로드 단계에서 바로 실패하는 경우가 흔하다.
    interpreter = tryNnApi(model);
    if (interpreter == null) {
      interpreter = tryGpu(model);
    }
    if (interpreter == null) {
      Interpreter.Options options = new Interpreter.Options();
      options.setNumThreads(CPU_THREADS);
      interpreter = new Interpreter(model, options);
      accelerator = "cpu";
    }

    loadedProfile = profile;
    Log.i(TAG, "loaded " + profile.key + " on " + accelerator);
    return interpreter;
  }

  private Interpreter tryNnApi(MappedByteBuffer model) {
    NnApiDelegate candidate = null;
    try {
      candidate = new NnApiDelegate();
      Interpreter.Options options = new Interpreter.Options();
      options.addDelegate(candidate);
      Interpreter created = new Interpreter(model, options);
      delegate = candidate;
      accelerator = "nnapi";
      return created;
    } catch (Exception | Error e) {
      Log.w(TAG, "NNAPI delegate 사용 불가: " + e.getMessage());
      if (candidate != null) {
        candidate.close();
      }
      return null;
    }
  }

  private Interpreter tryGpu(MappedByteBuffer model) {
    GpuDelegate candidate = null;
    try {
      CompatibilityList compatibility = new CompatibilityList();
      if (!compatibility.isDelegateSupportedOnThisDevice()) {
        return null;
      }
      candidate = new GpuDelegate(compatibility.getBestOptionsForThisDevice());
      Interpreter.Options options = new Interpreter.Options();
      options.addDelegate(candidate);
      Interpreter created = new Interpreter(model, options);
      delegate = candidate;
      accelerator = "gpu";
      return created;
    } catch (Exception | Error e) {
      Log.w(TAG, "GPU delegate 사용 불가: " + e.getMessage());
      if (candidate != null) {
        candidate.close();
      }
      return null;
    }
  }

  private void closeDelegate() {
    if (delegate == null) {
      return;
    }
    if (delegate instanceof NnApiDelegate) {
      ((NnApiDelegate) delegate).close();
    } else if (delegate instanceof GpuDelegate) {
      ((GpuDelegate) delegate).close();
    }
    delegate = null;
    accelerator = "cpu";
  }

  /** assets 의 tflite 를 mmap 한다. {@code aaptOptions.noCompress "tflite"} 가 전제다. */
  private MappedByteBuffer loadModel(String assetPath) throws IOException {
    try (AssetFileDescriptor descriptor = context.getAssets().openFd(assetPath);
        FileInputStream stream = descriptor.createInputStream()) {
      FileChannel channel = stream.getChannel();
      return channel.map(
          FileChannel.MapMode.READ_ONLY,
          descriptor.getStartOffset(),
          descriptor.getDeclaredLength());
    }
  }

  /** {@code getFoodVisionInfo} 응답. */
  public static final class Info {
    public final String modelVersion;
    public final String catalogVersion;
    public final String profile;
    public final int classCount;

    Info(String modelVersion, String catalogVersion, String profile, int classCount) {
      this.modelVersion = modelVersion;
      this.catalogVersion = catalogVersion;
      this.profile = profile;
      this.classCount = classCount;
    }
  }

  /** {@code analyzeFoodImage} 응답 재료. 브릿지 변환은 호출부가 한다. */
  public static final class Result {
    public final List<FoodVisionAggregator.AggregatedItem> items;
    public final LetterboxGeometry geometry;
    public final FoodCatalog catalog;
    public final String modelVersion;
    public final String catalogVersion;
    public final String profile;
    public final long inferenceMs;
    public final int imageWidth;
    public final int imageHeight;
    public final String accelerator;

    Result(
        List<FoodVisionAggregator.AggregatedItem> items,
        LetterboxGeometry geometry,
        FoodCatalog catalog,
        String modelVersion,
        String catalogVersion,
        String profile,
        long inferenceMs,
        int imageWidth,
        int imageHeight,
        String accelerator) {
      this.items = items;
      this.geometry = geometry;
      this.catalog = catalog;
      this.modelVersion = modelVersion;
      this.catalogVersion = catalogVersion;
      this.profile = profile;
      this.inferenceMs = inferenceMs;
      this.imageWidth = imageWidth;
      this.imageHeight = imageHeight;
      this.accelerator = accelerator;
    }
  }
}
