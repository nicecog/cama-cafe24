import { atom } from "jotai";
import type { WellbeingResourceItem } from "@/apis/types";

/**
 * 웰빙 필터 선택 상태
 * 선택된 카테고리 코드 (빈 문자열 = 전체)
 */
export const wellbeingFilterAtom = atom<string>("");

/**
 * 웰빙 검색어 상태
 */
export const wellbeingSearchTextAtom = atom<string>("");

export const wellbeingDetailOpenAtom = atom<boolean>(false);

export const wellbeingDetailItemAtom = atom<WellbeingResourceItem | null>(null);
