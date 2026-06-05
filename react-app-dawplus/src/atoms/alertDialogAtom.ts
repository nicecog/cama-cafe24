import { atom } from "jotai";
import type React from "react";

// 공통 다이얼로그 액션 속성 타입
type BaseDialogAction = {
  title?: string;
  body?: React.ReactNode;
  icon?: React.ReactNode;
  iconFrame?: boolean;
  cancelButton?: string;
};

// 'confirm' 타입의 다이얼로그 액션 속성 타입
type ConfirmAction = BaseDialogAction & {
  type: "confirm";
  actionButton?: string;
};

// 모든 다이얼로그 액션 타입
export type AlertAction =
  | ({ type: "alert" } & BaseDialogAction)
  | ConfirmAction
  | { type: "close" };

// 다이얼로그 상태 인터페이스
export interface AlertDialogState {
  open: boolean;
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  iconFrame: boolean;
  type: "alert" | "confirm";
  cancelButton: string;
  actionButton: string;
}

// 큐 아이템 인터페이스
interface QueueItem {
  action: AlertAction;
  resolve: (value: boolean) => void;
  reject: (reason: unknown) => void;
}

// 초기 상태
const initialDialogState: AlertDialogState = {
  open: false,
  title: "",
  body: "",
  icon: null,
  iconFrame: true,
  type: "alert",
  cancelButton: "닫기",
  actionButton: "확인",
};

// AlertAction을 AlertDialogState로 변환
function convertToState(action: AlertAction): AlertDialogState {
  if (action.type === "close") {
    return { ...initialDialogState, open: false };
  }

  return {
    open: true,
    type: action.type,
    title: action.title ?? "",
    body: action.body ?? null,
    icon: action.icon ?? null,
    iconFrame: action.iconFrame ?? true,
    cancelButton: action.cancelButton ?? "닫기",
    actionButton:
      "actionButton" in action ? (action.actionButton ?? "확인") : "확인",
  };
}

// ============================================
// Atoms
// ============================================

// 큐 상태 atom (private)
const queueAtom = atom<QueueItem[]>([]);

// 현재 다이얼로그 상태 atom (읽기 전용)
export const currentDialogStateAtom =
  atom<AlertDialogState>(initialDialogState);

// 다이얼로그 열기 atom (쓰기 전용, Promise 반환)
export const openDialogAtom = atom(
  null,
  (get, set, params: AlertAction): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      const currentQueue = get(queueAtom);
      const newItem: QueueItem = {
        action: params,
        resolve,
        reject,
      };

      // 큐에 추가
      const newQueue = [...currentQueue, newItem];
      set(queueAtom, newQueue);

      // 큐가 비어있었다면 즉시 표시
      if (currentQueue.length === 0) {
        set(currentDialogStateAtom, convertToState(params));
      }
    });
  },
);

// 다이얼로그 닫기 시작 atom (open만 false로 변경)
export const startCloseDialogAtom = atom(null, (get, set) => {
  const currentState = get(currentDialogStateAtom);
  // open만 false로 변경, 나머지 상태(title, body 등)는 유지
  set(currentDialogStateAtom, { ...currentState, open: false });
});

// 다이얼로그 닫기 완료 atom (큐 처리 및 상태 변경)
export const closeDialogAtom = atom(null, (get, set, result: boolean) => {
  const queue = get(queueAtom);
  const [current, ...rest] = queue;

  // 현재 다이얼로그 resolve
  if (current) {
    current.resolve(result);
  }

  // 큐 업데이트
  set(queueAtom, rest);

  // 다음 큐가 있으면 자동으로 표시
  if (rest[0]) {
    set(currentDialogStateAtom, convertToState(rest[0].action));
  } else {
    set(currentDialogStateAtom, initialDialogState);
  }
});

// 디버깅용: 큐 상태 읽기 atom (선택적)
export const queueLengthAtom = atom((get) => get(queueAtom).length);
