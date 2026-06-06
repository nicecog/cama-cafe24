import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getState } from "./coachingSlice";
import axios from "@/utils/axios";
import useAlert from "@/hooks/useAlert";

const useSaveAnswer = (categoryCd: string) => {
  const { loginId } = useParams();
  const navigate = useNavigate();
  const { alert } = useAlert();

  const { accountName, sleep, mental, dietaryHabits, exercise, activity } =
    useSelector((s: RootState) => getState(s));

  const saveCoachingAnswer = async (result: any[]) => {
    const stepDayCd = {
      A: sleep.stepDayCd,
      C: exercise.stepDayCd,
      B: dietaryHabits.stepDayCd,
      D: mental.stepDayCd,
      E: activity.stepDayCd,
    }[categoryCd];

    const params = result.map((i: any) => ({
      ...i,
      answerChoiceSeq: 0,
      loginId,
      categoryCd,
      accountName,
      stepDayCd,
    }));

    try {
      const response = await axios.put(
        "/api/coaching/service/answerList",
        params
      );

      if (response.data.success) {
        alert("저장되었습니다.", () => {
          navigate(`/webview/coaching/${loginId}`, { state: { reload: true } });
        });
      }
    } catch (error) {
      alert("저장중 오류가 발생했습니다. 관리자에게 문의하세요 ");
    } finally {
    }
  };

  return { saveCoachingAnswer };
};

export default useSaveAnswer;
