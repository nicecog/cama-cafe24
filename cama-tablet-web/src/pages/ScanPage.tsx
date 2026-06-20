import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { scanQr } from "../lib/api";
import { isNativeApp, onNativeEvent, requestQrScan } from "../lib/nativeBridge";

export default function ScanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onNativeEvent(async (detail) => {
      if (!detail.ok || !detail.payload) {
        setError(detail.error ?? "QR 인식 실패");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await scanQr(detail.payload);
        navigate(`/dashboard/${data.patient.seq}`, { state: { data } });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "서버 오류");
      } finally {
        setLoading(false);
      }
    });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>CAMA Tablet</h1>
      <p style={{ color: "#94a3b8", marginBottom: 32 }}>
        환자 앱 QR을 스캔하면 건강 데이터 대시보드가 표시됩니다.
      </p>
      <button
        type="button"
        onClick={() => requestQrScan()}
        disabled={loading}
        style={{
          padding: "16px 48px",
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 12,
          border: "none",
          background: "#22c55e",
          color: "#052e16",
        }}
      >
        {loading ? "불러오는 중…" : "QR 스캔 시작"}
      </button>
      {!isNativeApp() && (
        <p style={{ marginTop: 16, fontSize: 13, color: "#64748b" }}>
          브라우저 모드: 버튼 클릭 시 테스트 QR 입력
        </p>
      )}
      {error && <p style={{ marginTop: 24, color: "#f87171" }}>{error}</p>}
    </div>
  );
}
