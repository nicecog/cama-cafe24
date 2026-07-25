import { QueryClientProvider } from "@tanstack/react-query";
import { getDefaultStore, Provider } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import type React from "react";
import { queryClient } from "./queryClient";

// Jotai의 getDefaultStore()를 사용하여 React 내부 및 외부(인터셉터)에서 동일한 Store 공유
const customStore = getDefaultStore();

// atomWithQuery(jotai-tanstack-query)가 앱 공용 queryClient를 사용하도록 연결.
// 연결하지 않으면 아톰은 별도 내부 QueryClient를 사용해
// mutation 의 invalidateQueries/setQueryData 가 화면에 반영되지 않는다.
customStore.set(queryClientAtom, queryClient);

// React Query와 Jotai Store를 Provider로 감싸는 컴포넌트
function RQProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* React Query Provider */}
      <Provider store={customStore}>
        {/* Jotai Store Provider */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {/* React Query 개발자 도구 */}
        {children} {/* 실제 렌더링될 컴포넌트 */}
      </Provider>
    </QueryClientProvider>
  );
}

export default RQProvider;
