import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Star } from "lucide-react";
import { useState } from "react";
import type { WebviewContentItem } from "@/apis/types";
import FavoriteCharacter from "@/assets/images/character/favorite.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Each } from "@/components/common/Each";
import { PageHeader } from "@/components/layout/PageHeader";
import { useFavoriteList } from "@/hooks/queries/webview";
import ContentDetail from "./-components/ContentDetai";
import { DiseaseFilter } from "./-components/DiseaseFilter";

export const Route = createFileRoute("/_auth/_layout/favorite/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedDisease, setSelectedDisease] = useState("99");

  const { data: accountData } = useAtomValue(accountMeAtom);

  // 즐겨찾기 목록 조회
  const { data, isLoading } = useFavoriteList(accountData?.seq || "");

  // 필터링된 목록
  const filteredList =
    data?.filter((item) => {
      if (selectedDisease === "99") {
        return true; // 전체 보기
      }

      return item.diseaseSeq === Number.parseInt(selectedDisease, 10);
    }) || [];

  const [open, setOpen] = useState(false);

  const [selectedData, setSelectedData] = useState<Partial<WebviewContentItem>>(
    {
      seq: 0,
      title: "",
      interest: "",
      contents: "",
      createdAt: "",
      favoriteYn: "N",
      viewed: false,
    },
  );

  const onClick = (id: string | number) => {
    setOpen(true);
    setSelectedData(filteredList.find((d) => d.seq === id) || {});
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      <ContentDetail
        open={open}
        handleClose={() => setOpen(false)}
        data={selectedData}
      />

      {/* 헤더 */}
      <PageHeader
        title="즐겨찾기"
        description="자주 찾는 콘텐츠를 모아보세요"
        characterImage={FavoriteCharacter}
        characterAlt="Favorite Character"
      >
        {/* 질병 필터 */}
        <DiseaseFilter
          selectedDisease={selectedDisease}
          onDiseaseChange={setSelectedDisease}
        />
      </PageHeader>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 bg-white">
        <div className="px-6 pt-6 pb-20">
          {/* 결과 카운트 */}
          {!isLoading && filteredList.length > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              조회결과{" "}
              <span className="text-primary font-semibold">
                {filteredList.length}
              </span>
              건
            </p>
          )}

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-gray-500">로딩 중...</p>
            </div>
          )}

          {/* 빈 상태 */}
          {!isLoading && filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                즐겨찾기 내역이 없습니다
              </h2>
              <p className="text-gray-500 text-sm">
                마음에 드는 콘텐츠를 즐겨찾기에 추가해보세요
              </p>
            </div>
          )}

          {/* 즐겨찾기 목록 */}
          {!isLoading && filteredList.length > 0 && (
            <div className="space-y-3 flex flex-col">
              <Each
                of={filteredList}
                keyItem="seq"
                render={(item) => (
                  <button
                    type="button"
                    onClick={() => onClick(item.seq)}
                    className="flex items-center justify-start gap-4 p-2 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0 justify-start">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.diseaseName || "암 정보"}
                      </p>
                    </div>
                  </button>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
