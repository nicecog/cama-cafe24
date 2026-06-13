import { useMemo } from "react";
import useGetAnswer, { getMentalTypeCode } from "@/hooks/useGetAnswer";
import TextArea from "@/routes/_auth/_coaching/coaching/component/Layout/TextArea";
import ImporText from "../../component/ImportText";

export default function Type5() {
  const mentalTypeCd = getMentalTypeCode("걱정형");
  const data1 = useGetAnswer("mental", "Q2", [`${mentalTypeCd}07`]);
  const data2 = useGetAnswer("mental", "Q3", [`${mentalTypeCd}07`]);
  const data3 = useGetAnswer("mental", "Q4", [`${mentalTypeCd}21`]);

  const report = useMemo(() => {
    const first = data2[0]?.answerChoice || "";
    const second = data2[1]?.answerChoice || "";
    const firstIsMeditation = first.includes("명상");

    return {
      data1: data1[0]?.answerChoice || "",
      data2: data1[1]?.answerChoice || "",
      data3: firstIsMeditation ? first : second,
      data4: firstIsMeditation ? second : first,
      data5: data3[0]?.answerChoice || "",
    };
  }, [data1, data2, data3]);

  return (
    <>
      <TextArea className="px-0 text-center leading-relaxed text-base font-medium text-slate-700">
        걱정형의 당신은
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText className="!mx-0">{report.data1}</ImporText>에{" "}
          <ImporText className="!mx-0">{report.data2}</ImporText>에서
        </div>
        복식 호흡을 연습하며 편안함을 느꼈고,
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText className="!mx-0">{report.data3}</ImporText>을{" "}
          <ImporText className="!mx-0">{report.data4}</ImporText>에
        </div>
        연습하며 생각이 비워지는 것을 느꼈어요.
      </TextArea>
      <TextArea className="mt-4 text-center leading-relaxed text-base font-medium text-slate-700">
        그리고 걱정을 덜고 긍정적이고 현실적으로 생각할 수 있어요.
        <div className="my-3 rounded-2xl bg-primary/5 p-3.5 font-black text-primary text-center">
          <ImporText>{report.data5}</ImporText>
        </div>
        이렇게요.
      </TextArea>
      <TextArea className="mt-4 text-center leading-relaxed text-base font-medium text-slate-700">
        나 말하기 기법을 사용해서 원하는 것을 말하고 나를 돌볼거에요.
      </TextArea>
      <TextArea className="mt-5 text-center leading-relaxed text-base font-medium text-slate-700">
        나는 이제 나를 지키고 암에 잘 대처해 나갈 수 있어요!
      </TextArea>
    </>
  );
}
