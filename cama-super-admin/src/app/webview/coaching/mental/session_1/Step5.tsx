import { useAtom, useAtomValue } from "jotai";
import {
  questionResult,
  questionsAtom,
  trainingPlanAtom,
  trainingPlanAtom2,
} from "./session1Atom";
import MentalHeader from "@/assets/images/character/mentalheader.png";
import { motion } from "framer-motion";
import TextBox from "../../component/Layout/TextBox";
import { ChangeEvent } from "react";
import SelectBox from "../../component/Layout/SelectBox";
import Hours from "./Hour";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import useAccountName from "@/hooks/useAccountName";
import axios from "@/utils/axios";
import Footer from "../component/Footer";
import MissionTitle from "../../component/Layout/MissionTitle";
import Bubble from "../component/Bubble";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import { getUpcomingDates, isDuplicateSelection } from "../mentalUtil";
const defaultParams = [
  { progressTypeCd: "E01", answerChoice: "" },
  { progressTypeCd: "E02", answerChoice: "" },
  { progressTypeCd: "E03", answerChoice: "" },
  { progressTypeCd: "E04", answerChoice: "" },
  { progressTypeCd: "E05", answerChoice: "" },
  { progressTypeCd: "E06", answerChoice: "" },
  { progressTypeCd: "F01", answerChoice: "" },
  { progressTypeCd: "F02", answerChoice: "" },
  { progressTypeCd: "F03", answerChoice: "" },
  { progressTypeCd: "F04", answerChoice: "" },
  { progressTypeCd: "F05", answerChoice: "" },
  { progressTypeCd: "F06", answerChoice: "" },
  { progressTypeCd: "G01", answerChoice: "" },
  { progressTypeCd: "G02", answerChoice: "" },
  { progressTypeCd: "G03", answerChoice: "" },
  { progressTypeCd: "G04", answerChoice: "" },
  { progressTypeCd: "G05", answerChoice: "" },
  { progressTypeCd: "G06", answerChoice: "" },
  { progressTypeCd: "H01", answerChoice: "" },
  { progressTypeCd: "H02", answerChoice: "" },
  { progressTypeCd: "H03", answerChoice: "" },
  { progressTypeCd: "H04", answerChoice: "" },
  { progressTypeCd: "H05", answerChoice: "" },
  { progressTypeCd: "H06", answerChoice: "" },
  { progressTypeCd: "J01", answerChoice: "" },
  { progressTypeCd: "J02", answerChoice: "" },
  { progressTypeCd: "J03", answerChoice: "" },
  { progressTypeCd: "J04", answerChoice: "" },
  { progressTypeCd: "J05", answerChoice: "" },
  { progressTypeCd: "J06", answerChoice: "" },
];

const typeCdMap: { [key: string]: string } = {
  전투형: "E06",
  순응형: "F06",
  억압형: "G06",
  자포자기형: "H06",
  걱정형: "J06",
  // 다른 유형들도 추가
};

const weekdays = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export default function Step6() {
  // 선택결과
  const result = useAtomValue(questionResult);
  // 답변 목록
  const questions = useAtomValue(questionsAtom);

  // 훈련일정
  const [trainingPlan, setTrainingPlan] = useAtom(trainingPlanAtom);
  const [trainingPlan2, setTrainingPlan2] = useAtom(trainingPlanAtom2);
  // loginId
  const { loginId } = useParams();
  // Alert
  const { confirm, alert } = useAlert();
  // account Name
  const accountName = useAccountName();
  // navi
  const navigate = useNavigate();

  // OnChange Event
  const onChangeHandler =
    (name: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      setTrainingPlan({ ...trainingPlan, [name]: e.target.value });
    };

  // OnChange Event
  const onChangeHandler2 =
    (name: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      setTrainingPlan2({ ...trainingPlan2, [name]: e.target.value });
    };

  // 완료
  const onOkHandler = () => {
    if (isDuplicateSelection(trainingPlan, trainingPlan2)) {
      alert("동일한 일정은 선택하실수 없어요");
      return;
    }

    confirm(
      {
        html: `선택하신 마음근육 훈련 일정은 
        <p style="color:#FE8825;font-weight:600">[${trainingPlan.wday} - ${trainingPlan.time}시]</p>
        <p style="color:#FE8825;font-weight:600">[${trainingPlan2.wday} - ${trainingPlan2.time}시]</p>
          입니다.
        `,
      },

      async () => {
        // 도입
        const d1 = questions.map((r) => ({
          answerChoice: r.text + " : " + r.value,
          refVal1: r.value + "",
          progressTypeCd: "D1",
        }));

        const d2 = [
          {
            answerChoice: result.dispName,
            refVal1: result.type,
            progressTypeCd: "D2",
          },
        ];

        const answers = defaultParams.map((item) => ({
          progressTypeCd: item.progressTypeCd,
          answerChoice:
            typeCdMap[result.dispName] === item.progressTypeCd
              ? `${trainingPlan.wday} - ${trainingPlan.time}`
              : item.answerChoice,
        }));

        const answers2 = defaultParams.map((item) => ({
          progressTypeCd: item.progressTypeCd,
          answerChoice:
            typeCdMap[result.dispName] === item.progressTypeCd
              ? `${trainingPlan2.wday} - ${trainingPlan2.time}`
              : item.answerChoice,
        }));

        const params = [...d1, ...d2, ...answers, ...answers2].map(
          (i: any) => ({
            ...i,
            answerChoiceSeq: 0,
            loginId,
            categoryCd: "D",
            accountName,
            stepDayCd: "Q1", // 1회기
          })
        );

        // ProgressTypeCd
        //  D: 도입,전개  E : 전투형   F: 순응형  G: 억압형 , H : 자포자기형 , J : 걱정형

        // 푸시등록
        const results = getUpcomingDates([trainingPlan, trainingPlan2]);
        //  Data
        const _list = results.map(({ startDate, time }) => ({
          loginId,
          startDate,
          time,
          categoryType: "D", // 심리
          memo: "심리",
        }));

        await axios.put("/api/coaching/service/saveSchedule", _list);

        const response = await axios.put(
          "/api/coaching/service/answerList",
          params
        );

        if (response.data.success) {
          alert("저장되었습니다.");
          navigate(`/webview/coaching/${loginId}`, {
            state: { reload: true },
          });
        }
      }
    );
  };

  return (
    <>
      <div className="px-[25px] py-5 flex justify-center flex-col gap-1.5">
        <Bubble type="type3">
          먼저, <br />
          마음근육훈련 일정을 <br />
          정해볼게요.
        </Bubble>

        <TextAreaTitle className="mt-5 !mb-0">일정 설정</TextAreaTitle>
        <TextBox className=" border border-camaColor !mt-0">
          <p className="font-oneMobile border-b pl-2 text-camaColor mb-2 pb-1">
            첫번째 일정
          </p>
          <div className="flex items-center gap-3 ">
            <div className="w-full">
              <MissionTitle className="!mb-1 !ml-2 !text-left">
                요일
              </MissionTitle>
              <SelectBox
                value={trainingPlan.wday}
                onChange={onChangeHandler("wday")}
                className="w-full p-1 max-h-28 rounded-lg border-[#774F2D] border-2"
                options={weekdays.map((t) => ({ label: t, value: t }))}
              />
            </div>
            <div className="w-full">
              <MissionTitle className="!mb-1 !ml-2 !text-left">
                시간
              </MissionTitle>
              <Hours
                onChange={onChangeHandler("time")}
                value={trainingPlan.time}
              />
            </div>
          </div>
          <p className="font-oneMobile border-b pl-2 text-camaColor mb-2 pb-1 mt-5">
            두번째 일정
          </p>
          <div className="flex items-center gap-3 ">
            <div className="w-full">
              <MissionTitle className="!mb-1 !ml-2 !text-left">
                요일
              </MissionTitle>
              <SelectBox
                value={trainingPlan2.wday}
                onChange={onChangeHandler2("wday")}
                className="w-full p-1 max-h-28 rounded-lg border-[#774F2D] border-2"
                options={weekdays.map((t) => ({ label: t, value: t }))}
              />
            </div>
            <div className="w-full">
              <MissionTitle className="!mb-1 !ml-2 !text-left">
                시간
              </MissionTitle>
              <Hours
                onChange={onChangeHandler2("time")}
                value={trainingPlan2.time}
              />
            </div>
          </div>
        </TextBox>

        <div className={`flex justify-center  items-center  mt-2 w-full   `}>
          <motion.button
            className=" border-[2px] px-[15px] py-[5px] flex rounded-xl flex-col items-center w-full bg-white     border-camaColor1 "
            whileTap={{ scale: 1.05 }}
            onClick={onOkHandler}
          >
            <div className="font-oneMobile text-[22px] text-camaColor1 leading-[32px]  flex justify-start items-center gap-3">
              <img
                src={MentalHeader}
                alt="clear"
                className="w-[35px] h-[35px]"
              />
              마음훈련시작
            </div>
          </motion.button>
        </div>
        {/* <button
          onClick={() => {
            axios
              .put("/api/coaching/service/deleteSchedule", {
                loginId,
                categoryType: "D",
              })
              .then((r) => {});
          }}
        >
          삭제{" "}
        </button> */}

        <Footer />
      </div>
    </>
  );
}
