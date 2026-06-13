import { useMemo } from "react";
import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import TextArea from "@/routes/_auth/_coaching/coaching/component/Layout/TextArea";
import ImporText from "../../component/ImportText";

export default function Type1() {
  const mentalTypeCd = getMentalTypeCode("전투형");
  const data1 = useGetAnswer("mental", "Q2", [`${mentalTypeCd}07`]);
  const data2 = useGetAnswer("mental", "Q4", [`${mentalTypeCd}07`]);
  const data3 = useGetAnswer("mental", "Q3", [`${mentalTypeCd}21`]);

  const report = useMemo(
    () => ({
      data1: data1[0]?.answerChoice || "",
      data2: data1[1]?.answerChoice || "",
      data3: data2[0]?.answerChoice || "",
      data4: data2[1]?.answerChoice || "",
      data5: data3[0]?.answerChoice || "",
    }),
    [data1, data2, data3],
  );

  return (
    <>
      <TextArea className="px-0 text-center leading-relaxed text-base font-medium text-slate-700">
        전투형의 당신은 마음의 휴식을 위해
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText className="!mx-0">{report.data1}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data2}</ImporText>에서
        </div>
        복식 호흡을 연습하고,
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText className="!mx-0">{report.data4}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data3}</ImporText>에
        </div>
        연습했어요.
      </TextArea>
      <TextArea className="mt-4 text-center leading-relaxed text-base font-medium text-slate-700">
        그리고 어떤 상황이든 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText>{report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>
      <TextArea className="mt-4 text-center leading-relaxed text-base font-medium text-slate-700">
        마음이 불편할 때 참지 않고 나 말하기 기법으로 이야기해볼 거에요.
      </TextArea>
      <TextArea className="mt-5 text-center leading-relaxed text-base font-medium text-slate-700">
        나는 나를 지키고 암에 잘 대처해나갈 수 있어요!
      </TextArea>
    </>
  );
}
