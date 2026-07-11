import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STEP_GOAL } from "../lib/healthStats";
import type { StepDaily } from "../types/healthData";

type Props = {
  steps: StepDaily[];
  height?: number;
};

function StepTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  const reached = value >= STEP_GOAL;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">{value.toLocaleString()} 걸음</div>
      <div className={`chart-tooltip-meta${reached ? " chart-tooltip-meta--ok" : ""}`}>
        {reached ? "목표 달성" : `목표까지 ${(STEP_GOAL - value).toLocaleString()}걸음`}
      </div>
    </div>
  );
}

export default function StepChart({ steps, height = 300 }: Props) {
  const data = steps.map((s) => ({
    date: s.date,
    steps: s.steps,
  }));

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <span className="chart-empty-icon">👟</span>
        <p>걸음수 기록이 없습니다.</p>
      </div>
    );
  }

  const tickInterval = data.length > 45 ? Math.floor(data.length / 8) : data.length > 20 ? 4 : 0;

  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="stepAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="stepBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
            interval={tickInterval}
            angle={data.length > 30 ? -35 : 0}
            textAnchor={data.length > 30 ? "end" : "middle"}
            height={data.length > 30 ? 48 : 30}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
          />
          <Tooltip content={<StepTooltip />} />
          <ReferenceLine
            y={STEP_GOAL}
            stroke="#fbbf24"
            strokeDasharray="6 4"
            label={{ value: "목표 8,000", fill: "#fbbf24", fontSize: 11, position: "insideTopRight" }}
          />
          <Bar dataKey="steps" barSize={data.length > 60 ? 4 : data.length > 30 ? 8 : 14} fill="url(#stepBarGrad)" radius={[3, 3, 0, 0]} />
          <Area type="monotone" dataKey="steps" stroke="#22c55e" strokeWidth={2} fill="url(#stepAreaGrad)" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
