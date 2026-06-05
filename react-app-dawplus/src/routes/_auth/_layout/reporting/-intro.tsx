import { Brain, Hand, MapPin, Smile, Target } from "lucide-react";
export default function Intro() {
  return (
    <div className="">
      <h1 className="text-4xl font-jalnan">
        CNT 란 ?
        <span className="text-sm font-thin ml-3">
          CNT(Cognitive Neuroofuntional Test)
        </span>
      </h1>
      <div className="mt-10">
        <h3 className="text-primary font-semibold">뇌인지기능검사</h3>
        <div className="text-md mt-3">
          전두엽 포함한 뇌의 다중 인지 영역의 기능 평가 검사입니다. 이 검사는
          집중력, 기억력, 감정 인지와 같은 주요 인지 능력과 함게 시공간 지각
          능력, 종합 집행 능력, 운동 협응 능력 등을 종합적으로 평가합니다.
          인간의 인지능력과 이를 관장하는 신경학적 기제(뇌 영역 및 네트워크) 를
          평가하는 데 도움을 줍니다.
        </div>
      </div>
      <div className="mt-10">
        <h3 className="font-bold">
          본 검사는 5가지의 하위 검사로 구성됩니다.{" "}
        </h3>
        <div className="w-full">
          <div className="flex justify-between gap-4 w-full mt-5">
            <div className="flex-center w-[12%]   ">
              <Smile size={45} className="text-blue-400" />
            </div>
            <div className="flex-1 p-3 ">
              <h4 className="font-semibold font-jalnanGothic">
                감정지각능력(Emotional Perception Ability)
              </h4>
              <div className="mt-2">
                타인의 감정을 인식하고 이해하는 능력으로서 인간관계 및 갈등
                해결에 중요한 역할을 합니다.
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 w-full mt-5">
            <div className="flex-center w-[12%]   ">
              <Brain size={45} className="text-teal-400" />
            </div>
            <div className="flex-1 p-3 ">
              <h4 className="font-semibold font-jalnanGothic">
                작업기억력(Working Memory)
              </h4>
              <div className="mt-2">
                정보나 지시를 임시로 기억하고 이를 활용하는 능력입니다.
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 w-full mt-5">
            <div className="flex-center w-[12%]   ">
              <MapPin size={45} className="text-purple-400" />
            </div>
            <div className="flex-1 p-3 ">
              <h4 className="font-semibold font-jalnanGothic">
                시공간 지각력(Spatio-Temporal Perception)
              </h4>
              <div className="mt-2">
                주변에서 발생하는 사건과 정보의 위치와 시각적 관계를 이해하고
                처리하는 능력을 의미 합니다. 즉, 시공간적 정보를 인식하고
                해석하는 능력입니다.
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 w-full mt-5">
            <div className="flex-center w-[12%]   ">
              <Target size={45} className="text-pink-400" />
            </div>
            <div className="flex-1 p-3 ">
              <h4 className="font-semibold font-jalnanGothic">
                종합 집행 능력(Executive Functioning)
              </h4>
              <div className="mt-2">
                계획, 문제해결, 의사결정, 자아 조절, 목표 설정 및 관리 등을
                포함하는 고차원적인 인자입니다.
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 w-full mt-5">
            <div className="flex-center w-[12%]   ">
              <Hand size={45} className="text-yellow-400" />
            </div>
            <div className="flex-1 p-3 ">
              <h4 className="font-semibold font-jalnanGothic">
                운동 협응 능력(Motor Coordination Ability)
              </h4>
              <div className="mt-2">
                신체와 정신을 조율하여 세밀한 작업을 수행하는 능력으로서 정교한
                신체 움직임 및 작업 수행에 필수적입니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
