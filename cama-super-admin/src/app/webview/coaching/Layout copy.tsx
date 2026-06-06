import axios from "@/utils/axios";
import { useDispatch } from "react-redux";
import { actions } from "./lib/coachingSlice";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { useUpdateEffect } from "usehooks-ts";

export default function HealthCoaching() {
  // loginID
  const { loginId } = useParams();

  const location = useLocation();

  // Navi
  const navigate = useNavigate();
  // Dispatch
  const dispatch = useDispatch();

  useEffectOnce(() => {
    if (!loginId) {
      alert("잘못된 접근입니다. ");
      navigate(-1);
      return;
    }

    const params = {
      loginId,
      categoryCd: "",
      stepDayCd: "",
      progressTypeCd: "",
      answerTypeCd: "",
      answerChoiceSeq: "",
    };
    const requests = ["A", "B", "C", "D", "E"].map((categoryCd) => {
      return axios.post("/api/coaching/service/userAnswerInfoList", {
        ...params,
        categoryCd,
      });
    });

    Promise.all([
      ...requests,
      axios.post("/api/coaching/service/getCoachingProgressList", { loginId }),
    ])
      .then(([res1, res2, res3, res4, res5, res6]) => {
        dispatch(
          actions.initDefaultData({
            sleep: res1.data.response,
            dietaryHabits: res2.data.response,
            exercise: res3.data.response,
            mental: res4.data.response,
            activity: res5.data.response,
            progress: res6.data.response,
          })
        );
      })
      .catch((error) => {
        // 에러 처리
        console.error("Error occurred:", error);
      });
  });

  useUpdateEffect(() => {
    if (!location.state?.reload) {
      return;
    }

    const params = {
      loginId,
      categoryCd: "A",
      stepDayCd: "",
      progressTypeCd: "",
      answerTypeCd: "",
      answerChoiceSeq: "",
    };
    const requests = ["A", "B", "C", "D", "E"].map((categoryCd) => {
      return axios.post("/api/coaching/service/userAnswerInfoList", {
        ...params,
        categoryCd,
      });
    });

    Promise.all([
      ...requests,
      axios.post("/api/coaching/service/getCoachingProgressList", { loginId }),
    ])
      .then(([res1, res2, res3, res4, res5, res6]) => {
        dispatch(
          actions.initDefaultData({
            sleep: res1.data.response,
            dietaryHabits: res2.data.response,
            exercise: res3.data.response,
            mental: res4.data.response,
            activity: res5.data.response,
            progress: res6.data.response,
          })
        );
      })
      .catch((error) => {
        // 에러 처리
        console.error("Error occurred:", error);
      });
  }, [location.state?.reload]);

  return (
    <>
      <div className="bg-whtie">
        <Outlet />
      </div>
    </>
  );
}
