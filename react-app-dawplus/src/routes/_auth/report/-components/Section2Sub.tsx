import IncrementNumber from "@/components/effect/IncrementNumber";
import Separator from "@/components/ui/Separator";

export default function Section2Sub() {
  const value = 85;
  const value2 = 15;
  return (
    <div className="flex h-full w-full gap-4 rounded-lg flex-col">
      {/* 종합점수 카드 */}
      <div className="h-[50%]  rounded-lg  bg-white flex flex-col px-10 justify-center  border border-primary w-full py-5 gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold font-jalnanGothic flex flex-col">
            종합점수
            <span className="text-xs text-gray-500">(표준가중치적용)</span>
          </h1>
          <div className="flex flex-col">
            <div className="text-2xl font-jalnanGothic font-bold text-primary text-right">
              <IncrementNumber target={value} duration={3000} />점
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold font-jalnanGothic">종합등수</h1>
          <div className="flex flex-col">
            <div className="text-2xl font-jalnanGothic text-primary">
              <IncrementNumber target={value2} duration={3000} />등
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold font-jalnanGothic">
            분야내등수
          </h1>
          <div className="flex flex-col">
            <div className="text-2xl font-jalnanGothic text-primary">
              <IncrementNumber target={value2} duration={3000} />등
            </div>
          </div>
        </div>
      </div>
      <div className="h-[50%] rounded-lg  bg-white  box-border flex flex-col  px-10 items-center  w-full  border border-primary  py-5 gap-5 justify-between">
        <div className="flex items-center gap-2 justify-between   w-full ">
          <h1 className="font-jalnan  ">응시자 강점</h1>
          <div className="flex flex-col text-md font-bold  justify-end items-end text-primary ">
            <p>높은 수용성</p>
            <p>원만한 대인관계</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-2 justify-between   w-full ">
          <h1 className="font-jalnan  ">응시자 약점</h1>
          <div className="flex flex-col text-md font-bold  justify-end items-end text-destructive ">
            <p>일을 자주 미룸</p>
            <p>업무점검부족</p>
          </div>
        </div>
      </div>
    </div>
  );
}
