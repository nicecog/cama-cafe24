import type { Options } from "ky";
import { useCallback } from "react";
import { apiClient } from "@/lib/ApiClient";

export const useApi = () => {
  const callApi = useCallback(
    <T,>(url: string, options?: Options): Promise<T> => {
      return apiClient(url, options)
        .json<T>()
        .catch((error) => {
          console.error("API 호출 중 오류 발생:", error);
          throw error;
        });
    },
    [],
  );

  return callApi;
};
