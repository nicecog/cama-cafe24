import { useSetAtom } from "jotai";
import { Clipboard, Award, Activity, Heart, Sparkles } from "lucide-react";
import useAccountName from "@/hooks/useAccountName";
import useMentalType from "@/hooks/useMentalType";
import resultImage from "@/assets/images/coaching/mental/result.png";
import ImageBox from "../../component/ImageBox";
import TextArea from "../../component/Layout/TextArea";
import Footer from "../component/Footer";
import ImporText from "../component/ImportText";
import { nextStepAtom } from "./-session6Atoms";
import Type1 from "./-type/Type1";
import Type2 from "./-type/Type2";
import Type3 from "./-type/Type3";
import Type4 from "./-type/Type4";
import Type5 from "./-type/Type5";

type TechniqueType = "전투형" | "순응형" | "억압형" | "자포자기형" | "걱정형";

const typeSummaryMap = {
  전투형: <Type1 />,
  순응형: <Type2 />,
  억압형: <Type3 />,
  자포자기형: <Type4 />,
  걱정형: <Type5 />,
} as const;

const techniques: Record<TechniqueType, string[]> = {
  전투형: ["복식호흡", "생각바꾸기", "명상", "나 말하기 기법"],
  순응형: ["나 말하기 기법", "명상", "복식호흡", "생각바꾸기"],
  억압형: ["명상", "호흡", "생각 바꾸기", "나 말하기 기법"],
  자포자기형: ["생각바꾸기", "나 말하기 기법", "명상", "호흡"],
  걱정형: ["복식호흡", "명상", "생각바꾸기", "나 말하기 기법"],
};

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const type = useMentalType();
  const particle = type === "순응형" ? "를" : "을";
  const accountName = useAccountName();
  const selectedTechniques = type ? techniques[type as TechniqueType] : [];

  return (
    <>
      <style>{`
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-soft-float {
          animation: soft-float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Main Chart Container */}
      <section className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] animate-in fade-in duration-700">
        
        {/* Clipboard Top Header */}
        <div className="relative border-b border-slate-100 bg-slate-50/50 px-6 py-6 flex items-center justify-center gap-2">
          {/* Metal Clip Design Accent */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3.5 w-20 rounded-b-xl bg-slate-300" />
          <Clipboard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            전체 요약지
          </h1>
        </div>

        <div className="divide-y divide-slate-100">
          
          {/* Step 1: Congratulations Section */}
          <div className="grid gap-0 md:grid-cols-[168px_minmax(0,1fr)] bg-white">
            <div className="flex items-center justify-center bg-slate-50/20 px-5 py-6 border-b md:border-b-0 md:border-r border-slate-100">
              <div className="relative p-2 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <ImageBox
                  imgSrc={resultImage}
                  className="w-[150px] animate-soft-float"
                  containerClassName="w-full"
                />
              </div>
            </div>
            <div className="px-6 py-7 flex flex-col items-center justify-center gap-3">
              <div className="text-primary">
                <Award className="w-5.5 h-5.5" />
              </div>
              <TextArea className="text-center leading-relaxed text-base font-medium text-slate-700 break-keep !p-0 bg-transparent border-0">
                <ImporText className="!mx-0 text-lg font-black text-primary">{accountName}</ImporText>님, 카마코치와
                함께 마음 근육훈련을 모두 마쳤어요!! <br />
                끝까지 포기하지 않고 노력해온
                <ImporText className="text-primary font-black">{accountName}</ImporText>님 정말 멋져요.
              </TextArea>
            </div>
          </div>

          {/* Step 2: Techniques Section */}
          <div className="px-6 py-7 bg-white flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-slate-800">훈련 내용 요약</span>
            </div>

            <TextArea className="text-center leading-relaxed text-base font-medium text-slate-700 break-keep !p-0 bg-transparent border-0 w-full">
              <p className="mb-3">암에 대한 대처방식을 알아보고,</p>
              {selectedTechniques.length > 0 ? (
                <div className="my-3 flex flex-wrap gap-2 justify-center">
                  {selectedTechniques.map((technique, index) => (
                    <span
                      key={`${technique}-${index}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 text-sm font-black text-primary bg-primary/5 border border-primary/10 rounded-xl"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {technique}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-3.5 space-y-2">
                <p>
                  {particle} 연습해보았어요. <br />
                  이제 암을 넘어 새로운 삶을 향해 슬기롭고 힘차게 나아가요.
                </p>
                <p className="text-primary font-black flex items-center justify-center gap-1.5 mt-4 pt-3.5 border-t border-slate-100">
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                  카마코치가 항상 응원할게요!
                </p>
              </div>
            </TextArea>
          </div>
          
        </div>
      </section>

      {/* Step 3: Type Specific Report */}
      {type ? (
        <section className="mt-5 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)] animate-in fade-in duration-700 delay-100">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-black text-slate-600">진단 결과 분석</span>
          </div>
          <div className="px-6 py-6">{typeSummaryMap[type as TechniqueType]}</div>
        </section>
      ) : null}

      <Footer onNext={onNext} />
    </>
  );
}
