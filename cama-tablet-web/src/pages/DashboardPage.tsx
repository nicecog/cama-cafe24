import { useEffect, useState, type CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CoachingRadial from "../components/CoachingRadial";
import StepChart from "../components/StepChart";
import { fetchDashboard } from "../lib/api";
import { requestQrScan } from "../lib/nativeBridge";
import type { DashboardData } from "../types/dashboard";

export default function DashboardPage() {
  const { accountSeq } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(
    (location.state as { data?: DashboardData })?.data ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data || !accountSeq) return;
    fetchDashboard(Number(accountSeq))
      .then(setData)
      .catch((e) => setError(e.message));
  }, [accountSeq, data]);

  if (error) {
    return <div style={{ padding: 24, color: "#f87171" }}>{error}</div>;
  }
  if (!data) {
    return <div style={{ padding: 24 }}>로딩 중…</div>;
  }

  const p = data.patient;

  return (
    <div style={{ minHeight: "100vh", padding: 20, background: "#0f172a" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          borderBottom: "1px solid #334155",
          paddingBottom: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{p.name}</h1>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>
            {p.loginId} · {p.diseaseName ?? "질환 미등록"} · {p.userTypeNm}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => requestQrScan()}
            style={btnStyle}
          >
            다른 QR 스캔
          </button>
          <button type="button" onClick={() => navigate("/")} style={btnStyle}>
            홈
          </button>
        </div>
      </header>

      {/* 가로 3열 레이아웃 (태블릿 landscape) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <section style={panelStyle}>
          <h2 style={h2}>발걸음</h2>
          <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
            <Stat label="오늘" value={data.stepsToday} />
            <Stat label="7일 평균" value={data.stepsAvg7d} />
          </div>
          <StepChart steps={data.steps} />
        </section>

        <section style={panelStyle}>
          <h2 style={h2}>건강 코칭 진행률</h2>
          <CoachingRadial items={data.coaching} />
          <h2 style={{ ...h2, marginTop: 24 }}>심박수</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            {data.heartRate.message}
            {data.heartRate.available && data.heartRate.latestBpm != null && (
              <span> · {data.heartRate.latestBpm} bpm</span>
            )}
          </p>
        </section>

        <section style={panelStyle}>
          <h2 style={h2}>의료진 안내 / 치료정보</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.inquiries.length === 0 && (
              <li style={{ color: "#64748b" }}>등록된 내역이 없습니다.</li>
            )}
            {data.inquiries.map((q) => (
              <li
                key={q.contentsSeq}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #334155",
                }}
              >
                <div style={{ fontWeight: 600 }}>{q.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  {q.preview}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {q.updatedAt}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value.toLocaleString()}</div>
    </div>
  );
}

const panelStyle: CSSProperties = {
  background: "#1e293b",
  borderRadius: 16,
  padding: 20,
  overflow: "auto",
};

const h2: CSSProperties = {
  margin: "0 0 16px",
  fontSize: 18,
  color: "#e2e8f0",
};

const btnStyle: CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#f8fafc",
};
