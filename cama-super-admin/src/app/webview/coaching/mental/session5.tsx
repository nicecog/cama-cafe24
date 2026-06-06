import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSaveMental from "./useMental";
import { AnswersType } from "./Cards/CardTypes";
import Card1 from "./Cards/Card1";
import Card2 from "./Cards/Card2";
import Card4 from "./Cards/Card4";
import useMentalType from "@/hooks/useMentalType";

// 2회기
export default function Session5() {
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
            <Card2
              onSave={onSave}
              title={
                <>
                  나를 돌보는 <br />
                  마음 표현하기
                </>
              }
            />
          ),
          ["순응형"]: (
            <Card4
              onSave={onSave}
              title={
                <>
                  긍정적인 마음을 위한 <br />
                  생각바꾸기
                </>
              }
            />
          ),
          ["억압형"]: (
            <Card2
              onSave={onSave}
              title={
                <>
                  적극적 대처를 위한 <br />
                  마음표현하기
                </>
              }
            />
          ),
          ["자포자기형"]: (
            <Card1
              onSave={onSave}
              title={
                <>
                  마음이 편안해지는
                  <br /> 복식호흡
                </>
              }
            />
          ),
          ["걱정형"]: (
            <Card2
              onSave={onSave}
              title={
                <>
                  나를 돌보는 <br />
                  마음 표현하기
                </>
              }
            />
          ),
        }[type]
      }
    </>
  );
}
