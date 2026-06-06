import { configureStore, combineReducers } from "@reduxjs/toolkit";

import CommonReducer from "@/layout/layoutSlice";

// 메뉴별 Store 기본형

import coaching from "@/app/webview/coaching/lib/coachingSlice";

export const store = configureStore({
  reducer: {
    COMMON: CommonReducer,
    COACHING: combineReducers({
      coaching,
    }),
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
