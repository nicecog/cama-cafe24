import { map, pipe, range, toArray } from '@fxts/core';
import { jhComma } from '../utils/numbers';

export interface OptionItem<T = string> {
  label: string;
  value: T;
}

/** Common **/
export type basicViewedType = 'YES' | 'NO'
export const BASIC_VIEWED_OPTIONS: OptionItem<basicViewedType>[] = [
  { label: 'YES', value: 'YES' },
  { label: 'NO', value: 'NO' },
];

/** Category **/
export type CategoryViewedType = 'PUBLIC' | 'PRIVATE'
export const CATEGORY_VIEWED_OPTIONS: OptionItem<CategoryViewedType>[] = [
  { label: '공개', value: 'PUBLIC' },
  { label: '비공개', value: 'PRIVATE' },
];

export const CATEGORY_GRADE_OPTIONS: OptionItem<number>[] = pipe(
  range(1, 11),
  map(i => ({ label: `${i}`, value: i })),
  toArray,
);

export const TICKET_COUNT_OPTIONS: OptionItem[] = pipe(
  range(1, 11),
  map(i => ({ label: `${i}`, value: `${i}` })),
  toArray,
);

export const TICKET_REWARD_POINT_OPTIONS: OptionItem[] = pipe(
  range(1, 11),
  map(i => ({ label: `${jhComma(i*500)}`, value: `${i*500}` })),
  toArray,
);

export const BASIC_REWARD_POINT_OPTIONS: OptionItem[] = [
  { label: '1', value: '1' },
  { label: '3', value: '3' },
  { label: '10', value: '10' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

/** Search Filter **/
export type ManagerGroupListSearchValueType = 'groupName';
export const MANAGER_GROUP_LIST_SEARCH_OPTIONS: OptionItem<ManagerGroupListSearchValueType>[] = [
  { label: '그룹명', value: 'groupName' },
];

export type UserGroupListSearchValueType = 'groupName';
export const USER_GROUP_LIST_SEARCH_OPTIONS: OptionItem<UserGroupListSearchValueType>[] = [
  { label: '그룹명', value: 'groupName' },
];

export type UserListSearchValueType = 'name' | 'email' | 'naverId' | 'phone' | 'nickName';
export const USER_LIST_SEARCH_OPTIONS: OptionItem<UserListSearchValueType>[] = [
  { label: '이름', value: 'name' },
  { label: '이메일(아이디)', value: 'email' },
  { label: '네이버 ID', value: 'naverId' },
  { label: '연락처', value: 'phone' },
  { label: '닉네임', value: 'nickName' },
];

export type LiveListSearchValueType = 'vendor' | 'title';
export const Live_LIST_SEARCH_OPTIONS: OptionItem<LiveListSearchValueType>[] = [
  { label: '분류', value: 'vendor' },
  { label: '라이브명', value: 'title' },
]

export type AdvViewListSearchValueType = 'title';
export const ADV_VIEW_LIST_SEARCH_OPTIONS: OptionItem<AdvViewListSearchValueType>[] = [
  { label: '광고명', value: 'title' },
]

export const INTEREST_OPTIONS: OptionItem[] = [
  { label: '건강한 식생활과 운동', value: '건강한 식생활과 운동' },
  { label: '그외 도움되는 정보', value: '그외 도움되는 정보' },
  { label: '마음 돌보기', value: '마음 돌보기' },
  { label: '보호자를 위한 팁', value: '보호자를 위한 팁' },
  { label: '부작용과 대처', value: '부작용과 대처' },
  { label: '위험요소와 관리법', value: '위험요소와 관리법' },
  { label: '증상 알아보기', value: '증상 알아보기' },
  { label: '치료과정', value: '치료과정' },
];

export const VIEWED_OPTIONS: OptionItem<basicViewedType>[] = [
  { label: '네. 공개합니다.', value: 'YES' },
  { label: '아니오. 공개하지 않습니다. 작성중 입니다.', value: 'NO' },
];

export type HospitalSearchValueType = 'name';
export const HOSPITAL_LIST_SEARCH_OPTIONS: OptionItem<HospitalSearchValueType>[] = [
  { label: '병원명', value: 'name' },
]

export type HospitalDiseaseSearchValueType = 'hospitalName';
export const HOSPITAL_DISEASE_LIST_SEARCH_OPTIONS: OptionItem<HospitalDiseaseSearchValueType>[] = [
  { label: '병원명', value: 'hospitalName' },
]

export type DoctorSearchValueType = 'hospitalName' | 'name' | 'departmentName' | 'phone';
export const DOCTOR_LIST_SEARCH_OPTIONS: OptionItem<DoctorSearchValueType>[] = [
  { label: '의사 이름', value: 'name' },
  { label: '소속', value: 'hospitalName' },
  { label: '부서', value: 'departmentName' },
  { label: '휴대폰', value: 'phone' },
]
