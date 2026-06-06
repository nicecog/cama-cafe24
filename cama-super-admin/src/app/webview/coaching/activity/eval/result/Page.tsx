import { useAtomValue } from "jotai";
import {
  answerAtom,
  cancerAtom,
  questionListValueAtom,
} from "../atoms/evalAtom";
import ActivityLayout from "../../component/ActivityLayout";
import ImageBox from "../../../component/ImageBox";
import Char4 from "@/assets/images/character/char4.png";
import missionChallenge from "@/assets/images/character/missionChallenge.png";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { useEffect } from "react";
import useActivityApi, { getCode, getCodeName } from "../../useActivity";
import axios from "@/utils/axios";
import useAccountName from "@/hooks/useAccountName";

export default function EvalResult() {
  // Login Id
  const { loginId } = useParams();

  const { getExerciseContentList } = useActivityApi(loginId);

  const { data: contentList } = getExerciseContentList();

  const cancer = useAtomValue(cancerAtom);

  // 선택한 결과 목록
  const answers = useAtomValue(answerAtom);

  //  질문목록
  const questionList = useAtomValue(questionListValueAtom);

  const combined = questionList.map((question, index) => ({
    seq: index,
    question: question,
    answer: answers[index],
  }));

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

  //  운동 평가 ..
  const evaluateProgram = (
    cancerType: string,
    answers: string[]
  ): {
    program: string | null | undefined;
    aerobic: string;
    therapy: string;
  } => {
    // 모두 해당하지 않을경우 중급운동
    let program = "A2";
    let aerobic = "N";
    let therapy = "";

    //  고급운동 체크 시작
    // 1,3,5,7,8,10,11 문항이 모두 예 이면서
    if (
      [
        answers[0],
        answers[2],
        answers[4],
        answers[6],
        answers[7],
        answers[9],
        answers[10],
      ].every((r) => r === "Y")
    ) {
      // 갑상선 암의경우 15, 16 항목이 모두 예 일경우고급
      if (cancerType === "갑상선암") {
        if ([answers[14], answers[15]].every((r) => r === "Y")) {
          program = "A3";
        }
      }
      // 유방암의 경우 15번 문항이 예일경우 고급
      if (cancerType === "유방암") {
        if (answers[14] === "Y") {
          program = "A3";
        }
      }
      if (["대장암", "폐암"].includes(cancerType)) {
        program = "A3";
      }
    }

    // 11번이 Y일경우 초급
    if (answers[11] === "Y") {
      program = "A1";
    }

    //  11번이 Y가 아닐지라도 갑상선폐암 의 경우 14번 문항이  예인경우는  초급운동
    if (["갑상선암", "폐암"].includes(cancerType)) {
      if (answers[13] === "Y") {
        program = "A1";
      }
    }

    //  프로그램 배정 끝
    //유산소 배정
    if (answers[12] === "Y") {
      aerobic = "Y";
    }
    // 대장암 폐암의 케이스
    if (["대장암", "폐암"].includes(cancerType)) {
      if (cancerType === "대장암") {
        // 대장암 15, 16 번이 하나라도 예일경우 유산소 배정
        if (answers[14] === "Y" || answers[15] === "Y") {
          aerobic = "Y";
        }
      }
      if (cancerType === "폐암") {
        // 폐암 14
        if (answers[13] === "Y") {
          aerobic = "Y";
        }
      }
    }

    // 갑상선암 17번 문항에 "예" 로 답하는 경우 음성치료
    if (cancerType === "갑상선암" && answers[16] === "Y") {
      therapy = "T1";
    }
    // 폐암 15번 문항에 "예" 로 답하는 경우 객담배출/호흡근 운동
    if (cancerType === "폐암" && answers[14] === "Y") {
      therapy = "T2";
    }
    // 폐암 15번 문항에 "예" 로 답하는 경우 객담배출/호흡근 운동
    if (cancerType === "유방암" && answers[15] === "Y") {
      therapy = "T3";
    }

    return { program, aerobic, therapy };
  };

  // 결과 계산
  const { program, aerobic, therapy } = evaluateProgram(cancer, answers);

  const { saveExerciseUserClass } = useActivityApi(loginId);

  const { mutate } = saveExerciseUserClass();

  const accountName = useAccountName();

  // nav
  const navigate = useNavigate();

  // 완료 선택
  const onCompleteClick = () => {
    const defaultInfo = {
      accountName,
      answerChoice: "N",
      answerChoiceSeq: 0,
      categoryCd: "E",
      loginId,
      progressTypeCd: "A1",
      stepDayCd: "00",
    };
    // 암종별 운동

    // 1. 난이도 로 필터링
    const answerList = contentList.filter(
      (r: any) => r.difficultyCd === program
    );

    //  2. 암종별 필터링
    const cancerContent = answerList.filter(
      (item: any) => item.exerciseTypeCd === getCode(cancer)
    );

    // 공통 코어 추가
    const commonContent = answerList.filter(
      (item: any) => item.exerciseTypeCd === "E5"
    );

    // insert into sys_code_det values('EXERCISE_TYPE_CD', 'E5','공통(코어)','Y');
    //  insert into sys_code_det values('EXERCISE_TYPE_CD', 'E6','공통(유산소)','Y');
    // 3. 유산소 필터링 -- "E6" : 유산소
    //  TODO 특수치료는 없음...
    const aerobicContent = answerList.filter(
      (item: any) => item.exerciseTypeCd === "E6"
    );
    // E9 림프부종마사지  , E7 : 호흡운동 , E8 : 음성치료
    const therapyList = contentList.filter((r: any) => {
      const codeMap: { [key: string]: string } = {
        T1: "E8", //음성치료
        T2: "E7", //호흡운동
        T3: "E9", //림프부종마사지
      };
      return r.exerciseTypeCd === codeMap[therapy];
    });

    const params = [
      ...cancerContent,
      ...commonContent,
      ...(aerobic === "Y" ? aerobicContent : []),
      ...therapyList,
    ].map((r: any) => ({
      ...defaultInfo,
      refVal1: r.indexNum + r.exerciseTypeCd + r.difficultyCd,
    }));

    // { code: "T1", codeName: "음성치료" },
    // { code: "T2", codeName: "객담배출/호흡근운동" },
    // { code: "T3", codeName: "림프부종 마사지" },

    mutate(
      {
        loginId,
        surveyResult: combined, // <-- 신규 추가 문ㄴ답 항목
        cancerTypeCd: getCode(cancer),
        exerciseProgramCd: program,
        aerobic: aerobic,
        therapyCd: therapy,
      },
      {
        onSuccess: () => {
          alert(
            { text: "운동평가가 완료되었습니다! ", icon: "success" },
            () => {
              axios
                .put("/api/coaching/service/answerList", params)
                .then((response) => {
                  if (response.data.success) {
                    navigate(`../E/content/${loginId}`, {
                      state: { reload: true },
                    });
                  }
                });
            }
          );
        },
      }
    );
  };

  return (
    <>
      <ActivityLayout title="운동평가" onNext={null}>
        <h1 className="text-center pb-5 text-f12 font-oneMobile text-camaColor1 ">
          운동평가 결과
        </h1>
        <div className="text-f5 text-center mb-3 bg-white  shadow-xl rounded-2xl p-[16px] text-camaColor font-bold ">
          <ImageBox
            imgSrc={Char4}
            className="w-[130px]"
            containerClassName="!mb-5"
          />
          귀하에게는
          <span className="mx-1 underline text-camaColor1">
            {getCodeName(program || "")}
          </span>
          수준의 <br />
          운동 프로그램이 적절합니다.
          {(aerobic !== "N" || therapy) && (
            <div className="mt-2">
              추가적으로
              <div className=" border rounded-xl py-2 my-1 border-camaColor1">
                {aerobic && (
                  <>
                    <p className="underline text-camaColor1">
                      {getCodeName(aerobic)}
                    </p>
                  </>
                )}
                {therapy && (
                  <>
                    <p className="underline text-camaColor1">
                      {getCodeName(therapy)}
                    </p>
                  </>
                )}
              </div>
              {/* {aerobic && "유산소와 "}특수치료가 필요합니다. */}
              필요합니다.
            </div>
          )}
        </div>
        <div className="flex flex-col  justify-between items-center ">
          <div className="text-center text-camaColor mt-5 text-f6 font-bold">
            꾸준한 운동을 통해 신체 활동 <br />
            능력을 증진해보세요.
          </div>

          <div className={`flex justify-center  items-center mt-5 `}>
            <motion.button
              className=" border-[3px] px-[30px] py-[5px] flex rounded-xl items-center gap-3  border-camaColor1 "
              whileTap={{ scale: 1.15 }}
              onClick={onCompleteClick}
            >
              <img src={missionChallenge} alt="clear" className="w-[55px]" />
              <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px] flex justify-start flex-col items-start">
                <span>완료</span>
              </div>
            </motion.button>
          </div>
        </div>
      </ActivityLayout>
    </>
  );
}
