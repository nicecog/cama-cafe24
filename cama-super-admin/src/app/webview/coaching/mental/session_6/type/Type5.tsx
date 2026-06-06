import TextBox from "../../../component/Layout/TextBox";
import TextArea from "../../../component/Layout/TextArea";
import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import { useMemo } from "react";
import ImporText from "../../component/ImportText";

// 걱정형 - 불안몰두
export default function Type5() {
  const mentalTypeCd = getMentalTypeCode("걱정형");
  const data1 = useGetAnswer("mental", "Q2", [mentalTypeCd + "07"]);
  const data2 = useGetAnswer("mental", "Q3", [mentalTypeCd + "07"]);
  const data3 = useGetAnswer("mental", "Q4", [mentalTypeCd + "21"]);

  const report = useMemo(() => {
    return {
      data1: data1[0]?.answerChoice || "",
      data2: data1[1]?.answerChoice || "",
      data3: data2[0]?.answerChoice.includes("명상")
        ? data2[0]?.answerChoice
        : data2[1]?.answerChoice,
      data4: data2[0]?.answerChoice.includes("명상")
        ? data2[1]?.answerChoice
        : data2[0]?.answerChoice,
      data5: data3[0]?.answerChoice || "",
    };
  }, [data1, data2, data3]);

  return (
    <>
      {/* <TextBox className="text-justify">
        걱정형의 당신은
        <ImporText className="">{report.data1}</ImporText>에
        <ImporText>{report.data2}</ImporText>에서 복식 호흡을 연습하며 편안함을
        느꼈고,
        <ImporText className="">{report.data3}</ImporText>을
        <ImporText>{report.data4}</ImporText>에 연습하며 생각이 비워지는 것을
        느꼈어요.
      </TextBox> */}
      <TextBox className="text-justify tracking-tighter px-3.5">
        걱정형의 당신은
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data1}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data2}</ImporText>에서
        </div>
        복식 호흡을 연습하며 편안함을 느꼈고,
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data3}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data4}</ImporText>에
        </div>
        연습하며 생각이 비워지는 것을 느꼈어요.
      </TextBox>

      <TextArea className="mt-3 text-justify">
        그리고 걱정을 덜고 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText> {report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>
      <TextArea className="mt-3 text-justify">
        나 말하기 기법을 사용해서 원하는 것을 말하고 나를 돌볼거에요.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        나는 이제 나를 지키고 암에 잘 대처해 나갈 수 있어요!
      </TextArea>
    </>
  );
}
