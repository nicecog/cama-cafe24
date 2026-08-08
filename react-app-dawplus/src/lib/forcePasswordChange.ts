const FORCE_PASSWORD_CHANGE_KEY = "cama.forcePasswordChange";

/** 비밀번호 초기화 직후: 다음 로그인 시 비밀번호 변경을 강제한다. */
export function markForcePasswordChange(loginId: string) {
  const value = loginId.trim();
  if (!value || typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(FORCE_PASSWORD_CHANGE_KEY, value);
}

/** 로그인 성공 시 1회 소비. loginId가 일치하면 true. */
export function consumeForcePasswordChange(loginId: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const stored = sessionStorage.getItem(FORCE_PASSWORD_CHANGE_KEY);
  if (!stored || stored !== loginId.trim()) return false;
  sessionStorage.removeItem(FORCE_PASSWORD_CHANGE_KEY);
  return true;
}
