/**
 * 진찰시 문의사항 — 내용에서 규칙 기반 제목 생성 (외부 AI 없이).
 * 앞부분을 짧게 잘라 목록/전송용 제목으로 사용합니다.
 */
export function buildInquiryTitleFromContent(
  content: string,
  maxLength = 28,
): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "문의사항";
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
