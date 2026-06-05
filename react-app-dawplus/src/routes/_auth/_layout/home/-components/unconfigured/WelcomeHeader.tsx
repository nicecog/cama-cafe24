import { useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { cancerInfoGuideOpenAtom } from "@/atoms/cancerInfoGuideAtom";
import EffectImage from "@/components/home/EffectImage";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface WelcomeHeaderProps {
  userName: string;
}

export default function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  //  폰트크기
  const { pt } = usePageTranslation();

  // 암정보 가이드 열기 함수
  const setCancerInfoGuideOpen = useSetAtom(cancerInfoGuideOpenAtom);

  return (
    <div className="bg-primary pt-16 rounded-b-2xl pb-16 px-5">
      <div className="text-white">
        <div className="flex flex-col gap-2 text-2xl font-jalnan ">
          <h1>
            {pt("MSG_01")}, {`${userName}${pt("MSG_02")}`}
          </h1>
          <div className="flex items-center gap-2 text-lg">
            <span className="text-xl" role="img" aria-label="tools">
              🛠️
            </span>
            <p className="text-base font-normal ">
              암정보가이드 설정이 필요해요
            </p>
          </div>
        </div>

        <div className="flex justify-end items-baseline -mb-1 relative z-10">
          <EffectImage />
        </div>

        {/* 암정보 설정 유도 카드 */}
        <button
          onClick={() => setCancerInfoGuideOpen(true)}
          className="w-full border-2 p-5 bg-white rounded-2xl border-primary-text hover:border-secondary hover:shadow-lg transition-all duration-300 active:scale-[0.98] group relative z-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <p className="font-jalnan text-xl text-primary group-hover:text-secondary transition-colors">
                암정보가이드 설정하기
              </p>
              <p className="text-xs text-gray-600">
                맞춤형 건강정보를 받아보세요
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-primary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
}
