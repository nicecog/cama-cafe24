import { range, map, filter, pipe, takeUntil, toArray, countBy } from '@fxts/core';
import { timeParser } from '@/utils/numbers';

export const BUTTON_HEIGHT = 50;
export const VIEW_WIDTH = 250;
export const GAP = 12;
export const MERIDIEM_ITEMS = ['오전', '오후'];
export const HOUR_ITEMS = [
  '12',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
];
export const MINUTE_ITEMS = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
];

export const hourItems = pipe(
  range(12),
  map(i => `${i}`),
  toArray,
);

export const minuteItems = pipe(
  range(60),
  map(i => timeParser(i)),
  toArray,
);

