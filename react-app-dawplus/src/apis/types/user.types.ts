import type { User } from "./auth.types";

/**
 * 사용자 프로필 업데이트 요청 타입
 */
export interface UpdateUserProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

/**
 * 사용자 목록 조회 응답 타입
 */
export interface UserListItem extends User {
  status: "active" | "inactive" | "suspended";
  lastLoginAt?: string;
}

/**
 * 사용자 상세 정보 타입
 */
export interface UserDetail extends User {
  status: "active" | "inactive" | "suspended";
  lastLoginAt?: string;
  loginCount?: number;
  preferences?: UserPreferences;
}

/**
 * 사용자 설정 타입
 */
export interface UserPreferences {
  language: "ko" | "en";
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
