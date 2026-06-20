import { createFileRoute } from "@tanstack/react-router";
import Advice from "@/assets/images/character/advice2.png";
import { PageHeader } from "@/components/layout/PageHeader";
import FilterButtons from "./-components/FilterButtons";
import List from "./-components/List";
import WellbeingDetail from "./-page/WellbeingDetail";

export const Route = createFileRoute("/_auth/_layout/wellbeing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col h-dvh ">
      {/* 헤더 */}
      <PageHeader
        title="웰빙자원"
        description="건강한 삶을 위한 자원관리"
        characterImage={Advice}
        characterAlt="Advice Character"
      >
        {/* 필터 버튼 */}
        <FilterButtons />
      </PageHeader>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 bg-white">
        <div className="px-6 pt-3 pb-20">
          <List />
        </div>
      </div>
      <WellbeingDetail />
    </div>
  );
}
