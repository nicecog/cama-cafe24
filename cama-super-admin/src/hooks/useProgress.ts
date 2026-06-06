import { useSelector } from "react-redux";

import { getState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

const useProgress = (props: string[]) => {
  // Progress
  const progress = useSelector((s: RootState) => getState(s).progress);

  return props.map(
    (item) => progress.find((r: any) => r.categoryCd === item)?.progress || 0
  );
};

export default useProgress;
