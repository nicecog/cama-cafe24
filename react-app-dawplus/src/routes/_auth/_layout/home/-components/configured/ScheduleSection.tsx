import { format } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import NewSchedule from "@/components/schedule/NewSchedule";
import { ScheduleCarouselCard } from "@/components/schedule/ScheduleCarouselCard";
import {
  useUpdateScheduleDone,
  useUpdateScheduleUnDone,
} from "@/hooks/mutations/webview/useScheduleMutations";
import { useSchedule } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";

export default function ScheduleSection() {
  // PT
  const { pt } = usePageTranslation();
  //  일정 신규등록 보임여부
  const [open, setOpen] = useState(false);

  const accountMe = useAtomValue(accountMeAtom);
  const acSeq = accountMe.data?.seq;
  const selectedDateStr = format(new Date(), "yyyy-MM-dd");

  // 일정 데이터 조회 (선택된 날짜)
  const { data: schedules = [] } = useSchedule(selectedDateStr, acSeq ?? "");

  // 완료된 일정을 맨 뒤로 정렬
  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => {
      // done이 false인 것을 먼저 (미완료 우선)
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1;
    });
  }, [schedules]);

  // Embla Carousel
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  // Dialog
  const { confirm } = useDialog();

  // 완료/미완료 Mutations
  const { mutate: markDone } = useUpdateScheduleDone();
  const { mutate: markUnDone } = useUpdateScheduleUnDone();

  // 완료/미완료 토글
  const handleComplete = (id: number) => {
    const schedule = schedules.find((s) => s.scheduleSeq === id);
    if (!schedule || !acSeq) return;

    if (schedule.done) {
      // 미완료로 변경
      confirm("일정을 미완료로 변경하시겠습니까?", () => {
        markUnDone({ batchSeq: schedule.batchSeq, acSeq });
      });
    } else {
      // 완료로 변경
      confirm("일정을 완료하시겠습니까?", () => {
        markDone({ batchSeq: schedule.batchSeq, acSeq });
      });
    }
  };

  return (
    <div className="mt-3">
      <NewSchedule open={open} setOpen={setOpen} />

      {/* 헤더 */}
      <div className="px-5 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {pt("MSG_07")}
          <span className="text-primary ml-2">({schedules.length})</span>
        </h2>
      </div>

      {/* 캐러셀 */}
      {schedules.length > 0 ? (
        <div className="relative">
          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 px-5 py-1">
              {/* 일정 추가 카드 */}
              <div
                className="flex flex-col items-center justify-center shrink-0 w-[80px] rounded-xl border-2 border-dashed border-gray-200 bg-white/50 cursor-pointer hover:border-primary/50 hover:bg-white transition-all active:scale-95 group"
                onClick={() => setOpen(true)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1 group-hover:text-primary">
                  추가
                </span>
              </div>

              {sortedSchedules.map((schedule) => (
                <ScheduleCarouselCard
                  key={schedule.scheduleSeq}
                  schedule={schedule}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // 데이터 없을 때
        <div className="px-5">
          <div className="flex-center border-2 border-dashed border-primary-thin rounded-xl p-10 bg-white/50 font-semibold flex-col gap-3">
            <p className="text-gray-600">{pt("MSG_08")}</p>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors duration-200 active:scale-95"
              onClick={() => {
                setOpen(true);
              }}
            >
              {pt("MSG_09")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
