import { useSelector } from "react-redux";

import { getState as commonGetState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

const useFontSize = (props: number[]) => {
  const fontSize = useSelector(
    (state: RootState) => commonGetState(state).fontSize
  );

  return props.map((i) => `${i + fontSize}px`);
};

export default useFontSize;
