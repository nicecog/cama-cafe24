import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";

/**
 * 사용자 이름을 가져오는 공통 훅
 * 1. API 데이터(accountMeAtom)가 있으면 그 이름을 사용
 * 2. 없으면 번역 파일의 공통 키나 '회원'을 반환
 */
export function useAccountName() {
  const accountMe = useAtomValue(accountMeAtom);

  // API 데이터 -> 번역 파일(공통) -> 하드코딩 순으로 우선순위 결정
  return accountMe.data?.name || "회원";
}
