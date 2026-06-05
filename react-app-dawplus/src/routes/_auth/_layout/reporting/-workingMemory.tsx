import { Cpu } from "lucide-react";
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
    fill: "#f56868",
  },
];
export default function WorkingMemory() {
  return (
    <div>
      <h1 className="text-3xl font-jalnan text-[#f56868]">02 작업기억력</h1>
      <div className="flex items-center h-full gap-2 mt-12">
        <div className="w-[20%] flex-center flex-none">
          <Cpu size={70} />
        </div>
        <div className="">
          <h2 className="font-semibold font-jalnanGothic mb-5">
            작업기억력이란?
          </h2>
          <p>
            작업기억력은 정보를 잠시 동안 기억하고 필요한 순간에 그 정보를
            활용할 수 있는 능력입니다. 전화번호를 기억해서 휴대폰에 입력하거나,
            대화 중에 앞에서 말한내용을 기억하며 대화를 이어가는 것이
            작업기억력의 예입니다. 기억하는 대화를 이어가는 것이 작업기억력의
            예입니다.
          </p>
          <p className="mt-2">
            이는 학습, 문제해결, 계획 세우기 등 일상생활의 다양한 상황에서
            중요한 역할을 하며, 머리속의 '작업공간'처럼 정보를 일시적으로
            저장하고 조작하는 기능을 담당합니다.
          </p>
        </div>
      </div>
      <div className="mt-4 border-[#f56868]">
        <Table>
          <TableHeader className="border-t-2 border-[#f56868] border-b-2 border-b-gray-200">
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
              <TableCell className="py-1 text-center">14.05(s)</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">전체정답률</TableCell>
              <TableCell className="py-1 text-center">70%</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">
                1-back 반응시간
              </TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">12.76(s)</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">
                2-back 반응시간
              </TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">11.73(s)</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">
                3-back 반응시간
              </TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
              <TableCell className="py-1 text-center">17.67(s)</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">1-back 정답률</TableCell>
              <TableCell className="py-1 text-center">100%</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">2-back 정답률</TableCell>
              <TableCell className="py-1 text-center">44%</TableCell>
              <TableCell className="py-1 text-center">-</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="py-1 text-center">3-back 정답률</TableCell>
              <TableCell className="py-1 text-center">67%</TableCell>
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
            className="border-2 rounded-lg px-9 py-6 border-[#f56868] flex flex-col gap-1"
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
            className="border-2 rounded-lg px-9 py-6 border-[#f56868] flex flex-col gap-1"
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
            className={"border-2 border-[#f56868] rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#f56868]">
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
            className={"border-2 border-[#f56868] rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#f56868]">
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
            className="border-2 rounded-lg px-9 py-6 border-[#f56868] flex flex-col gap-1"
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
            className="border-2 rounded-lg px-9 py-6 border-[#f56868] flex flex-col gap-1"
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
            className={"border-2 border-[#f56868] rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#f56868]">
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
            className={"border-2 border-[#f56868] rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-[#f56868]">
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
      <div className="mt-8 border-t-2 border-[#f56868] pt-5">
        <h2 className="font-jalnan text-[#f56868] text-lg">결과</h2>
        <div className="flex flex-col gap-10 mt-2">
          <p>
            기억한 정보를 처리하고 반응하는 속도가 또래 평균보다 빠른 편이며,
            전반적으로 작업기억력과 주의집중력이 또래 평균보다 우수한
            수준입니다. 다양한 난이도의 인지적 과제를 효율적으로 처리할 수
            있습니다. 학업과 일상생활에서 복잡한 정보를 정확하게 처리하고
            지속적인 집중력을 유지할 수 있어, 신속한 정보처리가 필요한
            상황에서도 효과적으로 대처할 수 있을지로 기대되며 작업 수행 효율을
            높일 수 있을 것입니다. 다만, 과제의 난이도에 따른 수행 결과를 보면,
            난이도가 높은 과제의 수행은 일시적으로 작업기억을 유지하는 경향이
            나타납니다. 이는 과제의 복잡성에 따른 인지 자원의 효율적인
            조절능력이 필요함을 보여주며, 그로 인해 2B 과제의 수행 결과는 또래
            평균 수준과 유사하게 나타납니다.
          </p>
          <p>
            작업기억력은 학습, 문제 해결, 의사 결정 등 다양한 인지 활동의 기초가
            되는 매우 중요한 인지기능입니다. 작업기억력이 뛰어날수록 복잡한
            정보를 일시적으로 기억하고 처리하는 능력이 향상되며, 학업이나
            또래들과의 상호작용에서 더 효과적으로 대처할 수 있습니다.
            작업기억력을 향상시키기 위해서는 숫자나 단어 기억 게임, 멀티태스킹
            훈련 등 다양한 인지 훈련 활동이 도움이 될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
