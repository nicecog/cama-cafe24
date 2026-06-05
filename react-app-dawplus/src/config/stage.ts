/**
 * API / WebView 스테이지 (cama-plus-app stage.ts 와 동일 정책)
 *
 * LOCAL / DEV / PROD 모두 Cafe24 단일 호스트 사용.
 */
export type Stage = "LOCAL" | "DEV" | "PROD";

/** 로컬 개발: `LOCAL`, 운영 연동: `PROD` */
export const currentStage: Stage = "PROD";

const cafe24ApiHost = "https://camaplus.cafe24.com/";
const cafe24AdminHost = "https://camaplus.cafe24.com";

/** 필요 시 임시 API URL override */
export const localApiBaseUrlOverride: string | null = null;

export function resolveApiBaseUrl(stage: Stage): string {
  if (stage === "LOCAL") {
    return localApiBaseUrlOverride ?? cafe24ApiHost;
  }
  if (stage === "DEV") {
    return cafe24ApiHost;
  }
  return cafe24ApiHost;
}

export function resolveAdminUrl(_stage: Stage): string {
  return cafe24AdminHost;
}

/** 절대 URL 예시 생성 (apiData.json, 문서용) */
export function apiExampleUrl(path: string): string {
  const base = resolveApiBaseUrl(currentStage).replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
