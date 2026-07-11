import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { normalizeHeartRateSeries } from "../lib/healthStats";
import type { HeartRatePoint } from "../types/healthData";

type Props = {
  latestBpm?: number;
  history: HeartRatePoint[];
  height?: number;
};

const NORMAL_MIN = 60;
const NORMAL_MAX = 100;

function HeartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const bpm = payload[0]?.value ?? 0;
  let zone = "정상";
  if (bpm < NORMAL_MIN) zone = "낮음";
  else if (bpm > NORMAL_MAX) zone = "높음";
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value chart-tooltip-value--heart">{bpm} bpm</div>
      <div className="chart-tooltip-meta">{zone} 범위</div>
    </div>
  );
}

export default function HeartRateChart({ latestBpm, history, height = 280 }: Props) {
  const data = normalizeHeartRateSeries(history, latestBpm);

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <span className="chart-empty-icon">❤️</span>
        <p>심박 데이터가 없습니다.</p>
      </div>
    );
  }

  const tickInterval = data.length > 45 ? Math.floor(data.length / 8) : data.length > 20 ? 4 : 0;

  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="heartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <ReferenceArea y1={NORMAL_MIN} y2={NORMAL_MAX} fill="#22c55e" fillOpacity={0.08} />
          <XAxis
            dataKey="label"
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
            domain={["dataMin - 10", "dataMax + 10"]}
          />
          <Tooltip content={<HeartTooltip />} />
          <Area
            type="monotone"
            dataKey="bpm"
            stroke="#f472b6"
            strokeWidth={2.5}
            fill="url(#heartAreaGrad)"
            dot={data.length <= 31 ? { fill: "#f472b6", r: 3, strokeWidth: 0 } : false}
            activeDot={{ r: 5, fill: "#fb7185" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
