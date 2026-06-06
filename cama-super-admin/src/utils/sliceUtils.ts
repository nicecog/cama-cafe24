import { PayloadAction } from "@reduxjs/toolkit";

// getState 함수 생성
export const getStatePath = <T>(state: T, path: string[]) => {
  return (
    path.reduce(
      (currentState: any, key: string) => currentState?.[key],
      state
    ) || state
  );
};
// Slice Name 생성
export const getName = (path: string[]): string => path.join("/");

// Create Default Reducer
export const createCommonReducers = <T>(initialState: T) => ({
  initialState: (): T => initialState,
  initialKeyState: (state: T, { payload }: PayloadAction<keyof T>): void => {
    state[payload] = initialState[payload];
  },
  setValue: (
    state: T,
    { payload }: PayloadAction<{ key: keyof T; value: any }>
  ): void => {
    state[payload.key] = payload.value;
  },
});
