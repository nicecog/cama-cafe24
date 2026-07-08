import { useMemo, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeartRateChart from "../components/HeartRateChart";
import InquiryList from "../components/InquiryList";
import StepChart from "../components/StepChart";
import { requestGenerateQr, requestStopBle } from "../lib/nativeBridge";
import type { HealthDataPayload } from "../types/healthData";

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = (location.state as { data?: HealthDataPayload })?.data;

  const stepsAvg = useMemo(() => {
    if (!data?.stepsHistory?.length) return data?.steps ?? 0;
    const sum = data.stepsHistory.reduce((a, s) => a + s.steps, 0);
    return Math.round(sum / data.stepsHistory.length);
  }, [data]);

  if (!data) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <p>표시할 데이터가 없습니다.</p>
        <button type="button" onClick={() => navigate("/")} style={btnStyle}>
          홈으로
        </button>
      </div>
    );
  }

  const handleNewSession = () => {
    requestStopBle();
    requestGenerateQr();
    navigate("/qr");
  };

  return (
    <div className="fade-in" style={{ minHeight: "100vh", padding: 20, background: "#0f172a" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottom: "1px solid #334155",
          paddingBottom: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>
            {data.patientName ?? "환자"}
          </h1>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            {data.patientId ? `ID: ${data.patientId}` : "블루투스로 수신된 건강 데이터"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={handleNewSession} style={btnStyle}>
            새 QR 연결
          </button>
          <button type="button" onClick={() => navigate("/")} style={btnStyle}>
            홈
          </button>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          minHeight: "calc(100vh - 110px)",
        }}
      >
        <section style={panelStyle}>
          <h2 style={h2}>발걸음</h2>
          <div style={{ display: "flex", gap: 32, marginBottom: 16 }}>
            <Stat label="오늘" value={data.steps ?? 0} color="#22c55e" />
            <Stat label="평균" value={stepsAvg} color="#4ade80" />
          </div>
          <StepChart steps={data.stepsHistory ?? []} />
        </section>

        <section style={panelStyle}>
          <h2 style={h2}>심박수</h2>
          <HeartRateChart
            latestBpm={data.heartRate}
            history={data.heartRateHistory ?? []}
          />
        </section>

        <section style={panelStyle}>
          <h2 style={h2}>문의사항 / 안내</h2>
          <InquiryList items={data.inquiries ?? []} />
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

const panelStyle: CSSProperties = {
  background: "#1e293b",
  borderRadius: 16,
  padding: 24,
  overflow: "auto",
  border: "1px solid #334155",
};

const h2: CSSProperties = {
  margin: "0 0 20px",
  fontSize: 18,
  color: "#e2e8f0",
  fontWeight: 700,
};

const btnStyle: CSSProperties = {
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#f8fafc",
  fontSize: 14,
};
