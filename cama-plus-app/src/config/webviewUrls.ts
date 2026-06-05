import { resolveAdminUrl, currentStage } from '@/config/stage';

/** react-app-dawplus (Cafe24 VPS) WebView 베이스 — stage.ts 와 동일 호스트 */
export const patientWebBaseUrl = resolveAdminUrl(currentStage);

/**
 * RN WebView → SPA 직접 경로 (webview 리다이렉트·중복 bootstrap 생략)
 * categoryMap.ts 와 동일
 */
const COACHING_SPA_PATH: Record<string, string> = {
  A: '/coaching/sleep',
  B: '/coaching/meal',
  C: '/coaching/physical',
  D: '/coaching/mind',
  E: '/coaching/physical',
};

/** SPA _auth 가 wvLoginId 로 WebView 세션 복구 */
function withWvLoginId(url: string, loginId?: string | null): string {
  if (!loginId?.trim()) {
    return url;
  }
  const q = `wvLoginId=${encodeURIComponent(loginId.trim())}`;
  return url.includes('?') ? `${url}&${q}` : `${url}?${q}`;
}

export const patientWebviewUrls = {
  /** 코칭 허브 — SPA 직접 진입 (빠름) */
  coachingHub: (loginId: string) =>
    withWvLoginId(`${patientWebBaseUrl}/coaching/`, loginId),
  /** 수면/식사 등 — SPA 직접 진입 */
  coachingCategory: (categoryCd: string, loginId: string) => {
    const spaPath = COACHING_SPA_PATH[categoryCd.toUpperCase()];
    if (spaPath) {
      return withWvLoginId(`${patientWebBaseUrl}${spaPath}`, loginId);
    }
    return withWvLoginId(
      `${patientWebBaseUrl}/webview/coaching/${encodeURIComponent(categoryCd)}/${encodeURIComponent(loginId)}`,
      loginId,
    );
  },
  wellbeing: (loginId: string) =>
    withWvLoginId(`${patientWebBaseUrl}/wellbeing`, loginId),
  help: () => `${patientWebBaseUrl}/webview/help`,
  treatment: (seq: number | string) =>
    `${patientWebBaseUrl}/webview/treatment/${encodeURIComponent(String(seq))}`,
};
