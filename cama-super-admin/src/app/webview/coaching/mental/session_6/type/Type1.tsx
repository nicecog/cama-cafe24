import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import { useMemo } from "react";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";

// 순응형 - 운명론
export default function Type1() {
  const mentalTypeCd = getMentalTypeCode("전투형");
  const data1 = useGetAnswer("mental", "Q2", [mentalTypeCd + "07"]);
  const data2 = useGetAnswer("mental", "Q4", [mentalTypeCd + "07"]);
  const data3 = useGetAnswer("mental", "Q3", [mentalTypeCd + "21"]);

  const report = useMemo(() => {
    return {
      data1: data1[0]?.answerChoice || "",
      data2: data1[1]?.answerChoice || "",
      data3: data2[0]?.answerChoice || "",
      data4: data2[1]?.answerChoice || "",
      data5: data3[0]?.answerChoice || "",
    };
  }, [data1, data2, data3]);

  return (
    <>
      {/* <TextBox className="text-justify">
        전투형의 당신은 마음의 휴식을 위해
        <div className="my-2">
          <ImporText className="!ml-0">{report.data1}</ImporText>에
          <ImporText>{report.data2}</ImporText>에서 복식호흡을 연습하고,
        </div>
        <div className="my-2">
          <ImporText className="!ml-0">{report.data4}</ImporText>을
          <ImporText>{report.data3}</ImporText>에 연습했어요.
        </div>
        그리고 어떤 상황이든 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-2">
          <ImporText className="underline text-f6 tracking-tighter">{`${report.data5}`}</ImporText>
          이렇게요.
        </div>
        마음이 불편할 때 참지 않고 나 말하기 기법으로 이야기해볼거에요.
      </TextBox> */}
      <TextBox className="text-justify tracking-tighter px-3.5">
        전투형의 당신은 마음의 휴식을 위해
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data1}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data2}</ImporText>에서
        </div>
        복식 호흡을 연습하고,
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data4}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data3}</ImporText>에
        </div>
        연습했어요.
      </TextBox>
      <TextArea className="mt-3 text-justify">
        그리고 어떤 상황이든 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText> {report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>
      <TextArea className="mt-3 text-justify">
        마음이 불편할 때 참지 않고 나 말하기 기법으로 이야기해볼 거에요.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        나는 나를 지키고 암에 잘 대처해나갈 수 있어요!
      </TextArea>
    </>
  );
}
