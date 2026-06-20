import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StepDaily } from "../types/dashboard";

type Props = { steps: StepDaily[] };

export default function StepChart({ steps }: Props) {
  const data = [...steps]
    .reverse()
    .map((s) => ({
      date: s.executionDate?.slice(5) ?? "",
      steps: Number(s.stepNum) || 0,
    }));

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="steps" stroke="#22c55e" fill="url(#stepGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
