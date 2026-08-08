package com.camaplus.app.nativebridge.foodvision;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.net.Uri;

import androidx.exifinterface.media.ExifInterface;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * 촬영/선택한 이미지를 모델 입력 텐서로 바꾼다.
 *
 * <p>실측한 입력 규격은 {@code [1, 3, size, size] float32, NCHW, RGB/255} 다. NHWC uint8 이 아니므로
 * 채널 순서를 바꿔 담아야 한다.
 */
public final class FoodImagePreprocessor {

  /** 추론 전 축소 한도. 장변 기준. 원본 그대로 디코드하면 메모리와 시간이 낭비된다. */
  public static final int MAX_SOURCE_DIMENSION = 1280;

  /** letterbox 여백 색 (YOLO 관례). */
  private static final int PAD_COLOR = Color.rgb(114, 114, 114);

  private FoodImagePreprocessor() {}

  /** EXIF 회전을 적용하고 장변을 {@link #MAX_SOURCE_DIMENSION} 이하로 줄인 비트맵. */
  public static Bitmap loadOriented(Context context, Uri uri) throws IOException {
    int rotation = readExifRotation(context, uri);

    BitmapFactory.Options bounds = new BitmapFactory.Options();
    bounds.inJustDecodeBounds = true;
    try (InputStream stream = openStream(context, uri)) {
      BitmapFactory.decodeStream(stream, null, bounds);
    }
    if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
      throw new IOException("이미지를 디코드할 수 없습니다: " + uri);
    }

    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inSampleSize = sampleSizeFor(bounds.outWidth, bounds.outHeight);
    options.inPreferredConfig = Bitmap.Config.ARGB_8888;

    Bitmap decoded;
    try (InputStream stream = openStream(context, uri)) {
      decoded = BitmapFactory.decodeStream(stream, null, options);
    }
    if (decoded == null) {
      throw new IOException("이미지를 디코드할 수 없습니다: " + uri);
    }

    Bitmap scaled = scaleDown(decoded);
    return rotate(scaled, rotation);
  }

  /**
   * letterbox 후 NCHW float32 버퍼로 채운다.
   *
   * @param inputSize 정사각 입력 한 변 (416 / 320)
   */
  public static ByteBuffer toInputBuffer(Bitmap source, int inputSize, LetterboxGeometry geometry) {
    Bitmap canvasBitmap = Bitmap.createBitmap(inputSize, inputSize, Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(canvasBitmap);
    canvas.drawColor(PAD_COLOR);

    Paint paint = new Paint(Paint.FILTER_BITMAP_FLAG);
    paint.setAntiAlias(true);
    Rect destination =
        new Rect(
            geometry.padX,
            geometry.padY,
            geometry.padX + geometry.scaledWidth(),
            geometry.padY + geometry.scaledHeight());
    canvas.drawBitmap(source, null, destination, paint);

    int pixelCount = inputSize * inputSize;
    int[] pixels = new int[pixelCount];
    canvasBitmap.getPixels(pixels, 0, inputSize, 0, 0, inputSize, inputSize);
    canvasBitmap.recycle();

    ByteBuffer buffer = ByteBuffer.allocateDirect(pixelCount * 3 * 4);
    buffer.order(ByteOrder.nativeOrder());

    // NCHW: R 평면 전체 → G 평면 전체 → B 평면 전체
    for (int shift : new int[] {16, 8, 0}) {
      for (int index = 0; index < pixelCount; index++) {
        buffer.putFloat(((pixels[index] >> shift) & 0xFF) / 255f);
      }
    }
    buffer.rewind();
    return buffer;
  }

  private static InputStream openStream(Context context, Uri uri) throws IOException {
    InputStream stream = context.getContentResolver().openInputStream(uri);
    if (stream == null) {
      throw new IOException("이미지를 열 수 없습니다: " + uri);
    }
    return stream;
  }

  private static int readExifRotation(Context context, Uri uri) {
    try (InputStream stream = openStream(context, uri)) {
      ExifInterface exif = new ExifInterface(stream);
      switch (exif.getAttributeInt(
          ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
        case ExifInterface.ORIENTATION_ROTATE_90:
          return 90;
        case ExifInterface.ORIENTATION_ROTATE_180:
          return 180;
        case ExifInterface.ORIENTATION_ROTATE_270:
          return 270;
        default:
          return 0;
      }
    } catch (IOException e) {
      // EXIF 가 없거나 읽기 실패하면 회전 없이 진행한다
      return 0;
    }
  }

  private static int sampleSizeFor(int width, int height) {
    int longest = Math.max(width, height);
    int sampleSize = 1;
    while (longest / (sampleSize * 2) >= MAX_SOURCE_DIMENSION) {
      sampleSize *= 2;
    }
    return sampleSize;
  }

  private static Bitmap scaleDown(Bitmap source) {
    int longest = Math.max(source.getWidth(), source.getHeight());
    if (longest <= MAX_SOURCE_DIMENSION) {
      return source;
    }
    float ratio = (float) MAX_SOURCE_DIMENSION / longest;
    int width = Math.max(1, Math.round(source.getWidth() * ratio));
    int height = Math.max(1, Math.round(source.getHeight() * ratio));
    Bitmap scaled = Bitmap.createScaledBitmap(source, width, height, true);
    if (scaled != source) {
      source.recycle();
    }
    return scaled;
  }

  private static Bitmap rotate(Bitmap source, int degrees) {
    if (degrees == 0) {
      return source;
    }
    Matrix matrix = new Matrix();
    matrix.postRotate(degrees);
    Bitmap rotated =
        Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
    if (rotated != source) {
      source.recycle();
    }
    return rotated;
  }
}
