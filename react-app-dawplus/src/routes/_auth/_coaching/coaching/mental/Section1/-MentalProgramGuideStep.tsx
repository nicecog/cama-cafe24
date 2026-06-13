import { Calendar, Clock, Sparkles } from "lucide-react";
import Textbox from "../../-components/elements/Textbox";
import {
  mentalHourOptions,
  mentalProgramGuideParagraphs,
  mentalWeekdays,
} from "./-constants";
import type { MentalTrainingPlan, MentalTypeResult } from "./-types";
import { getMentalTypeMeta } from "./-utils";

interface MentalProgramGuideStepProps {
  result: MentalTypeResult;
  trainingPlans: [MentalTrainingPlan, MentalTrainingPlan];
  onTrainingPlanChange: (
    index: 0 | 1,
    key: keyof MentalTrainingPlan,
    value: string,
  ) => void;
}

export function MentalProgramGuideStep({
  result,
  trainingPlans,
  onTrainingPlanChange,
}: MentalProgramGuideStepProps) {
  const meta = getMentalTypeMeta(result.dispName);

  return (
    <div className="space-y-12 pb-12 pt-4 animate-fade-in px-4">
      {/* 가이드 인트로 및 단락 */}
      <div className="space-y-8 px-2">
        {/* 인트로 강조 문구 (말풍선 제거, 깔끔한 텍스트) */}
        <div className="relative">
          <Textbox className="text-lg leading-relaxed font-bold text-slate-900 text-pretty break-keep">
            {meta.programIntro}
          </Textbox>
          <div className="mt-8 w-8 h-[3px] rounded-full bg-primary/20" />
        </div>

        {/* 일반 텍스트 리스트 */}
        <div className="space-y-6">
          {mentalProgramGuideParagraphs.map((paragraph) => (
            <Textbox
              key={paragraph}
              className="text-base leading-relaxed text-slate-700 font-medium text-pretty break-keep"
            >
              {paragraph}
            </Textbox>
          ))}
        </div>
      </div>

      {/* 일정 설정 영역 */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5 text-primary">
            <Sparkles size={28} />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            마음근육 훈련 시작하기
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500 px-4 leading-relaxed">
            꾸준히 실천할 수 있는 두 개의 일정을 선택해주세요.
          </p>
        </div>

        {/* 일정 선택 (구분되는 부드러운 화이트 배경 적용) */}
        <div className="space-y-6 mt-8">
          {trainingPlans.map((plan, index) => (
            <div
              key={`training-plan-${index + 1}`}
              className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <p className="text-lg font-bold text-slate-800">
                  {index === 0 ? "첫 번째 일정" : "두 번째 일정"}
                </p>
              </div>

              <div className="space-y-5">
                <label className="relative flex flex-col space-y-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                    <Calendar size={16} className="text-primary/70" /> 요일
                  </span>
                  <select
                    value={plan.wday}
                    onChange={(event) =>
                      onTrainingPlanChange(
                        index as 0 | 1,
                        "wday",
                        event.target.value,
                      )
                    }
                    className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base font-bold text-slate-800 outline-none focus:border-primary focus:bg-primary/5 focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    {mentalWeekdays.map((weekday) => (
                      <option key={weekday} value={weekday}>
                        {weekday}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute bottom-0 right-4 flex h-14 items-center text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </label>

                <label className="relative flex flex-col space-y-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                    <Clock size={16} className="text-primary/70" /> 시간
                  </span>
                  <select
                    value={plan.time}
                    onChange={(event) =>
                      onTrainingPlanChange(
                        index as 0 | 1,
                        "time",
                        event.target.value,
                      )
                    }
                    className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base font-bold text-slate-800 outline-none focus:border-primary focus:bg-primary/5 focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    {mentalHourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}시
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute bottom-0 right-4 flex h-14 items-center text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
