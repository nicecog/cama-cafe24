import { User, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/Chart";
import Separator from "@/components/ui/Separator";

export const description = "A multiple bar chart";
const chartData = [
  { text: "성과예측", type1: 186, type2: 80 },
  { text: "관계예측", type1: 305, type2: 200 },
  { text: "적응예측", type1: 237, type2: 120 },
];
const chartConfig = {
  type1: {
    label: "type1",
    color: "var(--chart-1)",
  },
  type2: {
    label: "type2",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig;

export default function Section3() {
  return (
    <div className=" flex flex-col h-full">
      <div className="px-12 py-2 text-md sm:text-md md:text-lg lg:text-lg font-semibold font-jalnanGothic ">
        예측지수
      </div>
      <Separator />
      <div className="flex w-full h-full  ">
        <div className="border-r border-primary   flex-col  w-[30%] sm:hidden hidden md:flex lg:flex">
          <div className="h-[49%] flex items-center justify-center  flex-col gap-1.5 font-semibold">
            <User size={19} fill="#0066CC" stroke="#0066CC" />
            응시자
          </div>
          <Separator />
          <div className="h-[49%] flex items-center justify-center  flex-col gap-1.5 font-semibold">
            <Users size={19} fill="#0066CC" stroke="#0066CC" />
            전형평균
          </div>
        </div>
        <div className="w-full h-full p-4">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="text"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                fontSize={13}
                className="font-bold text-primary-hover"
                // tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} />
              <Bar dataKey="type1" fill="var(--color-type1)" radius={5} />
              <Bar dataKey="type2" fill="var(--color-type2)" radius={5} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
