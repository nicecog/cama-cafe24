import React, { useEffect } from "react";
import ActivityLayout from "../component/ActivityLayout";
import ImageBox from "../../component/ImageBox";
import ActivityPic from "@/assets/images/character/missionChallenge.png";
import ClearPic from "@/assets/images/character/missionClear.png";

import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { initAtom } from "./atoms/evalAtom";
const EvalPage: React.FC = () => {
  // Login Id
  const { loginId } = useParams();
  // Nav
  const navigate = useNavigate();

  const init = useSetAtom(initAtom);

  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  return (
    <ActivityLayout title="운동평가" onNext={`../E/eval/checkCancer`}>
      <h1 className="text-center pb-5 text-f12 font-oneMobile text-camaColor1">
        운동평가
      </h1>
      <ImageBox
        imgSrc={ActivityPic}
        className={"w-[120px]"}
        containerClassName="!mb-5 mt-10"
      />
      <div className="text-[17px] text-center mb-5 bg-white shadow-xl rounded-2xl px-[12px] py-[18px] text-camaColor tracking-tighter">
        본 설문은 중앙대학교병원 디지털암센터 에서 암 환자의 일상생활 신체 활동
        수행 능력을 평가하기 위하여 개발한 척도입니다.
      </div>
      <div className="text-f5 text-center p-[16px] font-bold">
        귀하의 평가 결과에 따라 적절한 수준의 운동프로그램을 제안하여 신체 활동
        능력 증진에 도움을 드리고자 합니다.
      </div>

      <div className={`flex justify-center  items-center mt-5  `}>
        <motion.button
          className=" border-[3px] px-[30px] py-[5px] flex flex-col rounded-xl items-center gap-3  border-camaColor1 "
          whileTap={{ scale: 1.15 }}
          onClick={() => {
            navigate(`../E/eval/checkCancer/${loginId}`);
          }}
        >
          <img src={ClearPic} alt="clear" className="w-[55px]" />
          <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px] flex justify-start flex-col items-start">
            <span>평가시작</span>
          </div>
        </motion.button>
      </div>
    </ActivityLayout>
  );
};

export default EvalPage;
