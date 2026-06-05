/** cama-plus-app WebView categoryCd → SPA 코칭 경로 (TanStack `to`) */
export const WEBVIEW_CATEGORY_TO_COACHING_PATH: Record<
  string,
  "/coaching/sleep" | "/coaching/meal" | "/coaching/physical" | "/coaching/mind"
> = {
  A: "/coaching/sleep",
  B: "/coaching/meal",
  C: "/coaching/physical",
  D: "/coaching/mind",
  E: "/coaching/physical",
};

export function resolveCoachingPathForCategory(
  categoryCd: string,
): "/coaching/sleep" | "/coaching/meal" | "/coaching/physical" | "/coaching/mind" | null {
  return WEBVIEW_CATEGORY_TO_COACHING_PATH[categoryCd.toUpperCase()] ?? null;
}
