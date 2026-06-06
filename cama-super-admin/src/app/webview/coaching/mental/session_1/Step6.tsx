import { useAtom, useAtomValue } from "jotai";
import {
  questionResult,
  questionsAtom,
  trainingPlanAtom,
} from "./session1Atom";
import ImageBox from "../../component/ImageBox";
import TextBox from "../../component/Layout/TextBox";
import Image from "@/assets/images/character/advice3.png";
import TextArea from "../../component/Layout/TextArea";
import { ChangeEvent } from "react";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import SelectBox from "../../component/Layout/SelectBox";
import Hours from "../../component/Layout/Hours";
import useAlert from "@/hooks/useAlert";
import MentalButton from "../component/MentalButton";
import { useNavigate, useParams } from "react-router-dom";
import useAccountName from "@/hooks/useAccountName";
import axios from "@/utils/axios";

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

  // 완료
  const onOkHandler = () => {
    confirm(
      {
        html: `선택하신 마음근육 훈련 일정은 
        <p style="color:#FE8825;font-weight:600">[${trainingPlan.wday} - ${trainingPlan.time}시간]</p>
          입니다
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

        const params = [...d1, ...d2, ...answers].map((i: any) => ({
          ...i,
          answerChoiceSeq: 0,
          loginId,
          categoryCd: "D",
          accountName,
          stepDayCd: "Q1", // 1회기
        }));

        // ProgressTypeCd
        //  D: 도입,전개  E : 전투형   F: 순응형  G: 억압형 , H : 자포자기형 , J : 걱정형

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
      <div className="px-[25px] py-5 flex justify-center flex-col gap-2">
        <TextBox className="text-justify">
          <ImageBox
            imgSrc={Image}
            className="w-[115px]"
            containerClassName="mb-5"
          />
          <div className=" font-oneMobile text-center tracking-tighter text-[20px]">
            카마코치가
            <p className="mx-1 text-camaColor1">
              {result.dispName === "전투형" && "암과 맞서 싸우는"}
              {result.dispName === "순응형" && "암을 운명으로 받아들이고 있는"}
              {result.dispName === "억압형" && (
                <>
                  암과 관련된 것들을 피하고 싶은 <br />
                  억압형
                </>
              )}
              {result.dispName === "자포자기형" && "절망적이고 무력한"}
              {result.dispName === "걱정형" && "걱정과 불안이 큰"}
            </p>
            당신에게
          </div>
        </TextBox>

        {/* 각 유형별 인사  */}
        {/* 전투형 */}
        {result.dispName === "전투형" && (
          <>
            <TextArea className="text-justify">
              지친 마음을 쉬게 하고, 긍정적인 마음을 유지할 수 있도록
            </TextArea>
            <TextArea className="text-justify">
              마음근육을 키우는 방법을 알려드릴게요.
            </TextArea>
          </>
        )}
        {/* 순응형 */}
        {result.dispName === "순응형" && (
          <>
            <TextArea className="text-justify">
              힘이 나도록 도와줄 마음 관리법을 알려드릴게요
            </TextArea>
          </>
        )}
        {/* 억압형 */}
        {result.dispName === "억압형" && (
          <>
            <TextArea className="text-justify">
              마음을 편하게 할 수 있는 방법을 알려드릴게요.
            </TextArea>
          </>
        )}
        {/* 자포자기형 */}
        {result.dispName === "자포자기형" && (
          <>
            <TextArea className="text-justify">
              힘이 나도록 도와줄 마음 관리법을 알려드릴게요
            </TextArea>
          </>
        )}
        {/* 걱정형 */}
        {result.dispName === "걱정형" && (
          <>
            <TextArea className="text-justify">
              마음을 편하게 할 수 있는 방법을 알려드릴게요.
            </TextArea>
          </>
        )}

        {/* 유형별 인사 끝 */}
        <TextArea className="text-justify mt-5">
          일주일에 두 번씩 2주동안 마음근육을 키우는 방법을 하나씩 연습해
          보아요.
        </TextArea>

        {/* 유형별 인사 */}
        <TextArea className="text-justify mt-5">
          먼저, 마음근육훈련 일정을 정해볼게요.
        </TextArea>
        <TextBox>
          <div>
            <TextAreaTitle className="!mb-1">요일</TextAreaTitle>
            <SelectBox
              value={trainingPlan.wday}
              onChange={onChangeHandler("wday")}
              className="w-full p-1 max-h-28 rounded-lg border-[#774F2D] border-2"
              options={weekdays.map((t) => ({ label: t, value: t }))}
            />
          </div>
          <div className="mt-5">
            <TextAreaTitle className="!mb-1">시간</TextAreaTitle>
            <Hours
              onChange={onChangeHandler("time")}
              value={trainingPlan.time}
            />
          </div>
        </TextBox>

        <MentalButton onClick={onOkHandler}>마음훈련시작</MentalButton>
      </div>
    </>
  );
}
