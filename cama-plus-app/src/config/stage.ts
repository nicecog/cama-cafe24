/**
 * API / Admin WebView 스테이지.
 *
 * LOCAL — camaplus.cafe24.com
 * DEV     — camaplus.cafe24.com
 * PROD    — camaplus.cafe24.com (same-host routing: /api/*)
 *
 * 로컬 테스트: 'LOCAL' 로 설정 후 scripts/run-local-stack.ps1 참고
 */
export type Stage = 'LOCAL' | 'DEV' | 'PROD';

/** 로컬 개발 시 'LOCAL', AWS 운영 연동 시 'PROD' */
export const currentStage: Stage = 'PROD';

const localApiHost = 'https://camaplus.cafe24.com/';

/** 필요 시 임시 API URL override (기본값은 Cafe24 운영 도메인) */
export const localApiBaseUrlOverride: string | null = null;

export function resolveApiBaseUrl(stage: Stage): string {
  if (stage === 'LOCAL') {
    return localApiBaseUrlOverride ?? localApiHost;
  }
  if (stage === 'DEV') {
    return 'https://camaplus.cafe24.com/';
  }
  return 'https://camaplus.cafe24.com/';
}

export function resolveAdminUrl(stage: Stage): string {
  if (stage === 'LOCAL') {
    // WebView(코칭/치료)는 Cafe24 단일 호스트로 통일
    return 'https://camaplus.cafe24.com';
  }
  if (stage === 'DEV') {
    return 'https://camaplus.cafe24.com';
  }
  // Cafe24 doctor-web은 같은 호스트에서 /{login, webview...} 형태로 제공됨
  return 'https://camaplus.cafe24.com';
}
