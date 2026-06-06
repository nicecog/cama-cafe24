import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSaveMental from "./useMental";
import { AnswersType } from "./Cards/CardTypes";
import Card1 from "./Cards/Card1";
import Card3 from "./Cards/Card3";
import Card4 from "./Cards/Card4";
import useMentalType from "@/hooks/useMentalType";

// 4회기
export default function Session4() {
  const { loginId } = useParams();
  const { saveAnswer } = useSaveMental(loginId!);

  useEffect(() => {
    return () => {};
  }, []);

  const onSave = (data: AnswersType[]) => {
    saveAnswer(data);
  };

  const type: string = useMentalType();

  // 카드별 솔루션
  // Card1  : 복식호흡
  // Card2 : 나말하기
  // Card3 : 명상솔루션
  // Card4 : 생각바꾸기

  return (
    <>
      {
        {
          ["전투형"]: (
            <Card3
              onSave={onSave}
              title={
                <>
                  마음의 휴식을 위한 <br />
                  명상
                </>
              }
            />
          ),
          ["순응형"]: (
            <Card1
              onSave={onSave}
              title={
                <>
                  기분을 다스리는 <br />
                  복식호흡
                </>
              }
            />
          ),
          ["억압형"]: (
            <Card4
              onSave={onSave}
              title={
                <>
                  기분을 달래는
                  <br />
                  생각 바꾸기
                </>
              }
            />
          ),
          ["자포자기형"]: (
            <Card3
              onSave={onSave}
              title={
                <>
                  마음의 회복을 돕는
                  <br /> 명상
                </>
              }
            />
          ),
          ["걱정형"]: (
            <Card4
              onSave={onSave}
              title={
                <>
                  걱정을 줄이기 위한
                  <br />
                  생각바꾸기
                </>
              }
            />
          ),
        }[type]
      }
    </>
  );
}
