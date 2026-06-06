import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import { useMemo } from "react";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";

// 순응형 - 운명론
export default function Type2() {
  const mentalTypeCd = getMentalTypeCode("순응형");
  const data1 = useGetAnswer("mental", "Q3", [mentalTypeCd + "07"]);
  const data2 = useGetAnswer("mental", "Q4", [mentalTypeCd + "07"]);
  const data3 = useGetAnswer("mental", "Q5", [mentalTypeCd + "21"]);

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
      {/* <TextBox className="text-center">
        순응형의 당신은 마음이 불편할 때 참지 않고 나 말하기 기법으로 이야기하는
        방법을 알아요. 마음을 달래기 위해
        <div className="my-2">
          <div>
            <ImporText className="!ml-0">{report.data2}</ImporText>을
            <ImporText>{report.data1}</ImporText>에 연습했고,
          </div>
        </div>
        <div className="my-2">
          <div>
            <ImporText className="!ml-0">{report.data3}</ImporText>에
            <ImporText>{report.data4}</ImporText>에서 복식호흡을 연습했어요.
          </div>
        </div>
        그리고 어떤 상황이든 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-2">
          <ImporText className="underline text-f6 tracking-tighter">{`${report.data5}`}</ImporText>
          이렇게요.
        </div>
      </TextBox>
      <TextArea className="mt-5 text-center">
        나는 나를 지키고 암에 <br />잘 대처해나갈 수 있어요!
      </TextArea> */}

      <TextBox className="text-justify tracking-tighter px-3.5">
        순응형의 당신은 마음이 불편할 때 참지 않고 나 말하기 기법으로 이야기하는
        방법을 알아요. 마음을 달래기 위해
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data2}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data1}</ImporText>에
        </div>
        연습했고
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText className="!mx-0">{report.data3}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data4}</ImporText>에서
        </div>
        복식호흡을 연습했어요.
      </TextBox>

      <TextArea className="mt-3 text-justify">
        그리고 어떤 상황이든 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="border rounded-lg shadow-md p-2 my-2 bg-gray-100 font-oneMobile">
          <ImporText> {report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        나는 이제 나를 지키고 암에 잘 대처해 나갈 수 있어요!
      </TextArea>
    </>
  );
}
