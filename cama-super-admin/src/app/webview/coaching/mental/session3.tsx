import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSaveMental from "./useMental";
import { AnswersType } from "./Cards/CardTypes";
import Card1 from "./Cards/Card1";
import Card2 from "./Cards/Card2";
import Card3 from "./Cards/Card3";
import Card4 from "./Cards/Card4";
import useMentalType from "@/hooks/useMentalType";

// 3회기
export default function Session3() {
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
          ["순응형"]: (
            <Card3
              onSave={onSave}
              title={
                <>
                  마음을 달래는 <br />
                  명상
                </>
              }
            />
          ),
          ["억압형"]: (
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
          ["자포자기형"]: (
            <Card2
              onSave={onSave}
              title={
                <>
                  나를 돌보는
                  <br /> 마음 표현하기
                </>
              }
            />
          ),
          ["걱정형"]: (
            <Card3
              onSave={onSave}
              title={
                <>
                  생각을 덜어내기 위한 <br />
                  명상
                </>
              }
            />
          ),
        }[type]
      }
    </>
  );
}
