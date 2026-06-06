import useAccountName from "@/hooks/useAccountName";
import ImageBox from "../../component/ImageBox";
import ActivityLayout from "../component/ActivityLayout";
import Activity1 from "@/assets/images/character/excercise.png";

import Workouts from "./Workouts";
import { useNavigate, useParams } from "react-router-dom";
import ImporText from "../../mental/component/ImportText";
import useActivityApi from "../useActivity";
import { useEffect } from "react";
import useAlert from "@/hooks/useAlert";

// const info = {
//   cancer: "갑상선암",
//   program: "초급",
//   aerobic: "유산소",
//   therapy: "음성치료",
// };

export default function ContentPage() {
  // 사용자명
  const accountName = useAccountName();
  const { alert } = useAlert();

  // Login Id
  const { loginId } = useParams();
  const navigate = useNavigate();

  const { getAnswerList } = useActivityApi(loginId);
  const { data: answerList } = getAnswerList();

  useEffect(() => {
    if (!answerList) {
      return;
    }

    if (answerList.length === 0) {
      alert(
        "등록된 운동평가정보가 없습니다. 운동평가를 먼저 진행합니다.",
        () => {
          navigate(`../E/eval/${loginId}`);
        }
      );
    }
  }, [answerList]);

  return (
    <>
      <ActivityLayout
        isClass={true}
        title="운동코칭"
        onPrev={() => {
          navigate(`../E/${loginId}`);
        }}
      >
        <h1 className="text-center pb-5 text-f12 font-oneMobile text-camaColor1">
          운동 콘텐츠
        </h1>
        <ImageBox
          imgSrc={Activity1}
          className={"w-[120px]"}
          containerClassName="!mb-5"
        />
        <div className="text-f5 text-center  bg-white shadow-xl rounded-2xl p-[16px] text-camaColor font-bold">
          <ImporText className="!ml-0"> {accountName}</ImporText>님 에게 적절한
          <br />
          운동 프로그램입니다.
        </div>

        <div className="mt-5">
          <h1 className="text-center text-f5 font-bold text-camaColor1 mb-1">
            운동을 선택하세요
          </h1>
          {/* 운동 콘텐츠  */}
          <Workouts />
        </div>
      </ActivityLayout>
    </>
  );
}
