package com.camaplus.app.nativebridge.foodvision;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.IOException;

/**
 * 음식 사진 촬영·선택 인텐트와 임시 파일을 다룬다.
 *
 * <p>촬영 원본은 캐시 디렉터리에만 두고 추론 직후 {@link #deleteQuietly(File)} 로 지운다. 갤러리에
 * 남기지 않는 것은 의도된 동작이다 (사용자가 의식하지 못한 음식 사진이 앨범에 쌓이지 않게).
 */
public final class FoodPhotoCapture {

  private static final String CACHE_DIR = "foodvision";
  private static final String AUTHORITY_SUFFIX = ".fileprovider";

  private FoodPhotoCapture() {}

  /** 카메라 앱이 결과를 쓸 임시 파일. */
  public static File createTempFile(Context context) throws IOException {
    File directory = new File(context.getCacheDir(), CACHE_DIR);
    if (!directory.exists() && !directory.mkdirs()) {
      throw new IOException("임시 디렉터리를 만들 수 없습니다: " + directory);
    }
    return File.createTempFile("meal_", ".jpg", directory);
  }

  public static Uri toContentUri(Context context, File file) {
    return FileProvider.getUriForFile(
        context, context.getPackageName() + AUTHORITY_SUFFIX, file);
  }

  /** 촬영 인텐트. {@code output} 은 {@link #toContentUri} 로 만든 URI 여야 한다. */
  public static Intent cameraIntent(Uri output) {
    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
    intent.putExtra(MediaStore.EXTRA_OUTPUT, output);
    intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
    return intent;
  }

  /** 앨범 선택 인텐트. 권한 없이 접근 가능한 시스템 피커를 쓴다. */
  public static Intent libraryIntent() {
    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
    intent.setType("image/*");
    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    return intent;
  }

  public static void deleteQuietly(File file) {
    if (file != null && file.exists()) {
      // 실패해도 캐시 디렉터리라 OS 가 정리한다
      file.delete();
    }
  }
}
