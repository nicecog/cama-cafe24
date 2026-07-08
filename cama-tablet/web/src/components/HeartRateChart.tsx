import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HeartRatePoint } from "../types/healthData";

type Props = {
  latestBpm?: number;
  history: HeartRatePoint[];
};

export default function HeartRateChart({ latestBpm, history }: Props) {
  if (history.length === 0 && latestBpm == null) {
    return <p style={{ color: "#64748b", fontSize: 14 }}>심박 데이터가 없습니다.</p>;
  }

  const data =
    history.length > 0
      ? history
      : [{ time: "현재", bpm: latestBpm ?? 0 }];

  return (
    <div>
      {latestBpm != null && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>현재 심박수</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#f472b6" }}>
            {latestBpm}
            <span style={{ fontSize: 16, fontWeight: 400, color: "#94a3b8" }}> bpm</span>
          </div>
        </div>
      )}
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
            />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ fill: "#f472b6", r: 4 }}
              name="bpm"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
