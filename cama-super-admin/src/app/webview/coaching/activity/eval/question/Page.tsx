import { useAtom, useAtomValue } from "jotai";
import ImageBox from "../../../component/ImageBox";
import ActivityLayout from "../../component/ActivityLayout";
import Activity4 from "@/assets/images/character/modal.png";
import ClearPic from "@/assets/images/character/missionClear.png";

import { motion } from "framer-motion";
import { answerAtom, cancerAtom, questionListAtom } from "../atoms/evalAtom";
import { useEffect } from "react";
import QuestionCard from "../../component/QuestionCard";
import CompleteCard from "../../component/CompleteCard";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";

// 설문
export default function ActivityQuestion() {
  // 암종
  const cancer = useAtomValue(cancerAtom);
  // 선택한 결과 목록
  const [answers, setAnswers] = useAtom(answerAtom);
  //  질문목록
  const questionList = useAtomValue(questionListAtom);
  //  현재 질문 번호
  const emptyIndex = answers.findIndex((item) => item === "");

  // Login Id
  const { loginId } = useParams();
  // 답변선택 Event
  const onClick = (index: number, value: "Y" | "N") => {
    const _answers = answers.map((element: string, i: number) =>
      i === index ? value : element
    );
    setAnswers(_answers);
  };

  // Nav
  const navigate = useNavigate();

  const { alert } = useAlert();
  // 암종체크
  useEffect(() => {
    if (cancer === "") {
      alert(
        { html: `암종이 초기화 되어 <br/>초기 화면으로 돌아갑니다.` },
        () => {
          navigate(`../E/content/${loginId}`);
        }
      );
    }
  }, []);

  return (
    <>
      <ActivityLayout
        title="운동평가"
        onNext={emptyIndex === -1 ? `../E/eval/result` : null}
      >
        <h1 className="text-center pb-5 text-f12 font-oneMobile text-camaColor1 ">
          신체 활동 수행 척도
        </h1>
        <div className="text-f5 text-center mb-5 bg-white  shadow-xl rounded-2xl p-[16px]  text-camaColor font-bold ">
          <ImageBox
            imgSrc={Activity4}
            className="w-[120px]"
            containerClassName="!mb-2"
          />
          다음은
          <span className="underline text-camaColor1 mx-1">{cancer}</span>
          환자의 <br /> 일상생활 신체 활동 수행 능력을 <br />
          평가하기 위한 문항들입니다.
        </div>

        <div className="flex flex-col ">
          {questionList.map((question, index) => {
            if (index === emptyIndex) {
              // 현재 step에 해당하는 카드만 렌더링합니다.
              return (
                <QuestionCard key={index} index={index} onClick={onClick}>
                  {question}
                </QuestionCard>
              );
            }
          })}
          {emptyIndex === -1 && <CompleteCard />}
          {emptyIndex === -1 && (
            <div className={`flex justify-center  items-center mt-5  `}>
              <motion.button
                className=" border-[3px] px-[30px] py-[5px] flex flex-col rounded-xl items-center gap-3  border-camaColor1 "
                whileTap={{ scale: 1.15 }}
                onClick={() => {
                  navigate(`../E/eval/result/${loginId}`);
                }}
              >
                <img src={ClearPic} alt="clear" className="w-[55px]" />
                <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px] flex justify-start flex-col items-start">
                  <span>결과확인</span>
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </ActivityLayout>
    </>
  );
}
