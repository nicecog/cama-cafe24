import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import {
  useDeleteSchedule,
  useUpdateScheduleDone,
  useUpdateScheduleUnDone,
} from "@/hooks/mutations/webview";
import { useMonthlySchedule, useSchedule } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";

/**
 * 일정 관리 페이지의 상태와 데이터 조회 로직을 관리하는 커스텀 훅
 */
export function useScheduleData() {
  // States
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState("all");

  // Account info
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const acSeq = accountMe?.seq; // acSeq를 미리 추출하여 재사용
  const { confirm } = useDialog();

  // Mutations
  const { mutate: markDone } = useUpdateScheduleDone();
  const { mutate: markUnDone } = useUpdateScheduleUnDone();
  const { mutate: deleteSchedule } = useDeleteSchedule();

  // 선택된 날짜 문자열 (YYYY-MM-DD)
  const selectedDateStr = useMemo(
    () => (selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""),
    [selectedDate],
  );

  // 현재 표시 중인 월의 연도와 월
  const displayYear = currentMonth.getFullYear();
  const displayMonth = currentMonth.getMonth();

  // 월 문자열 (YYYYMMDD - 월의 첫날)
  const monthStr = useMemo(() => {
    return format(new Date(displayYear, displayMonth, 1), "yyyyMMdd");
  }, [displayYear, displayMonth]);

  // 월별 일정 데이터 조회 (달력 표시용)
  const { data: monthlySchedules = [] } = useMonthlySchedule(
    monthStr,
    acSeq ?? "",
    !!monthStr && !!acSeq,
  );

  // 일정 데이터 조회 (선택된 날짜)
  const { data: schedules = [] } = useSchedule(
    selectedDateStr,
    acSeq ?? "",
    !!selectedDate && !!acSeq,
  );

  // 일정이 있는 날짜 목록 추출
  const scheduleDates = useMemo(() => {
    const dates = monthlySchedules.map((schedule) => schedule.startDate);
    return Array.from(new Set(dates));
  }, [monthlySchedules]);

  // 선택된 날짜의 일정 필터링 및 정렬
  const filteredSchedules = useMemo(() => {
    const filtered = schedules.filter((schedule) => {
      const typeMatch =
        selectedType === "all" || schedule.scheduleType === selectedType;
      return typeMatch;
    });

    // 완료 여부로 정렬: 미완료 항목이 위로, 완료 항목이 아래로
    return filtered.sort((a, b) => {
      const aCompleted = a.done;
      const bCompleted = b.done;

      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [schedules, selectedType]);

  // 일정 핸들러
  const handleComplete = (id: number) => {
    const schedule = schedules.find((s) => s.scheduleSeq === id);
    if (!schedule || !acSeq) return;

    const isCurrentlyDone = schedule.done;
    const title = isCurrentlyDone ? "일정 미완료 처리" : "일정 완료 처리";
    const body = isCurrentlyDone
      ? "이 일정을 미완료 상태로 되돌리시겠습니까?"
      : "이 일정을 완료 처리하시겠습니까?";

    confirm({ title, body, actionButton: "확인", cancelButton: "취소" }, () => {
      if (isCurrentlyDone) {
        markUnDone({ batchSeq: schedule.batchSeq, acSeq });
      } else {
        markDone({ batchSeq: schedule.batchSeq, acSeq });
      }
    });
  };

  const handleEdit = (id: number) => {
    console.log("수정:", id);
    // TODO: 수정 모달 열기
  };

  //  삭제
  const handleDelete = (id: number) => {
    if (!acSeq) return;
    confirm(
      {
        body: (
          <div className="space-y-3">
            <p className="text-base font-semibold text-gray-900">
              정말 이 일정을 삭제할까요?
            </p>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">
                🚨 반복 일정은 모두 삭제됩니다
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              특정 요일만 제외하려면 수정 화면에서
              <br />
              해당 요일을 빼고 저장해주세요
            </p>
          </div>
        ),
        actionButton: "삭제",
        cancelButton: "취소",
      },
      () => {
        deleteSchedule({ seq: id, acSeq });
      },
    );
  };

  return {
    // States
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    selectedType,
    setSelectedType,
    // Data
    scheduleDates,
    filteredSchedules,
    // Handlers
    handleComplete,
    handleEdit,
    handleDelete,
  };
}
