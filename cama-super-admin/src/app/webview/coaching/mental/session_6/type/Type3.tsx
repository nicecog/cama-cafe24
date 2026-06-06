import TextBox from "../../../component/Layout/TextBox";
import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import { useMemo } from "react";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";

// 억압형 -인지적 회피
export default function Type3() {
  const mentalTypeCd = getMentalTypeCode("억압형");
  const data1 = useGetAnswer("mental", "Q2", [mentalTypeCd + "07"]);
  const data2 = useGetAnswer("mental", "Q3", [mentalTypeCd + "07"]);
  const data3 = useGetAnswer("mental", "Q4", [mentalTypeCd + "21"]);

  const report = useMemo(() => {
    return {
      data1: data1[0]?.answerChoice.includes("명상")
        ? data1[0]?.answerChoice
        : data1[1]?.answerChoice,
      data2: data1[0]?.answerChoice.includes("명상")
        ? data1[1]?.answerChoice
        : data1[0]?.answerChoice || "",

      data3: data2[0]?.answerChoice || "",
      data4: data2[1]?.answerChoice || "",
      data5: data3[0]?.answerChoice || "",
    };
  }, [data1, data2, data3]);

  return (
    <>
      {/* <TextBox className="text-center">
        억압형의 당신은 마음을 <br />
        알아차리는 데 도움이되는 <br />
        <div className="my-2">
          <ImporText className="!ml-0">{report.data1}</ImporText>을
          <ImporText>{report.data2}</ImporText>에 연습했어요.
        </div>
        <div className="my-2">
          <ImporText className="!ml-0">{report.data3}</ImporText>에
          <ImporText>{report.data4}</ImporText>에서 복식호흡도 연습했어요.
        </div>
        그리고 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-2">
          <ImporText className="underline text-f6 tracking-tighter">{`${report.data5}`}</ImporText>
          이렇게요.
        </div>
        나 말하기 기법을 사용해서 피하지 않고 적극적으로 내가 원하는 것을
        말할거에요.
      </TextBox>

      <TextArea className="mt-5 text-center">
        나는 나를 지키고 암에 <br />잘 대처해나갈 수 있어요!
      </TextArea> */}

      <TextBox className="text-justify tracking-tighter px-3.5">
        억압형의 당신은 마음을 알아차리는 데 도움이되는
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText>{report.data1}</ImporText>을
          <ImporText>{report.data2}</ImporText>에
        </div>
        연습했어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText>{report.data3}</ImporText>에
          <ImporText>{report.data4}</ImporText>에서
        </div>
        복식 호흡도 연습했어요.
      </TextBox>

      <TextArea className="mt-3 text-justify">
        그리고 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText> {report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>
      <TextArea className="mt-3 text-justify">
        나 말하기 기법을 사용해서 피하지 않고 적극적으로 내가 원하는 것을
        말할거에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        나는 이제 나를 지키고 암에 잘 대처해 나갈 수 있어요!
      </TextArea>
    </>
  );
}
