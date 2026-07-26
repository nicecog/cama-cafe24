import { useSetAtom } from "jotai";
import { type AlertAction, openDialogAtom } from "@/atoms/alertDialogAtom";

// 다이얼로그 액션 파라미터 타입
type Params<T extends "alert" | "confirm"> =
  | Omit<Extract<AlertAction, { type: T }>, "type">
  | string;

/**
 * useDialog Hook
 * Jotai 기반 다이얼로그 훅
 * - alert: 알림 다이얼로그 표시
 * - confirm: 확인/취소 다이얼로그 표시
 * - Promise 기반 API로 중첩 호출 지원
 */
export function useDialog() {
  const openDialog = useSetAtom(openDialogAtom);

  /**
   * Confirm 다이얼로그 표시
   * @param params - 다이얼로그 설정 (문자열 또는 객체)
   * @param onOk - 확인 버튼 클릭 시 콜백
   * @param onCancel - 취소 버튼 클릭 시 콜백
   * @returns Promise<void>
   */
  const confirm = async (
    params: Params<"confirm">,
    onOk?: () => void | Promise<void>,
    onCancel?: () => void | Promise<void>,
  ) => {
    const result = await openDialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "confirm",
    });

    if (result) {
      await onOk?.();
    } else {
      await onCancel?.();
    }
  };

  /**
   * Alert 다이얼로그 표시
   * @param params - 다이얼로그 설정 (문자열 또는 객체)
   * @param onClose - 닫기 버튼 클릭 시 콜백
   * @returns Promise<void>
   */
  const alert = async (
    params: Params<"alert">,
    onClose?: () => void | Promise<void>,
  ) => {
    await openDialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "alert",
    });

    await onClose?.();
  };

  return { confirm, alert };
}
