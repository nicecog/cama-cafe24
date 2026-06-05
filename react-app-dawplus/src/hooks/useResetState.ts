import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

/**
 * useState와 동일하게 동작하며, 상태를 초기값으로 되돌리는 reset 함수를 추가로 반환합니다.
 *
 * @param initialState 초기 상태 값 또는 초기 상태를 반환하는 함수
 * @returns [state, setState, reset]
 */
export function useResetState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, () => void] {
  const [state, setState] = useState(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setState, reset];
}
