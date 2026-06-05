import { Magnet } from "lucide-react";
import * as motion from "motion/react-client";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import IncrementNumber from "@/components/effect/IncrementNumber";
import { ChartContainer, ChartTooltip } from "@/components/ui/Chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

const data = [
  {
    browser: "평균",
    visitors: 275,
    fill: "var(--chart-1)",
  },
  {
    browser: "대상자",
    visitors: 200,
    fill: "#63a7c7",
  },
];
export default function Spatial() {
  return (
    <div>
      <h1 className="text-3xl font-jalnan text-[#63a7c7]">03 시공간지각능력</h1>
      <div className="flex items-center h-full gap-2 mt-12">
        <div className="w-[20%] flex-center flex-none">
          <Magnet size={70} />
        </div>
        <div className="">
          <h2 className="font-semibold font-jalnanGothic mb-5">
            시공간지각능력
          </h2>
          <p>
            시공간지각능력은 주변의 사물과 공간을 인식하고, 물체의 위치와 공간적
            관계를 이해하는데 필요한 기능입니다. 물체간의 거리, 방향, 크리 등을
            정확하게 파악하여 일상적인 행동이나 문제 해결을 효과적으로 수행할 수
            있도록 돕습니다.
          </p>
          <p className="mt-2">
            머릿속에서 물체를 돌려보거나 위치를 변경해보는 등 시작적으로
            상상하고 비교하는 과정을 통해 평가할 수 있습니다.
          </p>
        </div>
      </div>
      <div className="mt-4 border-[#63a7c7]">
        <Table>
          <TableHeader className="border-t-2 border-[#63a7c7] border-b-2 border-b-gray-200">
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
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              scale: {
                type: "spring",
                duration: 0.4,
                bounce: 0.5,
              },
            }}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            className="border-2 rounded-lg px-9 py-6 border-[#63a7c7] flex flex-col gap-1"
          >
            <h2 className="text-lg font-semibold font-jalnan pb-3">반응시간</h2>
            <div className="text-3xl font-jalnan flex gap-1">
              <IncrementNumber target={12.44} />초
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              scale: {
                type: "spring",
                duration: 0.4,
                bounce: 0.5,
              },
            }}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            className="border-2 rounded-lg px-9 py-6 border-[#63a7c7] flex flex-col gap-1"
          >
            <h2 className="text-lg font-semibold font-jalnan pb-3">
              전체 정답률
            </h2>
            <div className="text-3xl font-jalnan flex gap-1">
              <IncrementNumber target={79} />%
            </div>
          </motion.div>
        </div>
        <div className="flex-1 flex gap-5 self-stretch">
          <ResponsiveContainer
            width="100%"
            className={"border-2 border-[#63a7c7] rounded-lg p-3 font-jalnan "}
          >
            <ChartContainer config={{}}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  bottom: 16,
                }}
              >
                <XAxis
                  dataKey="browser"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  label={{
                    value: "반응시간",
                    position: "insideBottom",
                    offset: -15,
                    style: {
                      fontSize: "17px",
                      fontWeight: "bold",
                      fill: "#333",
                      FontFace: "Jalnan",
                    },
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={(props) => {
                    const { active, payload, label } = props;

                    if (!active || !payload || payload.length === 0)
                      return null;

                    // payload[0].value 가 col2 값임
                    const col2Value = payload[0].value;

                    return (
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#63a7c7]">
                        <div> {label}</div>
                        <div className="font-bold">{col2Value}%</div>
                      </div>
                    );
                  }}
                />

                <Bar dataKey="visitors" radius={5} barSize={50} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
          <ResponsiveContainer
            width="100%"
            className={"border-2 border-[#63a7c7] rounded-lg p-3 font-jalnan "}
          >
            <ChartContainer config={{}}>
              <BarChart
                data={data}
                barCategoryGap="1%" // 👈 카테고리 간격 (퍼센트 or px 가능)
                margin={{
                  top: 20,
                  bottom: 16,
                }}
              >
                <XAxis
                  dataKey="browser"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  label={{
                    value: "전체정답률",
                    position: "insideBottom",
                    offset: -15,
                    style: {
                      fontSize: "17px",
                      fontWeight: "bold",
                      fill: "#333",
                      FontFace: "Jalnan",
                    },
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={(props) => {
                    const { active, payload, label } = props;

                    if (!active || !payload || payload.length === 0)
                      return null;

                    // payload[0].value 가 col2 값임
                    const col2Value = payload[0].value;

                    return (
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#63a7c7]">
                        <div> {label}</div>
                        <div className="font-bold">{col2Value}%</div>
                      </div>
                    );
                  }}
                />

                <Bar dataKey="visitors" radius={5} barSize={50} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-[#63a7c7] pt-5">
        <h2 className="font-jalnan text-[#63a7c7] text-lg">결과</h2>
        <div className="flex flex-col gap-10 mt-2">
          <p>
            시공간 정볼르 처리하는 속도가 또래 평균보다 다소 빠른편이며,
            시공간지각의 정확도는 또래 평균보다 양호한 수준입니다. 물체를 다양한
            각도에서 상상하고 시각화 하는 능력이 좋은 편이며, 전반적인 인지
            기능에서도 시공간적 정보를 잘 이해하고 처리할 수 있는 편입니다. 블록
            조립, 퍼즐 맞추기와 같이 시공간적 사고가 필요한 활동을 어려움 없이
            능숙하게 수행할 수 있습니다.
          </p>
          <p>
            시공간지각력은 물체의 공간적 정보를 이해하고 주변 환경과의 관계를
            파악하는 데 중요한 역할을 하며, 공간지각을 필요로 하는 다양한 일상
            활동과 공학/기술적 전문 분야에서 필수적입니다. 퍼즐, 3D게임, 시각적
            운동 훈련과 같은 활동이 시공간지각력 향상에 도움이 될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
