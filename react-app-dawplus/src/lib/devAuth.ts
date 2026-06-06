const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

export function isDevAuthBypassEnabled(): boolean {
  if (!import.meta.env.DEV) {
    return false;
  }

  const raw = import.meta.env.VITE_DEV_BYPASS_AUTH;
  if (typeof raw !== "string") {
    return false;
  }

  return TRUE_VALUES.has(raw.trim().toLowerCase());
}

export function getDevAuthBypassLoginId(): string {
  if (!isDevAuthBypassEnabled()) {
    return "";
  }

  const loginId = import.meta.env.VITE_ACCOUNT_ID;
  return typeof loginId === "string" ? loginId.trim() : "";
}
