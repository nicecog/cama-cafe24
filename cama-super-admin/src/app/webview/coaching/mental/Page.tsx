import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Session1 from "./session_1";
import Session2 from "./session2";
import Session3 from "./session3";
import Session4 from "./session4";
import Session5 from "./session5";
import Session6 from "./session_6";

import NotfoundPage from "../404";

import { getState } from "../lib/coachingSlice";
import StepLayout from "../component/Layout/StepLayout";

// 심리 Root Page
export default function MentalPage() {
  // 현재 Step Day Cd
  const stepDayCd = useSelector((s: RootState) => getState(s).mental.stepDayCd);

  // stepDayCd를 숫자로 변환하고 +1
  const stepNumber = parseInt(stepDayCd, 10) + 1;

  return (
    <>
      <StepLayout title="심리">
        <section className="bg-[#F9F9F9]">
          {{
            1: <Session1 />,
            2: <Session2 />,
            3: <Session3 />,
            4: <Session4 />,
            5: <Session5 />,
            6: <Session6 />,
            7: <Session6 />,
            8: <Session6 />,
          }[stepNumber] || <NotfoundPage />}
        </section>
      </StepLayout>
    </>
  );
}
