import Mental from "@/assets/images/coaching/mental/50.png";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function MentalIntroStep() {
  return (
    <CoachingInfoStep image={Mental} subtitle="'내가 암이라니...'">
      <div className="space-y-8 text-slate-600 px-2">
        <p className="text-center text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
          암 진단을 받고
          <br />
          어떠셨나요?
        </p>

        <p className="text-center leading-relaxed text-base md:text-lg text-slate-600 break-keep text-pretty">
          혼란스럽고 슬프거나 화가 났을지도 모릅니다. 앞이 깜깜해 아무것도 할 수
          없었을 수도 있고, 마음을 다잡은 채 치료 방법을 찾아 나섰을 수도
          있어요.
        </p>

        <p className="text-center leading-relaxed text-base md:text-lg text-slate-600 break-keep text-pretty">
          사람들은 암이라는 상황에 맞닥뜨리면 서로 다른 방식으로 반응하곤 해요.
          예상치 못한 스트레스 사건(암)을 다루기 위해 나만의{" "}
          <span className="font-extrabold text-sky-600 bg-sky-50/80 px-1.5 py-0.5 rounded-md">
            '대처 방식'
          </span>
          을 발휘한 결과이지요.
        </p>

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 p-6 text-center border border-sky-100 shadow-sm">
          <div className="text-2xl mb-2">🔍</div>
          <p className="font-extrabold text-slate-800 leading-relaxed text-base md:text-lg break-keep text-pretty">
            나는 어떻게 대처하는 사람인지,
            <br />
            암에 대한 <span className="text-sky-600">나의 대처 유형</span>을
            알아볼까요?
          </p>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
