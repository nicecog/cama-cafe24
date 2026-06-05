import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { randomInt } from "@/lib/demoData";

export default function RadarChartCmp() {
  const data = [
    {
      subject: "감정지각",
      A: randomInt(10, 145),
      B: randomInt(10, 145),
    },
    {
      subject: "작업기억력",
      A: randomInt(10, 145),
      B: randomInt(10, 145),
    },
    {
      subject: "시공간",
      A: randomInt(10, 145),
      B: randomInt(10, 145),
    },
    {
      subject: "종합집행",
      A: randomInt(10, 145),
      B: randomInt(10, 145),
    },
    {
      subject: "운동적응력",
      A: randomInt(10, 145),
      B: randomInt(10, 145),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart outerRadius={120} width={730} height={250} data={data}>
        <PolarGrid />

        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 10 }} // 축 글자 크기 줄이기
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 150]} // 최소~최대 범위
          tick={{ fontSize: 10 }} // 반지름 방향 숫자 크기 줄이기
        />
        <Radar
          name="평균"
          dataKey="A"
          stroke="#8884d8"
          fill="none"
          strokeWidth={3}
        />
        <Radar
          name="내 점수"
          dataKey="B"
          stroke="#82ca9d"
          strokeWidth={3}
          fill="none"
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
