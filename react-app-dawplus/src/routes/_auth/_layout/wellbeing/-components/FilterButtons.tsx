import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Brain,
  Dumbbell,
  Package,
  Search,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { coachingCodeByTypeAtom } from "@/atoms/coachingAtoms";
import {
  wellbeingFilterAtom,
  wellbeingSearchTextAtom,
} from "@/atoms/wellbeingAtoms";
import { cn } from "@/lib/utils";

// 카테고리별 아이콘만 매핑
const categoryIcons: Record<string, React.ReactElement> = {
  전체: <Sparkles />,
  운동: <Dumbbell />,
  심리: <Brain />,
  식이: <Utensils />,
  기타: <Package />,
};

export default function FilterButtons() {
  // Jotai atoms 사용 (전역 상태)
  const [selectedFilter, setSelectedFilter] = useAtom(wellbeingFilterAtom);
  const setSearchText = useSetAtom(wellbeingSearchTextAtom);

  // 로컬 state로 입력값 관리
  const [inputValue, setInputValue] = useState("");

  const codeList = useAtomValue(
    coachingCodeByTypeAtom("WELLBEING_CATEGORY_CD"),
  );

  const categories = useMemo(() => {
    const categoryButtons = codeList.map((item) => ({
      id: item.cd,
      title: item.val,
      icon: categoryIcons[item.val] || <Package />,
    }));

    return [
      {
        id: "",
        title: "전체",
        icon: <Sparkles />,
      },
      ...categoryButtons,
    ];
  }, [codeList]);

  const handleFilterClick = (id: string) => {
    setSelectedFilter(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchText(inputValue);
  };

  const handleReset = () => {
    setInputValue("");
    setSearchText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색 버튼 표시 여부
  const showSearchButton = inputValue.length > 0;

  return (
    <div className="mb-6">
      {/* 검색창 - 흰색 배경 스타일 */}
      <div className="mb-4">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1 transition-all duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="자원 검색..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-white border-2 border-white/80 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm text-gray-700 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* 검색 버튼과 초기화 버튼 - 입력 시 나타남 */}
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              showSearchButton
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 w-0 overflow-hidden pointer-events-none",
            )}
          >
            {/* 검색 버튼 */}
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-white text-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>검색</span>
            </button>

            {/* 초기화 버튼 */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              title="초기화"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 필터 버튼 그룹 - Grid 레이아웃 */}
      <div className="grid grid-cols-5 gap-2">
        {categories.map((category) => {
          const isSelected = selectedFilter === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleFilterClick(category.id)}
              className={cn(
                "px-2 py-2.5 rounded-lg text-xs font-semibold",
                "transition-all duration-200",
                "flex flex-col items-center justify-center gap-1",
                "border",
                isSelected
                  ? "bg-white text-primary border-white"
                  : "bg-white/25 text-white border-white/50 hover:border-white hover:bg-white/35 shadow-sm",
              )}
            >
              {/* 아이콘 */}
              {category.icon &&
                React.cloneElement(category.icon, {
                  className: cn(
                    "transition-colors duration-200",
                    isSelected ? "text-primary" : "text-white/90",
                  ),
                  size: "18",
                  strokeWidth: 2.5,
                })}
              {/* 텍스트 */}
              <span className="text-sm-fixed leading-tight">
                {category.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
