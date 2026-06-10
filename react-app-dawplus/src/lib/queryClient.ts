import { QueryClient } from "@tanstack/react-query";

/**
 * React Query 클라이언트 설정
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 기본 옵션
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
      retry: (failureCount, error) => {
        // 404 에러는 재시도하지 않음
        if (
          error instanceof Error &&
          "status" in error &&
          error.status === 404
        ) {
          return false;
        }
        // 그 외 에러는 1번만 재시도 (총 2번 시도)
        return failureCount < 1;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // 뮤테이션 기본 옵션
      retry: 0,
    },
  },
});

/**
 * Query Keys
 * - 쿼리 키를 중앙에서 관리
 */
export const queryKeys = {
  // Account
  account: {
    all: ["account"] as const,
    hospital: (seq: string) =>
      [...queryKeys.account.all, "hospital", seq] as const,
    me: (loginId: string) => [...queryKeys.account.all, "me", loginId] as const,
  },
  // Auth
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "currentUser"] as const,
  },
  // User
  user: {
    all: ["user"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.user.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.user.all, "detail", id] as const,
    preferences: (id: string) =>
      [...queryKeys.user.all, "preferences", id] as const,
  },
  // Hospital
  hospital: {
    all: ["hospital"] as const,
    current: () => [...queryKeys.hospital.all, "current"] as const,
    diseaseList: (hospitalSeq?: number) =>
      [...queryKeys.hospital.all, "diseaseList", hospitalSeq] as const,
    doctorList: (hospitalSeq?: number) =>
      [...queryKeys.hospital.all, "doctorList", hospitalSeq] as const,
    list: () => [...queryKeys.hospital.all, "list"] as const,
    serviceCheck: (seq: number) =>
      [...queryKeys.hospital.all, "serviceCheck", seq] as const,
  },
  // Contents
  constents: {
    all: ["constents"] as const,
    detail: (seq: string) =>
      [...queryKeys.constents.all, "detail", seq] as const,
    list: (acSeq?: string) =>
      [...queryKeys.constents.all, "list", acSeq] as const,
    search: (acSeq: string, searchText?: string, diseaseSeq?: string) =>
      [
        ...queryKeys.constents.all,
        "search",
        acSeq,
        searchText,
        diseaseSeq,
      ] as const,
    favoriteList: (acSeq: string) =>
      [...queryKeys.constents.all, "favoriteList", acSeq] as const,
  },
  // Track
  track: {
    all: ["track"] as const,
    check: (seq: string) => [...queryKeys.track.all, "check", seq] as const,
    info: (
      acSeq: string,
      hospitalSeq: string,
      diseaseSeq: string,
      day: string,
    ) =>
      [
        ...queryKeys.track.all,
        "info",
        acSeq,
        hospitalSeq,
        diseaseSeq,
        day,
      ] as const,
    done: (
      acSeq: string,
      hospitalSeq: string,
      diseaseSeq: string,
      day: string,
    ) =>
      [
        ...queryKeys.track.all,
        "done",
        acSeq,
        hospitalSeq,
        diseaseSeq,
        day,
      ] as const,
    appliedInfo: (acSeq: string) =>
      [...queryKeys.track.all, "appliedInfo", acSeq] as const,
    stepList: (accountSeq: string) =>
      [...queryKeys.track.all, "stepList", accountSeq] as const,
  },
  // Coaching
  coaching: {
    all: ["coaching"] as const,
    progressList: (loginId: string) =>
      [...queryKeys.coaching.all, "progressList", loginId] as const,
  },
  // Common
  common: {
    all: ["common"] as const,
    diseaseList: () => [...queryKeys.common.all, "diseaseList"] as const,
  },
  // Webview
  webview: {
    all: ["webview"] as const,
    // Account
    account: {
      all: ["webview", "account"] as const,
      hospital: (seq: string) =>
        ["webview", "account", "hospital", seq] as const,
      me: (loginId: string) => ["webview", "account", "me", loginId] as const,
    },
    // Contents
    contents: {
      all: ["webview", "contents"] as const,
      list: (acSeq: string) => ["webview", "contents", "list", acSeq] as const,
      favoriteList: (acSeq: string) =>
        ["webview", "contents", "favoriteList", acSeq] as const,
      detail: (seq: string) => ["webview", "contents", "detail", seq] as const,
      search: (
        acSeq?: string | number,
        searchText?: string,
        diseaseSeq?: string,
      ) =>
        [
          "webview",
          "contents",
          "search",
          acSeq,
          searchText,
          diseaseSeq,
        ] as const,
    },
    // Track
    track: {
      all: ["webview", "track"] as const,
      check: (seq: string) => ["webview", "track", "check", seq] as const,
      serviceList: (
        acSeq?: string | number,
        hospitalSeq?: string | number,
        diseaseSeq?: string | number,
        day?: string | number,
      ) =>
        [
          "webview",
          "track",
          "serviceList",
          acSeq,
          hospitalSeq,
          diseaseSeq,
          day,
        ] as const,
      done: (
        acSeq: string,
        hospitalSeq: string,
        diseaseSeq: string,
        day: string,
      ) =>
        [
          "webview",
          "track",
          "done",
          acSeq,
          hospitalSeq,
          diseaseSeq,
          day,
        ] as const,
      appliedInfo: (acSeq: string) =>
        ["webview", "track", "appliedInfo", acSeq] as const,
      stepList: (accountSeq: string) =>
        ["webview", "track", "stepList", accountSeq] as const,
    },
    // Coaching
    coaching: {
      all: ["webview", "coaching"] as const,
      progressList: (loginId: string) =>
        ["webview", "coaching", "progressList", loginId] as const,
      codeList: (code: string, cd: string) =>
        ["webview", "coaching", "codeList", code, cd] as const,
      answerList: (loginId: string, categoryCd?: string) =>
        ["webview", "coaching", "answerList", loginId, categoryCd] as const,
      exerciseClassInfo: (loginId: string) =>
        ["webview", "coaching", "exerciseClassInfo", loginId] as const,
      exerciseContentList: (loginId: string) =>
        ["webview", "coaching", "exerciseContentList", loginId] as const,
    },
    // Wellbeing
    wellbeing: {
      all: ["webview", "wellbeing"] as const,
      resourceList: (wellbeingCategoryCd: string, searchText: string) =>
        [
          "webview",
          "wellbeing",
          "resourceList",
          wellbeingCategoryCd,
          searchText,
        ] as const,
    },
    // Notification
    notification: {
      all: ["webview", "notification"] as const,
      recent: (acSeq?: string | number) =>
        ["webview", "notification", "recent", acSeq] as const,
    },
    // Schedule
    schedule: {
      all: ["webview", "schedule"] as const,
      byDate: (date: string, acSeq: string | number) =>
        ["webview", "schedule", "byDate", date, acSeq] as const,
      monthly: (monthly: string, acSeq: string | number) =>
        ["webview", "schedule", "monthly", monthly, acSeq] as const,
    },
  },
} as const;
