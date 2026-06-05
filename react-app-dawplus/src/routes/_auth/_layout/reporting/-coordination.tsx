import { Activity } from "lucide-react";
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

export default function Coordination() {
  return (
    <div>
      <h1 className="text-3xl font-jalnan text-[#f39c12]">05 운동협응능력</h1>
      <div className="flex items-center h-full gap-2 mt-12">
        <div className="w-[20%] flex-center flex-none">
          <Activity size={70} />
        </div>
        <div className="">
          <h2 className="font-semibold font-jalnanGothic mb-5">
            운동협응능력이란?
          </h2>
          <p>
            운동조절력은 몽의 움직임을 조절하고 조화롭게 사용하는 능력으로,
            근육의 힘과 균형, 눈과 손의 협응력을 포함하여 신체의 전체적인
            움직임을 매끄럽게 만드는데 필요한 기능입니다. 운동조절력이 발달하면
            스포츠, 놀이, 학습 활동에 더욱 능숙하게 참여할 수 있으며, 신체의
            조화로운 발달을 돕고 다양한 일상적인 행동을 원활하게 수행할 수
            있습니다.
          </p>
        </div>
      </div>
      <div className="mt-4 border-[#f39c12]">
        <Table>
          <TableHeader className="border-t-2 border-[#f39c12] border-b-2 border-b-gray-200">
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
              <TableCell className="py-1 text-center">Motor Speed</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">215(Step)</TableCell>
            </TableRow>

            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">
                Motor Coordination
              </TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">341(Step)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex gap-5 items-stretch">
        <div className="flex flex-col gap-5 w-[200px] ">
          <Each
            of={[
              { title: "Motor Seppd", count: 215 },
              { title: "Motor coordination", count: 341 },
            ]}
            render={(item) => (
              <NumberCounter
                title={item.title}
                count={item.count}
                className="border-[#f39c12] "
              />
            )}
          />
        </div>
        <div className="flex-1 flex gap-5 self-stretch">
          <div className="grid grid-cols-2 gap-4  w-full">
            <Each
              of={Array.from({ length: 2 }).map((_, index) => ({
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
                    fill: "#f39c12",
                  },
                ],
              }))}
              render={(item) => (
                <ReportChart
                  chartData={item.data}
                  title={item.title}
                  className="border-[#f39c12]"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-[#f39c12] pt-5">
        <h2 className="font-jalnan text-[#f39c12] text-lg">결과</h2>
        <div className="flex flex-col gap-10 mt-2">
          <p>
            신체 반응 시간이 또래 평균보다 빠른 편으로, 자극을 거의 즉각적으로
            인식하고 신속하게 행동하게 행동으로 옮길 수 있습니다. 갑작스러운
            움직임이 필요한 상황에서 좋은 성과를 보이며, 빠른 대처가 요구되는
            다양한 일상 활동에서 강점을 나타낼수 있습니다. 운동조절의 정확도는
            또래 평균보다 우수한 수준으로, 빠른 움직임과 정밀한 조작이 요구되는
            상황에도 정확하게 대처할 수 있습니다.
          </p>
          <p>
            운동조절능력은 일상적인 활동에서부터 운동이나 기술적 작업에
            이르기까지 다양한 상황에서 중요한 역할을 합니다. 신체반응시간과
            운동조절의 정확도가 뛰어날수록 신속하고 정확하게 움직일 수 있어,
            일상생활에서의 효율성과 안정성을 높일 수 있습니다. 공 던지기와 받기
            블록 쌓기, 균형잡기 놀이처럼 반사 신경을 강화하고 손과 눈의 협응을
            개선하는 게임이나 스포츠 활동 등이 운동조절능력 향상에 도움이 될 수
            있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
