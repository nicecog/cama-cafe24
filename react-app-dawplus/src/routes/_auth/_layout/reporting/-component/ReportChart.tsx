import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/Chart";
import { cn } from "@/lib/utils";

type ChartDataType = {
  title: string;
  count: number;
  fill?: string;
};

type ReportChartType = {
  chartData: ChartDataType[];
  title?: string;
  className?: string;
};

export default function ReportChart(props: ReportChartType) {
  // props;
  const { className, chartData, title } = props;
  //render
  return (
    <ResponsiveContainer
      width="100%"
      className={cn(
        "border-2 border-primary rounded-lg p-3 font-jalnan ",
        className,
      )}
    >
      <ChartContainer config={{}}>
        <BarChart
          data={chartData}
          barCategoryGap="1%" // 👈 카테고리 간격 (퍼센트 or px 가능)
          margin={{
            top: 20,
            bottom: 16,
          }}
        >
          <XAxis
            dataKey="title"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            label={{
              value: title,
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

          <Bar dataKey="count" radius={5} barSize={50} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
