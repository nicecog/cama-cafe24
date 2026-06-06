import { useRef, useState } from "react";

export const useResetState = <T>(
  initialState: T,
  callback?: (state: T) => void
) => {
  const initialStateRef = useRef(initialState);
  const [state, setState] = useState<T>(initialState);

  const reset = () => {
    setState(initialStateRef.current); // 상태를 초기화
    if (callback) {
      setTimeout(() => {
        callback(initialStateRef.current); // 상태 초기화 후 콜백 호출
      }, 10); // setState 비동기 작업 이후에 실행
    }
  };

  return [state, setState, reset] as const;
};
