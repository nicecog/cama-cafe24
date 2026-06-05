import { BUTTON_HEIGHT } from '@/constants/values';

export const getCenterPosition = (offsetY: number) => {
  return getIndexFromOffset(offsetY) * BUTTON_HEIGHT;
};
export const getCenterPositionFromIndex = (index: number) => {
  return index * BUTTON_HEIGHT;
};
export const getIndexFromOffset = (offsetY: number) => {
  return Math.round(offsetY / BUTTON_HEIGHT);
};
export const fillEmpty = (visibleCount: number, [...values]) => {
  const fillCount = (visibleCount - 1) / 2;
  for (let i = 0; i < fillCount; i++) {
    values.unshift('');
    values.push('');
  }
  return values;
};

export const asPickerFormat = (date: Date) => {
  const _date = new Date(date.getTime());
  const hour = _date.getHours();
  const min = _date.getMinutes();
  _date.setTime(Date.now());
  _date.setHours(hour);
  _date.setMinutes(min + (5 - (min % 5)));
  _date.setSeconds(0);
  _date.setMilliseconds(0);
  return _date;
};
