import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/Chart";
import Separator from "@/components/ui/Separator";

export const description = "A multiple bar chart";

const chartData = [
  { text: "관계대응", value: 45 },
  { text: "조절행동", value: 30 },
  { text: "성취추구", value: 20 },
  { text: "기억력", value: 11 },
  { text: "창의력", value: 90 },
];
const chartConfig = {
  value: {
    label: "점수",
    color: "var(--chart-1)",
  },
  max: {
    label: "최대",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function Section4() {
  return (
    <div className=" flex flex-col h-full">
      <div className="px-12 py-2 text-md sm:text-md md:text-lg lg:text-lg font-semibold font-jalnanGothic ">
        분야 적합도 및 핵심역량 점수
      </div>
      <Separator />
      <div className="flex w-full h-full  ">
        <div className="border-r border-primary w-[30%] hidden sm:hidden md:flex lg:flex items-center justify-center  font-semibold ">
          경영기획/지원
        </div>
        <div className="w-full h-full p-4">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="text"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                fontSize={13}
              />
              <ChartTooltip cursor={false} />
              <Bar
                dataKey="value"
                stackId="a"
                fill="var(--color-value)"
                radius={[0, 0, 4, 4]}
                background={{
                  fill: "var(--chart-background)",
                  radius: 4,
                }}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
