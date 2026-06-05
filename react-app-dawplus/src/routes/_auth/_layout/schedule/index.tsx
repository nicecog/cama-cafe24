import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { WebviewSchedule } from "@/apis/types";
import ScheduleCharacter from "@/assets/images/character/char3.png";
import { PageHeader } from "@/components/layout/PageHeader";
import EditSchedule from "@/components/schedule/EditSchedule";
import NewSchedule from "@/components/schedule/NewSchedule";
import { Button } from "@/components/ui/Button";
import { ScheduleCalendar } from "./-components/ScheduleCalendar";
import { ScheduleList } from "./-components/ScheduleList";
import { ScheduleTypeFilter } from "./-components/ScheduleTypeFilter";
import { useScheduleData } from "./-hooks/useScheduleData";

export const Route = createFileRoute("/_auth/_layout/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
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
    handleDelete,
  } = useScheduleData();

  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<WebviewSchedule | null>(null);

  const handleEdit = (id: number) => {
    const schedule = filteredSchedules.find((s) => s.scheduleSeq === id);
    if (schedule) {
      setSelectedSchedule(schedule);
      setEditOpen(true);
    }
  };

  return (
    <div className="flex flex-col flex-1 ">
      <NewSchedule open={newOpen} setOpen={setNewOpen} />
      <EditSchedule
        open={editOpen}
        setOpen={setEditOpen}
        schedule={selectedSchedule}
      />

      {/* 헤더 섹션 */}
      <PageHeader
        title="일정관리"
        description="나의 건강 일정을 관리하세요"
        characterImage={ScheduleCharacter}
        characterAlt="Schedule Character"
      >
        {/* 필터 버튼 */}
        <ScheduleTypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </PageHeader>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 bg-white pb-32">
        {/* 캘린더 섹션 */}
        <div className="p-2 border-gray-200 mb-10">
          <div className="flex justify-end p-3">
            <Button type="button" onClick={() => setNewOpen(true)}>
              <Plus className="w-4 h-4" />
              일정추가
            </Button>
          </div>
          <div className="flex justify-center">
            <ScheduleCalendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              scheduleDates={scheduleDates}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>
        </div>

        {/* 일정 목록 영역 */}
        <ScheduleList
          selectedDate={selectedDate}
          schedules={filteredSchedules}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
