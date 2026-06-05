import { Anvil, BicepsFlexed } from "lucide-react";
import Separator from "@/components/ui/Separator";
export default function Section6() {
  return (
    <div className=" flex flex-col h-full  min-h-[290px]">
      <div className="px-12 py-2 text-md sm:text-md md:text-lg lg:text-lg font-semibold font-jalnanGothic ">
        종합 코멘트
      </div>
      <Separator />

      <div className="flex flex-col h-full justify-center whitespace-normal overflow-hidden">
        <div className="h-[49%] flex px-10  justify-center text-sm  items-center gap-5 py-10 sm:py-0">
          <h2 className="hidden   lg:block w-[12%]">
            <BicepsFlexed fill="#fff" stroke="#0066CC" />
          </h2>
          <div>
            <p className="font-semibold ">
              다른 사람의 의견을 열림 마음으로 수용할 수 있습니다. 동료들과
              원만한 관계를 유지할 가능성이 높습니다.{" "}
            </p>
            <p className="text-gray-600  rounded-lg ">
              자신의 업무에서 실수한 부분이 없는지 스스로 확인해볼 수 있습니다.
              그리고 효율적인 업무 환경을 조성하기 위한 의견을 적극적으로 낼 수
              있습니다. 또한 좋은 동료나 선후배가 되고자 적극적으로 노력하는
              모습을 보일 수 있습니다.
            </p>
          </div>
        </div>
        <Separator className="hidden md:block lg:block" />
        <div className="h-[49%] flex px-10  justify-center  text-sm   items-center gap-5 py-10 sm:py-0">
          <h2 className="hidden  sm:hidden md:hidden lg:block w-[5%]">
            <Anvil fill="#fff" stroke="#0066CC" />
          </h2>
          <div>
            <p className="font-semibold text-sm">
              감정상태에 따라 즉흥적으로 행동하는 경우가 있습니다. 조직생활에 잘
              적응하는 데에 시간이 필요할 수 있습니다.
            </p>
            <p className="text-gray-600 text-sm rounded-lg">
              근거 없이 즉흥적으로 의견을 내는 경우가 종종 발생 할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
