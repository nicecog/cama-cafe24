import IncrementNumber from "@/components/effect/IncrementNumber";
import MotionProgress from "@/components/ui/Progress/MotionProgress";
import Separator from "@/components/ui/Separator";

export default function Section2() {
  const value = 85;
  const value2 = 15;
  return (
    <div className="flex flex-col h-full w-full gap-4 rounded-lg">
      <div
        className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3"
        style={{ gridAutoRows: "1fr" }}
      >
        {/* 종합점수 카드 */}
        <div className="rounded-lg  bg-white flex flex-col px-12 py-5 gap-2  border border-primary">
          <h1 className="text-lg font-semibold font-jalnanGothic">종합점수</h1>

          <div className="text-sm  mt-2.5 rounded  mb-5">
            <p className="text-4xl font-jalnanGothic font-bold text-primary">
              <IncrementNumber target={value} duration={3000} />점
            </p>
            <p className="mt-1 text-slate-600">표준가중치 적용</p>
          </div>
          <MotionProgress value={value} />
        </div>

        {/* 나머지 카드 */}
        <div className="rounded-lg  bg-white  box-border flex flex-col items-center justify-center  w-full  border border-primary  ">
          <div className="w-full px-12 gap-2 flex flex-col justify-center items-center">
            <h1 className="text-lg font-semibold font-jalnanGothic w-full text-left">
              종합등수
            </h1>
            <p>
              <span className="text-2xl font-jalnanGothic text-primary">
                <IncrementNumber target={value2} duration={3000} />등
              </span>
              <span className="ml-3 font-semibold text-sm">14명중</span>
            </p>
          </div>
          <Separator className="my-6" />
          <div className="w-full px-12 gap-2 flex flex-col justify-center items-center">
            <h1 className="text-lg font-semibold font-jalnanGothic w-full text-left">
              분야내등수
            </h1>
            <p>
              <span className="text-2xl font-jalnanGothic text-primary">
                <IncrementNumber target={value2} duration={3000} />등
              </span>
              <span className="ml-3 font-semibold text-sm">14명중</span>
            </p>
          </div>
        </div>
        <div className="rounded-lg  bg-white  box-border flex flex-col items-center  w-full  border border-primary  py-5 ">
          <h1 className="font-jalnan">응시자 강점</h1>
          <Separator className="mt-3" />
          <div className="flex flex-col text-xl font-semibold gap-2 justify-center items-center h-full text-primary ">
            <p>높은 수용성</p>
            <p>원만한 대인관계</p>
          </div>
        </div>
        <div className="rounded-lg  bg-white  box-border flex flex-col items-center  w-full  border border-primary  py-5 ">
          <h1 className="font-jalnan">응시자 약점</h1>
          <Separator className="mt-3" />
          <div className="flex flex-col text-xl font-semibold gap-2 justify-center items-center h-full text-destructive ">
            <p>일을 자주 미룸</p>
            <p>업무점검부족</p>
          </div>
        </div>
      </div>
    </div>
  );
}
