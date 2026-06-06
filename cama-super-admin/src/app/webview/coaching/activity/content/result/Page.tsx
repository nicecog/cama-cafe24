import ActivityLayout from "../../component/ActivityLayout";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Mission from "@/assets/images/character/mission.png";
import missionChallenge from "@/assets/images/character/missionChallenge.png";
import missionClear from "@/assets/images/character/missionClear.png";
import { motion } from "framer-motion";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { onCompleteAtom, workOutAtom } from "../atoms/contentAtom";
import axios from "@/utils/axios";
import useActivityApi from "../../useActivity";
import Complete from "./CompleteModal";
import { useState } from "react";
export default function WorkoutContentPage() {
  // Confirm
  const { confirm } = useAlert();

  // Login Id
  const { loginId } = useParams();

  const navigate = useNavigate();

  const workout = useAtomValue(workOutAtom);

  const { getAnswerList } = useActivityApi(loginId);

  const onCompleteHandler = useSetAtom(onCompleteAtom);

  const { data: answerList } = getAnswerList();

  const onRetryClick = () => {
    confirm({ text: "운동을 다시 해볼까요 ? ", icon: "question" }, () => {
      navigate(-1);
    });
  };

  // 완료 빵빠래
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onComplete = () => {
    const params = answerList.map((item: any) => ({
      ...item,
      loginId,
      answerChoice:
        item.refVal1 ===
        workout.indexNum + workout.exerciseTypeCd + workout.difficultyCd
          ? "Y"
          : item.answerChoice,
    }));

    axios.put("/api/coaching/service/answerList", params).then((response) => {
      if (response.data.success) {
        setIsOpen(true);
      }
    });
  };

  const onClose = () => {
    setIsOpen(false);
    onCompleteHandler();
    navigate(`../E/content/${loginId}`);
  };

  return (
    <>
      <ActivityLayout title="운동콘텐츠">
        <div className="flex flex-col justify-center items-center">
          <img src={Mission} className="w-[100px] mb-5" />
          <MissionTitle>정말 잘 하셨습니다!</MissionTitle>
        </div>
        <div className="text-f5 text-center  bg-white shadow-xl rounded-2xl p-[16px] text-camaColor font-bold mt-10">
          운동을 할 때에는 무리하지 않고 <br />
          가능한 범위 내에서 실시하는 것이 <br />
          가장 중요합니다.
        </div>
        <div className="text-f5 text-center   text-camaColor font-bold mt-7">
          앞으로도 꾸준히 연습해보세요.
        </div>

        <div className="flex gap-5 justify-center">
          <div
            className={`flex justify-center  items-center mt-5 bg-white  w-[140px] `}
          >
            <motion.button
              className=" border-[2px] px-[15px] py-[5px] flex rounded-xl flex-col items-center w-full  border-camaColor1 "
              whileTap={{ scale: 1.05 }}
              onClick={onRetryClick}
            >
              <img
                src={missionChallenge}
                alt="clear"
                className="w-[45px] h-[50px]"
              />
              <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px]  flex justify-start flex-col items-start">
                <span>다시하기</span>
              </div>
            </motion.button>
          </div>
          <div
            className={`flex justify-center  items-center mt-5 bg-white w-[140px] `}
          >
            <motion.button
              className=" border-[2px] px-[15px] py-[5px] flex rounded-xl flex-col items-center w-full  border-camaColor1 "
              whileTap={{ scale: 1.05 }}
              onClick={onComplete}
            >
              <img
                src={missionClear}
                alt="clear"
                className="w-[45px] h-[50px]"
              />
              <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px]  flex justify-start flex-col items-start">
                <span>완료</span>
              </div>
            </motion.button>
          </div>
        </div>
        <Complete isOpen={isOpen} onClose={onClose} />
      </ActivityLayout>
    </>
  );
}
