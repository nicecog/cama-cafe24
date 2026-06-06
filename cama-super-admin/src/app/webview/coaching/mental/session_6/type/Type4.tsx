import TextBox from "../../../component/Layout/TextBox";
import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import { useMemo } from "react";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";

// 무망감 / 무력감 - 자포자기형
export default function Type4() {
  const mentalTypeCd = getMentalTypeCode("자포자기형");
  const data1 = useGetAnswer("mental", "Q2", [mentalTypeCd + "21"]);
  const data2 = useGetAnswer("mental", "Q4", [mentalTypeCd + "07"]);
  const data3 = useGetAnswer("mental", "Q5", [mentalTypeCd + "07"]);

  const report = useMemo(() => {
    return {
      data1: data1[0]?.answerChoice || "",
      data2: data2[0]?.answerChoice || "",
      data3: data2[1]?.answerChoice || "",
      data4: data3[0]?.answerChoice || "",
      data5: data3[1]?.answerChoice || "",
    };
  }, [data1, data2, data3]);

  return (
    <>
      {/* <TextBox className="text-center">
        자포자기형의 당신은 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-2">
          <ImporText className="underline text-f6 tracking-tighter">{`${report.data1}`}</ImporText>
          이렇게요.
        </div>
        나 말하기 기법을 사용해서 원하는 것을 말하고 나를 돌볼거에요. <br />
        그리고 마음의 회복을 돕는
        <div className="my-2">
          <ImporText className="!ml-0">{report.data3}</ImporText>을
          <ImporText>{report.data2}</ImporText>에 연습했어요.
        </div>
        <div className="my-2">
          <ImporText className="!ml-0">{report.data4}</ImporText>에
          <ImporText>{report.data5}</ImporText>에서 복식호흡도 연습했어요.
        </div>
      </TextBox>

      <TextArea className="mt-5 text-center">
        나는 이제 나를 지키고 암에 잘 <br />
        대처해나갈 수 있어요!
      </TextArea> */}

      <TextArea className="mt-3 text-justify">
        자포자기형의 당신은 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText> {report.data1}</ImporText>
        </div>
        이렇게요.
      </TextArea>

      <TextBox className="text-justify tracking-tighter px-3.5 mt-2">
        나 말하기 기법을 사용해서 원하는 것을 말하고 나를 돌볼거에요. 그리고
        마음의 회복을 돕는
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data3}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data2}</ImporText>에
        </div>
        연습했어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data4}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data5}</ImporText>에서
        </div>
        복식호흡도 연습했어요.
      </TextBox>

      <TextArea className="mt-5 text-justify">
        나는 이제 나를 지키고 암에 잘 대처해 나갈 수 있어요!
      </TextArea>
    </>
  );
}
