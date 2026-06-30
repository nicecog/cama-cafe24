import { memo, useMemo, useState } from "react";
import type { WebviewContentItem } from "@/apis/types";
import { Each } from "@/components/common/Each";
import { Card } from "@/components/ui/Card";
import ContentDetail from "../ContentDetai";

// 카드 컴포넌트
const CancerInfoCard = memo(
  ({
    item,
    onClick,
  }: {
    item: {
      seq: number;
      image: string;
      title: string;
      progress: number | null;
    };
    onClick: (id: string) => void;
  }) => {
    const progressValue = item.progress ?? 0;
    const isCompleted = progressValue === 100;

    return (
      <li>
        <Card
          className="flex gap-4 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-primary-thin hover:border-primary flex-row items-center"
          onClick={() => onClick(String(item.seq))}
        >
          <div className="flex-none w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-center">
            <img
              src={item.image}
              alt="암 정보 섬네일"
              className="w-20 h-20 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
            <h3 className="font-bold text-sm font-jalnan">{item.title}</h3>

            {/* 프로그레스 바 */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 min-w-[35px] text-right">
                {progressValue}%
              </span>
            </div>

            {/* 읽음 표시 */}
            {isCompleted && (
              <span className="text-xs text-primary font-medium">✓ 읽음</span>
            )}
          </div>
        </Card>
      </li>
    );
  },
);

CancerInfoCard.displayName = "CancerInfoCard";

interface TrackServiceListProps {
  trackServiceList: WebviewContentItem[] | null;
  appliedInfoSeq?: number;
}

/**
 * 여정 컨텐츠 리스트 컴포넌트
 * - 검색하지 않았을 때 기본으로 표시되는 컴포넌트
 * - 페이징 없이 전체 목록 표시
 */
export default function TrackServiceList({
  trackServiceList,
  appliedInfoSeq,
}: TrackServiceListProps) {
  // 상세보기
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Partial<WebviewContentItem>>(
    {},
  );

  const onClick = (id: string) => {
    setOpen(true);
    setSelectedData(trackServiceList?.find((d) => d.seq === Number(id)) || {});
  };

  // 진행률 계산: progress가 100인 항목 수 / 전체 항목 수
  const contentProgress = useMemo(() => {
    if (!trackServiceList || trackServiceList.length === 0) return 0;

    const completedCount = trackServiceList.filter(
      (d) => d.progress === 100,
    ).length;
    const totalCount = trackServiceList.length;

    return Math.round((completedCount / totalCount) * 100);
  }, [trackServiceList]);

  return (
    <>
      <ContentDetail
        open={open}
        handleClose={() => setOpen(false)}
        data={selectedData}
        seq={appliedInfoSeq}
      />

      {/* 헤더 */}
      <div className="px-5 flex justify-between items-end mt-8">
        <h2 className="text-base font-bold">오늘의 건강 뉴스레터</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">진행도</span>
          <span className="text-sm font-bold text-primary">
            {contentProgress}%
          </span>
        </div>
      </div>

      {/* 리스트 */}
      <div className="mt-2.5 px-5 mb-8">
        <ul className="flex flex-col gap-3">
          <Each
            of={trackServiceList || []}
            render={(item) => (
              <CancerInfoCard key={item.seq} item={item} onClick={onClick} />
            )}
          />
        </ul>
      </div>
    </>
  );
}
