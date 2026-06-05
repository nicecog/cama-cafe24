import * as React from "react";
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

// 다이얼로그 결과 타입 정의
// 'confirm'과 'alert'은 boolean 타입을 반환
type DialogResult = boolean;

// 공통 다이얼로그 액션 속성 타입
type BaseDialogAction = {
  title?: string;
  body?: React.ReactNode;
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
interface AlertDialogState {
  open: boolean;
  title: string;
  body: React.ReactNode;
  type: "alert" | "confirm";
  cancelButton: string;
  actionButton: string;
}

// 큐 아이템 인터페이스
interface QueueItem {
  action: AlertAction;
  resolve: (value: DialogResult) => void;
  reject: (reason: any) => void;
}

// 다이얼로그 context 생성
export const AlertDialogContext = React.createContext<
  (params: AlertAction) => Promise<DialogResult>
>(() => Promise.reject("AlertDialogProvider not found"));

// 다이얼로그 상태 리듀서
export function alertDialogReducer(
  state: AlertDialogState,
  action: AlertAction,
): AlertDialogState {
  switch (action.type) {
    case "close":
      return { ...state, open: false };
    case "alert":
    case "confirm":
      return {
        ...state,
        open: true,
        ...action,
        body: action.body ? action.body : null,
        cancelButton: action.cancelButton || state.cancelButton,
        actionButton:
          "actionButton" in action
            ? action.actionButton || "확인"
            : state.actionButton,
      };
    default:
      return state;
  }
}

// AlertDialogProvider 컴포넌트
export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(alertDialogReducer, {
    open: false,
    title: "",
    body: "",
    type: "alert",
    cancelButton: "닫기",
    actionButton: "확인",
  });

  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const currentItem = queue[0];

  const processNextInQueue = React.useCallback(() => {
    setQueue((prev) => {
      const [_, ...rest] = prev;
      if (rest[0]) {
        dispatch(rest[0].action);
      }
      return rest;
    });
  }, []);

  const close = React.useCallback(() => {
    dispatch({ type: "close" });
    if (currentItem) {
      currentItem.resolve(false);
      processNextInQueue();
    }
  }, [currentItem, processNextInQueue]);

  const confirm = React.useCallback(() => {
    dispatch({ type: "close" });
    if (currentItem) {
      currentItem.resolve(true);
      processNextInQueue();
    }
  }, [currentItem, processNextInQueue]);

  const dialog = React.useCallback(
    async (params: AlertAction): Promise<DialogResult> => {
      return new Promise<DialogResult>((resolve, reject) => {
        setQueue((prev) => {
          const newQueueItem: QueueItem = {
            action: params,
            resolve,
            reject,
          };
          const newQueue = [...prev, newQueueItem];
          if (prev.length === 0) {
            dispatch(params);
          }
          return newQueue;
        });
      });
    },
    [],
  );

  return (
    <AlertDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog open={state.open} onOpenChange={(open) => !open && close()}>
        <AlertDialogContent asChild>
          <div>
            <AlertDialogHeader>
              <AlertDialogTitle>{state.title}</AlertDialogTitle>
              <AlertDialogDescription>{state.body}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={close}>
                {state.cancelButton}
              </AlertDialogCancel>
              {state.type === "confirm" && (
                <AlertDialogAction onClick={confirm}>
                  {state.actionButton}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}
