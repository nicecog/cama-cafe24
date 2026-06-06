import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const useCodeApi = (code?: string) => {
  const queryResult = useQuery({
    queryKey: ["code", "list", code],
    queryFn: async () => {
      const response = await axios
        .post("api/coaching/service/codeList", {
          code,
          cd: "",
        })
        .then((res) => res.data.response);
      return response;
    },
    initialData: [],
  });

  return {
    getCodeList: () => queryResult,
  };
};

export default useCodeApi;
