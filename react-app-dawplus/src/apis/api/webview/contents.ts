import { api } from "../../client";
import type { ApiResponse, ContentItem, WebviewContentItem } from "../../types";

/**
 * 치료정보 리스트 조회
 * POST /api/webview/contents/list
 */
export const fetchContentsList = async (
  acSeq: string,
): Promise<ApiResponse<WebviewContentItem[]>> => {
  return api
    .post("api/webview/contents/list", {
      json: { acSeq },
    })
    .json();
};

/**
 * 치료정보 리스트 검색
 * POST /api/webview/contents/list
 */
export const searchContentsList = async (
  acSeq?: string | number,
  searchText?: string,
  diseaseSeq?: string,
): Promise<ApiResponse<WebviewContentItem[]>> => {
  return api
    .post("api/webview/contents/list", {
      json: { acSeq, searchText, diseaseSeq },
    })
    .json();
};

/**
 * 즐겨찾기 목록 조회
 * GET /api/webview/contents/favoriteList
 * @param acSeq - 계정 seq
 */
export const getFavoriteList = async (
  acSeq: string,
): Promise<ApiResponse<WebviewContentItem[]>> => {
  return api.get(`api/webview/contents/favoriteList?acSeq=${acSeq}`).json();
};

/**
 * 즐겨찾기 저장 (추가/삭제)
 * PUT /api/contents/favoriteSave
 * @param accountSeq - 계정 seq
 * @param type - 타입 (C: 추가, D: 삭제)
 * @param contentsSeq - 컨텐츠 seq
 */
export const saveFavorite = async (
  accountSeq: number,
  type: "C" | "D",
  contentsSeq: number,
): Promise<ApiResponse> => {
  return api
    .put("api/webview/contents/favoriteSave", {
      json: { accountSeq, type, contentsSeq },
    })
    .json();
};

/**
 * Contents 상세 조회
 * GET /api/contents/{seq}/view
 * @param seq - 컨텐츠 seq
 */
export const getContentDetail = async (
  seq: string,
): Promise<ApiResponse<ContentItem>> => {
  return api.get(`api/webview/contents/${seq}/view`).json();
};
