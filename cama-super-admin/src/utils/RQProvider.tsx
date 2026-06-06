import { Suspense } from "react";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Loader from "@/layout/common/loader";

type Props = {
  children: React.ReactNode;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function RQProvider({ children }: Props) {
  // const [queryClient] = useState(
  //   new QueryClient({
  //     defaultOptions: {
  //       // react-query 전역 설정
  //       queries: {
  //         refetchOnWindowFocus: false,
  //         retryOnMount: true,
  //         refetchOnReconnect: false,
  //         retry: false,
  //       },
  //     },
  //   })
  // );

  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.MODE === "development" ? (
        <>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </>
      ) : (
        <>{children}</>
      )}
    </QueryClientProvider>
  );
}

export default RQProvider;
