import { useAtomValue, useSetAtom } from "jotai";
import { AlertCircle, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  closeDialogAtom,
  currentDialogStateAtom,
  startCloseDialogAtom,
} from "@/atoms/alertDialogAtom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-dialog";

// Re-export types for backward compatibility
export type { AlertAction } from "@/atoms/alertDialogAtom";

/**
 * AlertDialogProvider 컴포넌트
 * Jotai 기반으로 리팩토링된 다이얼로그 Provider
 * - 상태 관리는 alertDialogAtom에 위임
 * - UI 렌더링만 담당
 * - 큐 시스템을 통한 중첩 다이얼로그 지원
 * - 애니메이션 완료 후 상태 변경으로 텍스트 사라짐 문제 해결
 */
export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Jotai atoms 사용
  const state = useAtomValue(currentDialogStateAtom);
  const startClose = useSetAtom(startCloseDialogAtom);
  const closeDialog = useSetAtom(closeDialogAtom);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // 다이얼로그 닫기 (false 반환)
  const handleClose = () => {
    // 1단계: open만 false로 변경 (title, body는 유지)
    startClose();

    // 2단계: 애니메이션 완료 후 큐 처리 및 상태 변경
    // 애니메이션(200ms)보다 조금 더 길게 설정하여 완전히 사라진 후 처리
    closeTimeoutRef.current = setTimeout(() => {
      closeDialog(false);
    }, 250);
  };

  // 다이얼로그 확인 (true 반환)
  const handleConfirm = () => {
    // 1단계: open만 false로 변경 (title, body는 유지)
    startClose();

    // 2단계: 애니메이션 완료 후 큐 처리 및 상태 변경
    // 애니메이션(200ms)보다 조금 더 길게 설정하여 완전히 사라진 후 처리
    closeTimeoutRef.current = setTimeout(() => {
      closeDialog(true);
    }, 250);
  };

  return (
    <>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => !open && handleClose()}
      >
        <AlertDialogContent className="w-[90vw] max-w-md rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 shadow-2xl border-0 p-0 overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative">
            <AlertDialogHeader className="space-y-4 pt-6 pb-4 px-6">
              {/* Icon - 상단 중앙 배치 with premium modern styling */}
              <div className="relative flex justify-center">
                {state.iconFrame ? (
                  <>
                    {/* Outer glow ring - animated pulse */}
                    <div
                      className={`
                        absolute inset-0 w-14 h-14 mx-auto rounded-full blur-2xl opacity-30 animate-pulse
                        ${state.type === "alert" ? "bg-primary" : "bg-primary-light"}
                      `}
                    />

                    {/* Middle glow ring */}
                    <div
                      className={`
                        absolute inset-0 w-12 h-12 mx-auto rounded-full blur-xl opacity-40
                        ${state.type === "alert" ? "bg-primary" : "bg-primary-light"}
                      `}
                    />

                    {/* Main icon container with enhanced gradient */}
                    <div
                      className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center
                        shadow-xl
                        transform transition-transform duration-300 hover:scale-105
                        ${
                          state.type === "alert"
                            ? "bg-gradient-to-br from-primary via-primary to-primary-hover"
                            : "bg-gradient-to-br from-primary-light via-primary to-primary-hover"
                        }
                      `}
                    >
                      {/* Inner highlight for depth */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

                      {/* Icon */}
                      {state.icon ? (
                        <div className="relative flex items-center justify-center text-white">
                          {state.icon}
                        </div>
                      ) : state.type === "alert" ? (
                        <AlertCircle
                          className="relative w-6 h-6 text-white drop-shadow-lg"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <HelpCircle
                          className="relative w-6 h-6 text-white drop-shadow-lg"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </>
                ) : state.icon ? (
                  <div className="relative flex items-center justify-center text-primary">
                    {state.icon}
                  </div>
                ) : state.type === "alert" ? (
                  <AlertCircle
                    className="relative w-6 h-6 text-primary drop-shadow-sm"
                    strokeWidth={2.5}
                  />
                ) : (
                  <HelpCircle
                    className="relative w-6 h-6 text-primary drop-shadow-sm"
                    strokeWidth={2.5}
                  />
                )}
              </div>

              {/* 제목 - 중앙 정렬 with improved typography */}
              {state.title ? (
                <AlertDialogTitle className="text-center text-base-fixed bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight font-semibold break-keep whitespace-pre-line">
                  {state.title}
                </AlertDialogTitle>
              ) : (
                <AlertDialogTitle className="sr-only">
                  {state.type === "confirm" ? "확인" : "알림"}
                </AlertDialogTitle>
              )}

              {/* 메시지 with improved spacing and styling */}
              {state.body ? (
                typeof state.body === "string" ? (
                  <AlertDialogDescription className="max-w-sm whitespace-pre-line break-keep text-center text-pretty !text-sm-fixed font-medium leading-relaxed text-gray-600">
                    {state.body}
                  </AlertDialogDescription>
                ) : (
                  <AlertDialogDescription asChild>
                    <div className="max-w-sm whitespace-pre-line break-keep text-center text-pretty !text-sm-fixed font-medium leading-relaxed text-gray-600">
                      {state.body}
                    </div>
                  </AlertDialogDescription>
                )
              ) : (
                <AlertDialogDescription className="sr-only">
                  알림 메시지
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>

            {/* Enhanced footer with premium button styling */}
            <AlertDialogFooter className="flex gap-3 flex-row p-6 pt-2">
              {state.type !== "alert" ? (
                <>
                  <AlertDialogCancel className="w-full h-12 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow mt-0">
                    {state.cancelButton}
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleConfirm}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-primary-light to-primary text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mt-0 shadow-md"
                  >
                    {state.actionButton}
                  </AlertDialogAction>
                </>
              ) : (
                <AlertDialogCancel className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-primary-light to-primary text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mt-0 shadow-md">
                  {state.cancelButton}
                </AlertDialogCancel>
              )}
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
