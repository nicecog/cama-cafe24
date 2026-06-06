import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";
import axios from "@/utils/axios";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { answersAtom } from "./Cards/CardAtom";

import getAnswerTemplate from "./AnswerTemplate/answerList";

import useMentalType from "@/hooks/useMentalType";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getState } from "../lib/coachingSlice";
import { useMemo } from "react";
const mapping: {
  [key: string]: string;
} = {
  ["전투형"]: "E",
  ["순응형"]: "F",
  ["억압형"]: "G",
  ["자포자기형"]: "H",
  ["걱정형"]: "J",
};
const useSaveMental = (loginId?: string) => {
  // navigate
  const navigate = useNavigate();
  // 사용자명
  const accountName = useAccountName();
  // Alert
  const { alert } = useAlert();
  //  Answers
  const answers = useAtomValue(answersAtom);

  const progress = useSelector((s: RootState) => getState(s).progress);

  const currentProgress = useMemo(() => {
    return progress.find((r: any) => r.categoryCd === "D")?.progress || 0;
  }, [progress]);

  // 타입
  // 전투형: "E",
  // 순응형: "F",
  // 억압형: "G",
  // 자포자기형: "H",
  // 걱정형: "J",
  const type = useMentalType();

  // 현재 Step Day Cd
  const stepDayCd = useSelector((s: RootState) => getState(s).mental.stepDayCd);
  // stepDayCd를 숫자로 변환하고 +1
  const stepNumber = parseInt(stepDayCd, 10) + 1;

  const saveAnswer = (data: any[]) => {
    const _save = [...answers, ...data].map((r) => ({
      progressTypeCd: mapping[type] + r.progressTypeCd,
      answerChoice: r.answerChoice,
    }));

    const template = getAnswerTemplate(stepNumber);

    // 데이터 처리 및 정렬
    const updatedData = [
      ..._save,
      ...template
        .filter(
          ({ progressTypeCd }) =>
            !_save.some((answer) => answer.progressTypeCd === progressTypeCd)
        )
        .map((r) => ({ ...r, answerChoice: "" })),
    ]
      .map((r) => ({
        ...r,
        accountName,
        loginId,
        answerChoiceSeq: 0,
        categoryCd: "D",
        stepDayCd: "Q" + stepNumber,
      }))
      .sort((a, b) => {
        // progressTypeCd 기준으로 내림차순 정렬
        if (a.progressTypeCd > b.progressTypeCd) return -1;
        if (a.progressTypeCd < b.progressTypeCd) return 1;
        return 0;
      });

    // API 호출
    axios
      .put("/api/coaching/service/answerList", updatedData)
      .then((response) => {
        if (response.data.success) {
          alert("저장되었습니다.", () => {
            navigate(`/webview/coaching/${loginId}`, {
              state: { reload: true },
            });
          });
        }
      });
  };

  const saveComplete = () => {
    if (currentProgress === 100) {
      alert("수고 하셨습니다!", () => {
        navigate(`/webview/coaching/${loginId}`, {
          state: { reload: true },
        });
      });
      return;
    }

    const params = ["Q6", "Q7"].map((r) => ({
      accountName,
      loginId,
      answerChoice: "",
      answerChoiceSeq: 0,
      categoryCd: "D",
      progressTypeCd: mapping[type] + "01",
      stepDayCd: r,
    }));

    // API 호출
    axios.put("/api/coaching/service/answerList", params).then((response) => {
      if (response.data.success) {
        alert("저장되었습니다.", () => {
          navigate(`/webview/coaching/${loginId}`, {
            state: { reload: true },
          });
        });
      }
    });
  };

  return { saveAnswer, saveComplete };
};

export default useSaveMental;
