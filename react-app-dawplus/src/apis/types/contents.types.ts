/**
 * 콘텐츠 아이템
 */
export interface ContentItem {
  seq: number;
  doctorSeq: number;
  trackServiceSeq: number | null;
  diseaseSeq: number;
  diseaseName: string;
  doctorName: string;
  departmentName: string;
  title: string;
  image: string;
  contents: string;
  viewCount: number;
  enabled: boolean;
  viewed: boolean;
  removed: boolean;
  interest: string; // JSON 문자열 배열 (예: "[\"마음 돌보기\"]")
  createdAt: string;
  updatedAt: string;
  contentsUpdatedAt: string;
  progress: any | null;
  disease: string; // JSON 문자열 (Disease 객체)
  favoriteYn: "Y" | "N";
  priority: number | null;
}
