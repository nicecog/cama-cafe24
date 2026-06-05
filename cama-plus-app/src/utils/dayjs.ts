import uuid from 'react-native-uuid';
import dayjs from 'dayjs';

export interface IBindBy<T> {
  key: string;
  list: T[];
}

export function bindBy<T>(cnt: number, iter: T[]) {
  let res: IBindBy<T>[] = [];

  let tmp: IBindBy<T> = {
    key: `${uuid.v4()}`,
    list: [],
  };
  for (const a of iter) {
    tmp.list.push(a);
    if (tmp.list.length === cnt) {
      res.push(tmp);
      tmp = {
        key: `${uuid.v4()}`,
        list: [],
      };
    }
  }
  if (tmp.list.length > 0) {
    res.push(tmp);
  }
  return res;
}

export const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

export const generateWeeks = (month: string, lastDay: number) => {
  const dayToWeekDay = [...Array(lastDay).keys()] // [0, lastDay)
    .map(d => ({
      day: `${d + 1}`,
      weekDay: dayjs(month)
        .date(d + 1)
        .get('days'), // weeDay: [0, 6]
    }));

  const weeks = [];
  let week = [];

  for (const w of dayToWeekDay) {
    week.push(w);
    if (w.weekDay === 6) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  return weeks
    .map(w => {
      if (w.length === 7) return w;

      if (w[0].weekDay !== 0) {
        const empty = [...Array(w[0].weekDay).keys()].map(i => ({
          day: '',
          weekDay: i,
        }));

        return [...empty, ...w];
      }

      const empty = [...Array(7 - w.length).keys()].map(i => ({
        day: '',
        weekDay: w.length + i,
      }));

      return [...w, ...empty];
    })
    .map((w, idx) => ({ key: `${month}-w-${idx}`, week: w }));
};

export const dateFormatted = (date: string, format: string = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const dateDotFormatted = (date: string) => {
  return dateFormatted(date, 'YYYY.MM.DD');
};

export const dateDotAmPm = (date: string) => {
  return dateFormatted(date, 'YYYY.MM.DD A h:mm');
};

export const dateSplit = (date: string) => {
  return date.split(' ')[0];
};
