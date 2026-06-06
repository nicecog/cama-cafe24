import { Navigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import useActivityApi from "./useActivity";
import useTypingEffect from "@/hooks/useTypingEffect";

// 운동 Default 화면
export default function ActivityPage() {
  // Login Id
  const { loginId } = useParams();
  const { getExerciseUserClassInfo } = useActivityApi(loginId);
  const { data: excerciseInfo, isLoading } = getExerciseUserClassInfo();

  const text = useTypingEffect("운동코칭을 시작합니다. ");
  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-80 h-20 bg-camaColor1 bg-opacity-80 flex items-center justify-center  rounded-md">
          <p className="text-slate-600 font-oneMobile tracking-widest text-lg">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return !excerciseInfo ? (
    <Navigate to={`../E/eval/${loginId}`} />
  ) : (
    <Navigate to={`../E/content/${loginId}`} />
  );
}
