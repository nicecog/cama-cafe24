import { addDays, format, isAfter, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { CalendarIcon, Hospital, MoreHorizontal, Pill } from "lucide-react";
import { useId, useState } from "react";
import Image1 from "@/assets/images/character/char1.png"; // 내원
import Image3 from "@/assets/images/character/char3.png"; // 복약
import Image4 from "@/assets/images/character/hello/helloType3.png"; // 기타
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Each } from "@/components/common/Each";
import { Button } from "@/components/ui/Button";
import { DatePickerDrawer } from "@/components/ui/DatePickerDrawer";
import { Label } from "@/components/ui/Label";
import Popup from "@/components/ui/Popup";
import { Switch } from "@/components/ui/switch";
import { TimePickerDrawer, normalizeScheduleTime } from "@/components/ui/TimePickerDrawer";
import { useCreateSchedule } from "@/hooks/mutations/webview/useScheduleMutations";
import { useDialog } from "@/hooks/useDialog";
import { useResetState } from "@/hooks/useResetState";

type ScheduleType = "MEDICINE" | "HOSPITAL" | "ETC";

type ScheduleFormData = {
  acSeq: string;
  scheduleName: string;
  scheduleType: ScheduleType;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  time: string; // HH:mm:ss
  memo: string;
  alarm: boolean;
  repeat: boolean;
  days: number[]; // 1: 월, 2: 화, ..., 7: 일
};

type NewScheduleProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const scheduleTypes = [
  {
    value: "MEDICINE" as const,
    label: "복약",
    icon: Pill,
    image: Image3,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBg: "bg-blue-100",
    selectedBorder: "border-blue-500",
    textColor: "text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    value: "HOSPITAL" as const,
    label: "내원",
    icon: Hospital,
    image: Image1,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    selectedBg: "bg-green-100",
    selectedBorder: "border-green-500",
    textColor: "text-green-700",
    iconColor: "text-green-600",
  },
  {
    value: "ETC" as const,
    label: "기타",
    icon: MoreHorizontal,
    image: Image4,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    selectedBg: "bg-purple-100",
    selectedBorder: "border-purple-500",
    textColor: "text-purple-700",
    iconColor: "text-purple-600",
  },
];

const weekDays = [
  { label: "월", value: 1 },
  { label: "화", value: 2 },
  { label: "수", value: 3 },
  { label: "목", value: 4 },
  { label: "금", value: 5 },
  { label: "토", value: 6 },
  { label: "일", value: 7 },
];

// 오늘 날짜를 yyyy-MM-dd 형식으로 (컴포넌트 외부로 이동하여 재생성 방지)
const getTodayString = () => format(new Date(), "yyyy-MM-dd");

export default function NewSchedule(props: NewScheduleProps) {
  //  props
  const { open, setOpen } = props;

  const baseId = useId(); // 하나의 고유 ID를 기반으로 suffix 사용
  // Alert Dialog
  const { alert, confirm } = useDialog();
  //  Account Info
  const { data: accountInfo } = useAtomValue(accountMeAtom);

  // 일정 종류 상수는 밖으로 이동되어 있음 (scheduleTypes)
  const [imageKey, setImageKey] = useState(0); // 이미지 변경 감지용

  // 일정 등록 폼 (하나의 객체로 관리)
  const [scheduleForm, setScheduleForm, resetForm] =
    useResetState<ScheduleFormData>({
      acSeq: "",
      scheduleName: "",
      scheduleType: "MEDICINE",
      startDate: getTodayString(),
      endDate: getTodayString(),
      time: "08:00:00",
      memo: "",
      alarm: false,
      repeat: false,
      days: [],
    });

  // 매일 반복 여부 (UI 편의용)
  const [isEveryDay, setIsEveryDay] = useState(false);

  // 폼 업데이트 헬퍼 함수
  const updateForm = (field: string, value: any) => {
    setScheduleForm((prev) => ({ ...prev, [field]: value }));
  };

  // 반복 일정 토글
  const handleRepeatToggle = (checked: boolean) => {
    updateForm("repeat", checked);
    if (checked) {
      const start = parseISO(scheduleForm.startDate);
      const end = parseISO(scheduleForm.endDate);

      // 종료일이 시작일보다 같거나 빠르면 시작일 + 1일로 설정
      if (!isAfter(end, start)) {
        updateForm("endDate", format(addDays(start, 1), "yyyy-MM-dd"));
      }
    }
  };

  // 슬라이드 애니메이션 완료 후 상태 클리어
  const handleRepeatTransitionEnd = () => {
    if (!scheduleForm.repeat) {
      setIsEveryDay(false);
      updateForm("days", []);
      // 반복 OFF 시 종료일을 시작일과 동일하게 초기화
      updateForm("endDate", scheduleForm.startDate);
    }
  };

  // 매일 반복 토글
  const handleEveryDayToggle = (checked: boolean) => {
    setIsEveryDay(checked);
    updateForm("days", checked ? [1, 2, 3, 4, 5, 6, 7] : []);
  };

  // 개별 요일 토글
  const handleDayToggle = (day: number) => {
    const currentDays = scheduleForm.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();

    // 모든 요일이 선택되면 매일 반복 체크
    setIsEveryDay(newDays.length === 7);
    updateForm("days", newDays);
  };

  // 일정 등록 Mutation
  const { mutate: createScheduleMutate, isPending } = useCreateSchedule();

  // 일정 등록 제출
  const handleSubmit = () => {
    // acSeq 체크 (계정 정보가 없으면 등록 불가)
    if (!accountInfo?.seq) {
      alert("계정 정보를 불러올 수 없습니다. 다시 시도해주세요.");
      return;
    }

    // 반복 일정인데 요일이 하나도 선택되지 않은 경우
    if (scheduleForm.repeat && scheduleForm.days.length === 0) {
      alert("반복 일정은 최소 하나 이상의 요일을 선택해야 합니다.");
      return;
    }

    // 반복 설정이 꺼져있을 경우 days를 빈 배열로 보장하여 제출
    const submitData = {
      ...scheduleForm,
      acSeq: accountInfo.seq,
      time: normalizeScheduleTime(scheduleForm.time),
      // 반복이 아닐 때는 종료일을 시작일과 동일하게 보정
      endDate: scheduleForm.repeat
        ? scheduleForm.endDate
        : scheduleForm.startDate,
      days: scheduleForm.repeat ? scheduleForm.days : [],
    };

    confirm("일정을 등록하시겠습니까?", () => {
      createScheduleMutate(submitData, {
        onSuccess: () => {
          setOpen(false); // 성공 시 팝업 닫기
        },
        onError: (error) => {
          console.error("일정 등록 실패:", error);
          alert("일정 등록에 실패했습니다. 다시 시도해주세요.");
        },
      });
    });
  };

  // 선택된 타입의 이미지 가져오기
  const selectedTypeData = scheduleTypes.find(
    (t) => t.value === scheduleForm.scheduleType,
  );

  // 타입 변경 시 이미지 키 업데이트
  const handleTypeChange = (type: ScheduleType) => {
    updateForm("scheduleType", type);
    setImageKey((prev) => prev + 1);
  };

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      direction="right"
      title="일정추가"
      afterClose={resetForm}
    >
      {/* 상단 캐릭터 이미지 + 버튼 영역 통합 */}
      <div className={`relative   pb-8`}>
        {/* 고정 높이 컨테이너로 출렁거림 방지 */}
        <div className="flex justify-center items-center relative z-10 h-32 my-4">
          {/* 옵션 1: 바운스 + 페이드 효과 (위에서 통통 튀면서 나타남) */}
          <img
            key={`bounce-${imageKey}`}
            src={selectedTypeData?.image}
            alt={selectedTypeData?.label}
            className="w-28 h-28 object-contain animate-bounce-in"
          />

          {/* 옵션 2: 회전 + 줌인 효과 (빙글빙글 돌면서 확대) */}
          {/* <img
            key={`rotate-${imageKey}`}
            src={selectedTypeData?.image}
            alt={selectedTypeData?.label}
            className="w-28 h-28 object-contain animate-rotate-zoom"
          /> */}

          {/* 옵션 3: 슬라이드 + 페이드 효과 (왼쪽에서 슬라이드) */}
          {/* <img
            key={`slide-${imageKey}`}
            src={selectedTypeData?.image}
            alt={selectedTypeData?.label}
            className="w-28 h-28 object-contain animate-slide-fade"
          /> */}
        </div>

        {/* 일정 종류 - 라디오 버튼 카드 (배경 안에 포함) */}
        <div className="px-6 relative z-10">
          <div className="grid grid-cols-3 gap-3">
            <Each
              of={scheduleTypes}
              render={(type) => {
                const Icon = type.icon;
                const isSelected = scheduleForm.scheduleType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`
                    relative p-2 rounded-lg border-2 transition-all duration-200
                    flex flex-col items-center gap-2
                    ${isSelected ? `${type.selectedBg} ${type.selectedBorder} shadow-md` : `${type.bgColor} ${type.borderColor} hover:${type.selectedBg}`}
                  `}
                  >
                    <Icon className={`w-6 h-6 ${type.iconColor}`} />
                    <span
                      className={`text-sm font-semibold ${isSelected ? type.textColor : "text-gray-600"}`}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* 일정 정보 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 날짜 & 시간 */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              {/* 시작일 */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  시작일
                </Label>
                <DatePickerDrawer
                  format="yyyy.MM.dd"
                  value={scheduleForm.startDate}
                  disabled={{
                    before: new Date(new Date().setHours(0, 0, 0, 0)),
                  }} // 오늘 이전 날짜 비활성화
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const dateStr = `${year}-${month}-${day}`;

                      setScheduleForm((prev) => {
                        // 반복 일정인 경우: 종료일이 (시작일 + 1일)보다 이전이면 조정
                        if (prev.repeat) {
                          const nextDayStr = format(
                            addDays(date, 1),
                            "yyyy-MM-dd",
                          );
                          return {
                            ...prev,
                            startDate: dateStr,
                            endDate:
                              prev.endDate < nextDayStr
                                ? nextDayStr
                                : prev.endDate,
                          };
                        }
                        // 반복 일정이 아닌 경우: 종료일을 시작일과 동일하게 유지
                        return {
                          ...prev,
                          startDate: dateStr,
                          endDate: dateStr,
                        };
                      });
                    }
                  }}
                />
              </div>

              {/* 시간 */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  시간
                </Label>
                <TimePickerDrawer
                  value={scheduleForm.time}
                  onChange={(time) => updateForm("time", time)}
                />
              </div>
            </div>
          </div>

          {/* 메모 */}
          <div className="p-4">
            <Label
              htmlFor={`${baseId}-memo`}
              className="text-xs text-gray-600 flex items-center gap-1 mb-2"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              메모
            </Label>
            <textarea
              id={`${baseId}-memo`}
              placeholder="일정에 대한 메모를 입력하세요"
              rows={3}
              autoComplete="off"
              data-form-type="other"
              spellCheck="false"
              className="flex w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
              value={scheduleForm.memo}
              onChange={(e) => updateForm("memo", e.target.value)}
            />
          </div>
        </div>

        {/* 옵션 설정 */}
        <div className="space-y-3">
          {/* 반복 여부 */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <Label
                    htmlFor={`${baseId}-repeat`}
                    className="text-sm font-semibold text-gray-800 cursor-pointer"
                  >
                    반복 일정
                  </Label>
                  <p className="text-xs text-gray-500">요일별 반복 설정</p>
                </div>
              </div>
              <Switch
                id={`${baseId}-repeat`}
                checked={scheduleForm.repeat}
                onCheckedChange={handleRepeatToggle}
              />
            </div>

            {/* 요일 선택 영역 - 슬라이드 다운 (framer-motion) */}
            <AnimatePresence
              mode="wait"
              onExitComplete={handleRepeatTransitionEnd}
            >
              {scheduleForm.repeat && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4 bg-gradient-to-b from-orange-50/30 to-transparent">
                    {/* 종료일 설정 */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600 flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        종료일 (언제까지 반복할까요?)
                      </Label>
                      <DatePickerDrawer
                        format="yyyy.MM.dd"
                        value={scheduleForm.endDate}
                        // 시작일 이전 날짜 비활성화 (시작일이 오늘 이후이므로 자동 해결)
                        // 시작일 당일 및 그 이전 날짜 비활성화 (종료일은 최소 시작일 + 1일)
                        disabled={{
                          before: addDays(parseISO(scheduleForm.startDate), 1),
                        }}
                        onChange={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            updateForm("endDate", `${year}-${month}-${day}`);
                          }
                        }}
                      />
                    </div>

                    {/* 매일 반복 */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                      <Label
                        htmlFor={`${baseId}-everyDay`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        매일 반복
                      </Label>
                      <Switch
                        id={`${baseId}-everyDay`}
                        checked={isEveryDay}
                        onCheckedChange={handleEveryDayToggle}
                      />
                    </div>

                    {/* 요일 선택 버튼들 */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2 font-medium">
                        반복 요일 선택
                      </p>
                      <div className="grid grid-cols-7 gap-2">
                        <Each
                          of={weekDays}
                          render={(day) => {
                            const isSelected = scheduleForm.days.includes(
                              day.value,
                            );
                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => handleDayToggle(day.value)}
                                className={`
                                  aspect-square rounded-lg font-semibold text-sm transition-all duration-200
                                  ${
                                    isSelected
                                      ? "bg-orange-500 text-white shadow-md scale-105"
                                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                                  }
                                `}
                              >
                                {day.label}
                              </button>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 알림 */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <Label
                  htmlFor={`${baseId}-alarm`}
                  className="text-sm font-semibold text-gray-800 cursor-pointer"
                >
                  알림 받기
                </Label>
                <p className="text-xs text-gray-500">
                  일정 시간에 알림을 받습니다
                </p>
              </div>
            </div>
            <Switch
              id={`${baseId}-alarm`}
              checked={scheduleForm.alarm}
              onCheckedChange={(checked) => updateForm("alarm", checked)}
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="flex-1 h-12 font-semibold"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "등록 중..." : "일정 등록"}
          </Button>
        </div>
      </div>
    </Popup>
  );
}
