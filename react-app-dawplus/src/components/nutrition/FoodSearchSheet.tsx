import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { FoodClassDto } from "@/apis/types/nutrition.types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { useFoodSearch } from "@/hooks/queries/webview/useNutritionQueries";

type FoodSearchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onSelect: (food: FoodClassDto) => void;
};

/** 후보 교체·수동 추가 공용 검색 시트 (서버 catalog 전체가 대상) */
export function FoodSearchSheet({
  open,
  onOpenChange,
  title = "음식 검색",
  description,
  onSelect,
}: FoodSearchSheetProps) {
  const [keyword, setKeyword] = useState("");
  const { data: results = [], isFetching } = useFoodSearch(keyword);

  useEffect(() => {
    if (!open) {
      setKeyword("");
    }
  }, [open]);

  const trimmed = keyword.trim();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <DrawerHeader className="pt-2 text-left">
          <DrawerTitle className="text-base">{title}</DrawerTitle>
          {description ? (
            <DrawerDescription className="text-xs">
              {description}
            </DrawerDescription>
          ) : null}
        </DrawerHeader>

        <div className="px-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              autoFocus
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="음식명을 2자 이상 입력하세요"
              className="h-11 pl-9"
            />
          </div>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto px-4 pb-6">
          {trimmed.length < 2 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              찾으시는 음식명을 입력해 주세요.
            </p>
          ) : isFetching && results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">검색 중…</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              일치하는 음식이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((food) => (
                <li key={food.classKey}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(food);
                      onOpenChange(false);
                    }}
                    className="flex w-full items-center justify-between py-3 text-left"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {food.nameKo ?? food.classKey}
                      </span>
                      {food.categoryNm ? (
                        <span className="text-xs text-gray-400">
                          {food.categoryNm}
                        </span>
                      ) : null}
                    </span>
                    {food.servingG ? (
                      <span className="text-xs text-gray-400">
                        1인분 {Math.round(food.servingG)}g
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
