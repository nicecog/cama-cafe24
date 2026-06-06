import dayjs from "dayjs";

interface DaySelection {
  wday: WeekDay;
  time: string; // HH 형식
}

type WeekDay =
  | "월요일"
  | "화요일"
  | "수요일"
  | "목요일"
  | "금요일"
  | "토요일"
  | "일요일";

interface ScheduleDate {
  startDate: string;
  time: string;
  date: string; // YYYY-MM-DD HH:00 형식
  timestamp: number;
  weekday: WeekDay;
}

const weekdayMap: { [key in WeekDay]: number } = {
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
  일요일: 0,
};

const getNextWeekDate = (
  now: dayjs.Dayjs,
  targetDay: number,
  targetHour: number
): dayjs.Dayjs => {
  let currentDate = now;
  const targetDate = currentDate
    .day(targetDay)
    .hour(targetHour)
    .minute(0)
    .second(0);

  // 목표 날짜가 현재 시점보다 과거인 경우에만 다음 주로 이동
  if (targetDate.isBefore(now)) {
    return targetDate.add(1, "week");
  }

  return targetDate;
};

export const getUpcomingDates = (
  selections: DaySelection[]
): ScheduleDate[] => {
  const now = dayjs();
  const dates: ScheduleDate[] = [];

  selections.forEach(({ wday, time }) => {
    const targetDay = weekdayMap[wday];
    const targetHour = parseInt(time, 10);

    let nextDate = getNextWeekDate(now, targetDay, targetHour);

    // 3주치 날짜 추가
    for (let i = 0; i < 3; i++) {
      const date = nextDate.add(i * 7, "day");
      dates.push({
        startDate: date.format("YYYY-MM-DD"),
        time: date.format("HH:00:00"),
        date: date.format("YYYY-MM-DD HH:00"),
        timestamp: date.valueOf(),
        weekday: wday,
      });
    }
  });

  return dates.sort((a, b) => a.timestamp - b.timestamp);
};

export const isDuplicateSelection = (
  selection1: DaySelection,
  selection2: DaySelection
): boolean => {
  return (
    selection1.wday === selection2.wday && selection1.time === selection2.time
  );
};
