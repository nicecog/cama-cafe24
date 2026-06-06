import { useSelector } from "react-redux";

import { getState as commonGetState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

// useSelector를 사용하여 accountName을 반환하는 custom hook
const useAccountName = () => {
  // useSelector를 사용하여 Redux 상태에서 accountName 가져오기
  const accountName = useSelector(
    (state: RootState) => commonGetState(state).accountName
  );

  return accountName;
};

export default useAccountName;
