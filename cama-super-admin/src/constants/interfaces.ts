import {
  PlatformType,
  GenderType,
  RoleType,
  SignType,
} from '../constants/enums';
import { Pagination } from '../services/apis/mainApiClient';

export interface Paginated<T> {
  data: T;
  pagination: Pagination;
}

export interface KeyItem<T = string> {
  key: string; // UUID
  value: T;
}

export interface Doctor {
  createdAt: string;
  departmentSeq: number;
  hospitalSeq: number;
  loginId: string;
  name: string;
  seq: number;
  updatedAt: string;
}

export interface AdminInfo {
  createdAt: string;
  loginId: string;
  name: string;
  seq: number;
  updatedAt: string;
}
