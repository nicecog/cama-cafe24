import useMentalType from "@/hooks/useMentalType";

import useAccountName from "@/hooks/useAccountName";
import TextArea from "../../component/Layout/TextArea";

import Type1 from "./type/Type1";
import Type2 from "./type/Type2";
import Type3 from "./type/Type3";
import Type4 from "./type/Type4";
import Type5 from "./type/Type5";
import ImporText from "../component/ImportText";
import TextBox from "../../component/Layout/TextBox";
import { useSetAtom } from "jotai";

import Footer from "../component/Footer";

import Image1 from "./result.png";

import { nextStepAtom } from "./session6Atom";
import ImageBox from "../../component/ImageBox";

type TechniqueType = "전투형" | "순응형" | "억압형" | "자포자기형" | "걱정형";

const techniques: Record<TechniqueType, string[]> = {
  전투형: ["복식호흡", "생각바꾸기", "명상", "나 말하기 기법"],
  순응형: ["나 말하기 기법", "명상", "복식호흡", "생각바꾸기"],
  억압형: ["명상", "호흡", "생각 바꾸기", "나 말하기 기법"],
  자포자기형: ["생각바꾸기", "나 말하기 기법", "명상", "호흡"],
  걱정형: ["복식호흡", "명상", "생각바꾸기", "나 말하기 기법"],
};

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);

  const type: string = useMentalType();

  const particle = type === "순응형" ? "를" : "을";

  const accountName = useAccountName();

  return (
    <>
      <h1 className="text-center mb-2 text-[32px] font-oneMobile text-camaColor1">
        전체 요약지
      </h1>

      <TextBox className="text-justify mt-5 tracking-tighter">
        <ImageBox imgSrc={Image1} containerClassName="mb-5" />
        <ImporText className="!mx-0">{accountName}</ImporText>님, 카마코치와
        함께 마음 근육훈련을 모두 마쳤어요!! <br />
        끝까지 포기하지 않고 노력해온
        <ImporText>{accountName}</ImporText>님 정말 멋져요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        <p>암에 대한 대처방식을 알아보고,</p>
        {techniques[type as TechniqueType]?.map((technique, index) => (
          <span
            key={index}
            className="inline-block mx-1 my-1 font-oneMobile bg-gray-100 border border-gray-200 text-camaColor1 px-2 py-1 rounded-lg"
          >
            {technique}
          </span>
        ))}
        {particle} 연습해보았어요. <br />
        이제 암을 넘어 새로운 삶을 향해 슬기롭고 힘차게 나아가요.
        {/* <ImporText className="mx-1">
          {
            {
              ["전투형"]: <>복식호흡과 생각바꾸기, 명상, 나 말하기 기법</>,
              ["순응형"]: <>나 말하기 기법과 명상, 복식호흡과 생각바꾸기</>,
              ["억압형"]: <>명상, 호흡, 생각 바꾸기, 나 말하기 기법</>,
              ["자포자기형"]: <>생각바꾸기, 나 말하기 기법, 명상, 호흡</>,
              ["걱정형"]: (
                <>{`복식호흡,  명상, 생각바꾸기, 나 말하기 기법`}</>
              ),
            }[type]
          }
        </ImporText> */}
        <br />
        <br />
        카마코치가 항상 응원할게요!
      </TextArea>
      <div className="mt-5">
        {
          {
            ["전투형"]: <Type1 />,
            ["순응형"]: <Type2 />,
            ["억압형"]: <Type3 />,
            ["자포자기형"]: <Type4 />,
            ["걱정형"]: <Type5 />,
          }[type]
        }
      </div>

      <Footer onNext={onNext} />
    </>
  );
}
