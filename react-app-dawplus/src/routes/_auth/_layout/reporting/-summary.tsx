import { Activity, Cpu, Layers, Magnet, Smile } from "lucide-react";
import React from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from "recharts";
import { Each } from "@/components/common/Each";
import { ChartContainer, ChartTooltip } from "@/components/ui/Chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export default function Summary() {
  const data = [
    {
      col1: "감성지각능력",
      col2: 79,
      col3: "아이는 감정적인 정보를 인식하는 속도가 또래 보다 다소 빠른 수준이며, 전박적으로 감정을 해석하는 능력은 또래보다 우수한 수준 입니다.",
      icon: <Smile />,
      fill: "#f5c542",
    },
    {
      col1: "작업기억력",
      col2: 70,
      col3: "기억력 정보를 처리하고 반응하는 속도가 또래 보다 빠른 수준이며, 작업기억과 주의집중력이 또래 보다 우수한 수준입니다.",
      icon: <Cpu />,
      fill: "#f56868",
    },
    {
      col1: "시공간지각능력",
      col2: 58,
      col3: "시공간 정보를 처리하는 속도가 또래 보다 다소 빠른 수준이며, 시공간지각의 정확도는 또래 보다 양호한 수준입니다. ",
      icon: <Magnet />,
      fill: "#63a7c7",
    },
    {
      col1: "종합집행능력",
      col2: 25,
      col3: "문제해결을 위해 계획을 세우고 실행하는 속도가 또래 보다 빠른 수준이며, 전박적인 집행기능은 또래 보다 낮은 수준입니다. ",
      icon: <Layers />,
      fill: "#9b59b6",
    },
    {
      col1: "운동협응능력",
      col2: 85,
      col3: "운동 조절의 정확도는 또래보다 빠른 수준 입니다. ",
      icon: <Activity />,
      fill: "#f39c12",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-jalnan">
        <span className="underline"> 류기범</span> 님의 전체 결과 요약{" "}
      </h1>
      <div className=" mt-14">
        <h2 className="text-primary text-lg font-bold mb-14">
          테스트별 종합데이터
        </h2>
        <div>
          <Table>
            <TableHeader className="border-t-2 border-primary border-b-2 border-b-gray-200">
              <TableRow>
                <TableHead className="w-[20%]  text-center font-bold">
                  검사항목
                </TableHead>
                <TableHead className="w-[20%] font-bold  text-center">
                  백분율(전체종합지수)
                </TableHead>
                <TableHead className="w-[*%] font-bold">비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Each
                of={data}
                render={(item) => (
                  <TableRow>
                    <TableCell className="py-2.5 text-center">
                      {item.col1}
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      {item.col2}
                    </TableCell>
                    <TableCell className="py-2.5 ">{item.col3}</TableCell>
                  </TableRow>
                )}
              />
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <ResponsiveContainer
          width="100%"
          height={400}
          className={"rounded-lg mt-5 p-5"}
        >
          <ChartContainer
            config={{
              desktop: {
                label: "col1",
                color: "var(--chart-1)",
              },
            }}
          >
            <BarChart
              accessibilityLayer
              data={data}
              barSize={50}
              margin={{
                top: 20,
                bottom: 80,
              }}
            >
              {/* <YAxis
								axisLine={false} // 축 자체 라인 없앰
								tickLine={false} // tick에 붙은 작은 선 없앰
							/> */}
              {/* <CartesianGrid vertical={false} /> */}
              <XAxis
                dataKey="col1"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const row = data[payload.index];
                  return (
                    <g transform={`translate(${x - 52},${y})`}>
                      <foreignObject width={100} height={50}>
                        <div className="flex flex-col items-center gap-1">
                          {React.cloneElement(row.icon, {
                            fill: row.fill,

                            size: 22,
                            className: "",
                          })}
                          <span
                            style={{
                              fontSize: 15,
                            }}
                            className="font-bold whitespace-nowrap"
                          >
                            {row.col1}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                }}
              />

              <ChartTooltip
                cursor={false}
                content={(props) => {
                  const { active, payload, label } = props;

                  if (!active || !payload || payload.length === 0) return null;

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
              <Bar dataKey="col2" fill="var(--color-desktop)" radius={10}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground font-bold"
                  fontSize={12}
                  formatter={(value) => `${value}%`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
