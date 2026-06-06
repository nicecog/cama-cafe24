import { atomWithReset } from "jotai/utils";

export type WellbeingType = {
  seq?: number;
  wellbeingCategoryCd: string;
  wellbeingCategoryNm: string;
  companyName: string;
  companyDescription: string;
  title: string;
  contents: string;
  thumbnail: string;
  address: string;
  phoneNumber: string;
  homepage: string;
  sns: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  priority: number | string;
};

// Insert 시 사용하는 타입 (seq, createdAt, updatedAt 제외, lang 추가)
export type WellbeingInsertType = Omit<WellbeingType, 'seq' | 'createdAt' | 'updatedAt'> & {
  lang?: string; // API 전송 시에만 추가
};

export const wellbeingAtom = atomWithReset<WellbeingType>({
  wellbeingCategoryCd: "A2",
  wellbeingCategoryNm: "",
  companyName: "",
  companyDescription: "",
  title: "",
  contents: "",
  thumbnail: "",
  address: "",
  phoneNumber: "",
  homepage: "",
  sns: "",
  createdAt: "",
  updatedAt: "",
  enabled: false,
  priority: 1,
});

export const wellbeingSearchInfoAtom = atomWithReset({
  searchType: "companyName",
  searchText: "",
  page: "1",
  lang : "KO"
});
