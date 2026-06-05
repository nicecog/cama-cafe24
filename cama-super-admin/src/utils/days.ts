import dayjs from 'dayjs';

export const dateFormatted = (date: string, format: string = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
}

export const dateSplit = (date: string) => {
  return date.split(' ')[0];
}
