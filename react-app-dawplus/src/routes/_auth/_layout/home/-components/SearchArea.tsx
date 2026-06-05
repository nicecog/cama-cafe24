import { useAtom, useSetAtom } from "jotai";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import {
  executedSearchParamsAtom,
  searchContentParmasAtom,
} from "../-atoms/homeAtom";

const CANCER_TYPES = [
  { key: "99", value: "전체" },
  { key: "2", value: "유방암" },
  { key: "3", value: "폐암" },
  { key: "4", value: "대장암" },
  { key: "6", value: "갑상선암" },
  { key: "8", value: "암(General)" },
];

export default function SearchArea() {
  const { pt } = usePageTranslation();
  const { alert } = useDialog();

  const [searchParams, setSearchParams] = useAtom(searchContentParmasAtom);
  const setExecutedSearchParams = useSetAtom(executedSearchParamsAtom);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const selectedType =
    CANCER_TYPES.find((t) => t.key === searchParams.diseaseSeq)?.value ||
    "전체";
  const hasCondition =
    searchParams.searchText !== "" || searchParams.diseaseSeq !== "99";

  // 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, searchText: e.target.value }));
  };

  const handleTypeSelect = (key: string) => {
    const newParams = { ...searchParams, diseaseSeq: key };
    setSearchParams(newParams);
    setExecutedSearchParams(newParams); // 자동으로 검색 실행
    setIsFilterOpen(false);
  };

  const handleSearch = async () => {
    if (searchParams.searchText === "" && searchParams.diseaseSeq === "99") {
      await alert(
        {
          title: "검색 조건 필요",
          body: "암 종류를 선택하거나 검색어를 입력해주세요.",
          cancelButton: "확인",
        },
        () => {
          // Alert 닫은 후 자동으로 초기화하여 전체 목록 표시
          handleReset();
        },
      );
      return;
    }
    setExecutedSearchParams(searchParams);
  };

  const handleReset = () => {
    const resetParams = { searchText: "", diseaseSeq: "99" };
    setSearchParams(resetParams);
    setExecutedSearchParams(resetParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="mt-5 px-5">
      <h2 className="text-lg font-bold mb-3">{pt("MSG_11")}</h2>

      <div className="relative">
        {/* 검색 입력 + 버튼 한 줄 */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={20}
            />
            <input
              type="text"
              value={searchParams.searchText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder={pt("MSG_12")}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-primary-thin bg-white focus:border-primary focus:outline-none transition-colors duration-200 placeholder:text-gray-400"
            />
          </div>

          {/* 검색 버튼 */}
          <button
            type="button"
            onClick={handleSearch}
            className="px-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            검색
          </button>

          {/* 초기화 버튼 */}
          {hasCondition && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            >
              초기화
            </button>
          )}
        </div>

        {/* 필터 버튼 (별도 줄) */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
            isFilterOpen
              ? "bg-primary text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isFilterOpen ? (
            <>
              <X size={18} />
              <span className="text-sm font-medium">닫기</span>
            </>
          ) : (
            <>
              <SlidersHorizontal size={18} />
              <span className="text-sm font-medium">
                암 종류: {selectedType}
              </span>
            </>
          )}
        </button>

        {/* 필터 드롭다운 */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFilterOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl border-2 border-primary-thin p-2 shadow-lg">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">
              암 종류 선택
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CANCER_TYPES.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => handleTypeSelect(type.key)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    searchParams.diseaseSeq === type.key
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type.value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
