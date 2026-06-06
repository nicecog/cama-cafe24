import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const useMentalApi = (loginId?: string) => {
  const getCmVideoInfoList = () =>
    useQuery({
      queryKey: ["video", "list"],
      queryFn: async () => {
        const response = await axios
          .post("api/coaching/service/getCmVideoInfoList", {
            loginId,
            useYn: "Y",
            videotypeCd: "",
          })
          .then((res) => res.data.response);
        return response;
      },
    });

  return {
    getCmVideoInfoList,
  };
};

export default useMentalApi;
