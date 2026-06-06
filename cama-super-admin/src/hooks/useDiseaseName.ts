import { useSelector } from "react-redux";

import { getState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

const useDiseaseName = () => {
  const progress = useSelector((s: RootState) => getState(s).progress);

  const diseaseName = progress[0]?.diseaseName || "";

  return diseaseName;
};

export default useDiseaseName;
