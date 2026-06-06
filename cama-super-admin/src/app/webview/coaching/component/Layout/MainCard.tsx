import { ReactNode } from "react";
import MissionHeader from "./MissionHeader";
import QuestionHeader from "./QuestionHeader";
import InfomationHeader from "./InfomationHeader";

// 각 스텝별 Wrap
export default function MainCard(props: {
  children: ReactNode;
  type?: "mission" | "question" | "infomation";
  coachingType?: "A" | "B" | "C" | "D" | "E";
}) {
  return (
    <>
      <div className="flx flex-col ">
        <div className="pt-[30px] px-[30px]">
          {props.type === "mission" && <MissionHeader />}
          {props.type === "infomation" && <InfomationHeader />}
          {props.type === "question" && !!props.coachingType && (
            <QuestionHeader type={props.coachingType} />
          )}
        </div>
        <div className="px-[28px] py-5 ">{props.children}</div>
      </div>
    </>
  );
}
