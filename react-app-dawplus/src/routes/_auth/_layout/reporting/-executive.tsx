import { Layers } from "lucide-react";
import { Each } from "@/components/common/Each";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { randomInt } from "@/lib/demoData";
import NumberCounter from "./-component/NumberCounter";
import ReportChart from "./-component/ReportChart";

export default function Executive() {
  return (
    <div>
      <h1 className="text-3xl font-jalnan text-[#9b59b6]">04 종합집행능력</h1>
      <div className="flex items-center h-full gap-2 mt-12">
        <div className="w-[20%] flex-center flex-none">
          <Layers size={70} />
        </div>
        <div className="">
          <h2 className="font-semibold font-jalnanGothic mb-5">
            종합집행능력이란?
          </h2>
          <p>
            집행기능은 목표를 설정하고 게획을 세우며, 문제를 해결하고 자기조절과
            인지적 유연성을 발휘하는 복합적인 고위인지 기능입니다. 예를 들어,
            숙제를 하거나 물건을 정리하는 것처럼 여러 단계가 필요한 일을 수행할
            때, 어떤 순서로 해야 할지 계획하고 주의를 집중하며, 예상치 못한
            문제가 발생했을 때 이를 해결하는 능력 등이 모두 집행기능에
            포함됩니다. 또한, 충동을 조절하고, 여러 가지 일을 동시에 관리하며,
            중요한 일에 우선 순위를 두어 집중하는 데 필수적인 기능입니다.
          </p>
          <p className="mt-2">
            머릿속에서 물체를 돌려보거나 위치를 변경해보는 등 시작적으로
            상상하고 비교하는 과정을 통해 평가할 수 있습니다.
          </p>
        </div>
      </div>
      <div className="mt-4 border-[#9b59b6]">
        <Table>
          <TableHeader className="border-t-2 border-[#9b59b6] border-b-2 border-b-gray-200">
            <TableRow>
              <TableHead className="w-[40%]  text-center font-bold">
                검사항목
              </TableHead>
              <TableHead className="w-[30%] font-bold  text-center">
                백분율
              </TableHead>
              <TableHead className="w-[30%] font-bold text-center">
                원점수
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">반응시간</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">50.13(s)</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">전체정답률</TableCell>
              <TableCell className="py-1 text-center">56%</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex gap-5 items-stretch">
        <div className="flex flex-col gap-5 w-[200px] ">
          <Each
            of={[
              { title: "반응시간", count: 95.53 },
              { title: "전체이동횟수", count: 48 },
              { title: "CST3반응시간", count: 137.99 },
              { title: "CST4반응시간", count: 84.7 },
            ]}
            render={(item) => (
              <NumberCounter
                title={item.title}
                count={item.count}
                className="border-[#9b59b6] "
              />
            )}
          />
        </div>
        <div className="flex-1 flex gap-5 self-stretch">
          <div className="grid grid-cols-2 gap-4  w-full">
            <Each
              of={Array.from({ length: 4 }).map((_, index) => ({
                title: `차트${index + 1}`,
                data: [
                  {
                    title: "평균",
                    count: randomInt(20, 100),
                    fill: "var(--chart-1)",
                  },
                  {
                    title: "대상자",
                    count: randomInt(30, 100),
                    fill: "#9b59b6",
                  },
                ],
              }))}
              render={(item) => (
                <ReportChart
                  chartData={item.data}
                  title={item.title}
                  className="border-[#9b59b6]"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-[#9b59b6] pt-5">
        <h2 className="font-jalnan text-[#9b59b6] text-lg">결과</h2>
        <div className="flex flex-col gap-10 mt-2">
          <p>
            문제 해결을 위해 계획을 세우고 실행하는 속도가 또래 평균보다
            빠른편이며, 전반적인 집행 긴으은 또래 평균보다 낮은 수준입니다.
            문제해결을 할 때 전략을 효과적으로 계획하지 못하고 즉흥적으로
            접근하면서 실수가 잦아지고, 한번 실패한 방법을 반복하는 경우도
            많습니다. 이는 계획 능력과 문제해결에 어려움을 겪고 있음을 시사한며,
            일상적인 상황에서도 계획을 세우거나 결정을 내리는 데 어려움을 겪을
            가능성이 높습니다. 과제의 난이도에 따른 수행결과를 보면, 난이도와
            관계없이 집행기능을 유지하는 데 어려움을 겪는 경향이 나타납니다.
            이는 과제가 쉽거나 어려운 상황 모두에서 집중력이 충분히 발휘되지
            않거나, 인지 전략을 적절히 사용하는데 어려움이 있음을 의미합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
