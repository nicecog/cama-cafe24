import axios from "@/utils/axios";
import { useDispatch } from "react-redux";
import { actions } from "./lib/coachingSlice";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { useUpdateEffect } from "usehooks-ts";
import useAlert from "@/hooks/useAlert";

export default function HealthCoaching() {
  // loginID
  const { loginId } = useParams();
  // Location
  const location = useLocation();

  const { alert } = useAlert();

  // Navi
  const navigate = useNavigate();
  // Dispatch
  const dispatch = useDispatch();

  const getData = async () => {
    const [res1, res2] = await Promise.all([
      axios.post("/api/coaching/service/userAnswerInfoList", { loginId }),
      axios.post("/api/coaching/service/getCoachingProgressList", { loginId }),
    ]);

    return {
      sleep: res1.data.response.filter((r: any) => r.categoryCd === "A"),
      dietaryHabits: res1.data.response.filter(
        (r: any) => r.categoryCd === "B"
      ),
      exercise: res1.data.response.filter((r: any) => r.categoryCd === "C"),
      mental: res1.data.response.filter((r: any) => r.categoryCd === "D"),
      activity: res1.data.response.filter((r: any) => r.categoryCd === "E"),
      progress: res2.data.response,
    };
  };

  useEffectOnce(() => {
    if (!loginId) {
      alert("잘못된 접근입니다. ");
      navigate(-1);
      return;
    }
    if (location.pathname.includes("wellbeing")) {
      return;
    }

    getData().then((data) => {
      dispatch(actions.initDefaultData(data));
    });
  });

  useUpdateEffect(() => {
    if (!location.state?.reload) {
      return;
    }

    getData().then((data) => {
      dispatch(actions.initDefaultData(data));
    });
  }, [location.state?.reload]);

  return (
    <>
      <div className="bg-[#F9F9F9] ">
        {/* <MissionStart /> */}
        <Outlet />
      </div>
    </>
  );
}
