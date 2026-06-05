// usePageTranslation.ts

import { useLocation } from "@tanstack/react-router";
import { useCallback } from "react";
import { type UseTranslationOptions, useTranslation } from "react-i18next";

/**
 * 현재 페이지 경로 기반으로 자동 namespace를 설정하는 번역 훅
 *
 * @example
 * // /home/detail 경로에서 사용 시
 * const { pt } = usePageTranslation();
 * // home.json 파일의 { detail: { test: "1" } }를 사용
 * pt('detail.test') // "1" 반환
 *
 * @param customNamespace - (선택) 커스텀 namespace. 지정하지 않으면 현재 경로의 첫 번째 세그먼트 사용
 * @param options - react-i18next의 UseTranslationOptions
 */
export function usePageTranslation(
  customNamespace?: string,
  options?: UseTranslationOptions<any>,
) {
  const location = useLocation();

  // 현재 경로에서 첫 번째 세그먼트 추출 (예: /home/detail -> home)
  const autoNamespace =
    location.pathname.split("/").filter(Boolean)[0] || "common";

  // customNamespace가 제공되면 사용, 아니면 자동 추출된 namespace 사용
  const namespace = customNamespace || autoNamespace;

  const { t, i18n } = useTranslation(namespace, options);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  /**
   * pt(key, options)
   * key: string | string[]
   * options: TOptions (i18next의 옵션 타입)
   */
  const pt = useCallback(
    (key: string, opts?: Record<string, unknown>) => t(key, opts),
    [t],
  );

  return { pt, changeLanguage, currentLanguage, namespace };
}
