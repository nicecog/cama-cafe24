import { Smile } from "lucide-react";
import * as motion from "motion/react-client";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { Each } from "@/components/common/Each";
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
    fill: "var(--chart-2)",
  },
];
export default function Emotion() {
  return (
    <div>
      <h1 className="text-3xl font-jalnan text-primary">01 감정지각능력</h1>
      <div className="flex items-center h-full gap-2 mt-12">
        <div className="w-[20%] flex-center flex-none">
          <Smile size={70} />
        </div>
        <div className="">
          <h2 className="font-semibold font-jalnanGothic mb-5">
            감정지각능력이란?
          </h2>
          <p>
            감정인식능력은 다른 사람의 감정을 인식하고 이해하는 능력으로, 얼굴
            표정과 같은 감정정보를 통해 상대방이 느끼는 감정을 얼마나 잘
            파악하는지 평가할 수 있습니다.{" "}
          </p>
          <p className="mt-2">
            공감 능력, 사회적 상호작용, 감정조절력 등과 밀접하게 연관되어
            있으며, 타인의 감정을 이해하고 적절하게 반응하는 데 중요한 역할을
            합니다.{" "}
          </p>
        </div>
      </div>
      <div className="mt-4 border-primary ">
        <Table>
          <TableHeader className="border-t-2 border-primary border-b-2 border-b-gray-200">
            <TableRow>
              <TableHead className="w-[40%]  text-center font-bold">
                검사항목
              </TableHead>
              <TableHead className="w-[30%] font-bold  text-center">
                백분율(전체종합지수)
              </TableHead>
              <TableHead className="w-[30%] font-bold text-center">
                원점수
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b-2 border-primary">
            <Each
              of={[
                {
                  col1: "반응시간",
                  col2: "",
                  col3: "95.53(S)",
                },
                {
                  col1: "전체 이동횟수",
                  col2: "",
                  col3: "48(회)",
                },
                {
                  col1: "CST3 반응시간",
                  col2: "",
                  col3: "137.99(S)",
                },
                {
                  col1: "CST4 반응시간",
                  col2: "",
                  col3: "47.20(S)",
                },
                {
                  col1: "CST5 반응시간",
                  col2: "",
                  col3: "37.01(S)",
                },
                {
                  col1: "CST3 이동횟수",
                  col2: "",
                  col3: "63(회)",
                },
                {
                  col1: "CST4 이동횟수",
                  col2: "",
                  col3: "23(회)",
                },
                {
                  col1: "CST5 이동횟수",
                  col2: "",
                  col3: "13(회)",
                },
              ]}
              render={(item) => (
                <TableRow className="border-b">
                  <TableCell className="py-1 text-center">
                    {item.col1}
                  </TableCell>
                  <TableCell className="py-1 text-center">
                    {item.col2}
                  </TableCell>
                  <TableCell className="py-1 text-center">
                    {item.col3}
                  </TableCell>
                </TableRow>
              )}
            />
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
            className="border-2 rounded-lg px-9 py-6 border-primary flex flex-col gap-1"
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
            className="border-2 rounded-lg px-9 py-6 border-primary flex flex-col gap-1"
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
            className={"border-2 border-primary rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-primary">
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
            className={"border-2 border-primary rounded-lg p-3 font-jalnan "}
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
                      <div className="bg-white p-2 rounded flex-center gap-2 border border-primary">
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
      <div className="mt-8 border-t-2 border-primary pt-5">
        <h2 className="font-jalnan text-primary text-lg">결과</h2>
        <div className="flex flex-col gap-10 mt-2">
          <p>
            감정적인 정보를 인식하는 속도가 또래 평균보다 다소 빠른 편이며,
            전반적으로 감정을 해석하느 ㄴ능력은 똘 ㅐ평균보다 우수한 수준으로,
            일상적인 친구 관계나 사회적 상호작용에서 상대방의 감정을 정확하게
            파악하고 적절하게 반응할 수 있습니다. 이를 통해 긍적적 상호작용을
            이끌어내고 갈등을 효과적으로 관리할 수 있는 인지적 자원을 갖추고
            있습니다.{" "}
          </p>
          <p>
            감정적인 정보를 잘 인식하고 이해하는 능력은 또래 관계와 감정 조절에
            중요한 역할을 합니다. 이러한 능력을 키우고, 유지하기 위해서는 감정을
            알아차리는 연습과 더불어 ㄱ마정을 잘 다루는 방법을 배우는 것이
            중요합니다. 예를들어, 표정이나 목소리를 통해 감정을 알아 맞히는
            놀이를 하거나, 기분이 나쁠 때 마음을 차분하게 만드는 방법을 연습하는
            것이 도움이 될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
