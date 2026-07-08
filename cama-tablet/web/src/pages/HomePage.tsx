import { useNavigate } from "react-router-dom";
import { isNativeApp, requestGenerateQr } from "../lib/nativeBridge";

export default function HomePage() {
  const navigate = useNavigate();

  const handleGenerate = () => {
    requestGenerateQr();
    navigate("/qr");
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        background: "linear-gradient(135deg, #0f172a 0%, #14532d 50%, #0f172a 100%)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 560,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 32,
            fontWeight: 800,
            color: "#052e16",
          }}
        >
          C
        </div>
        <h1 style={{ fontSize: 36, margin: "0 0 12px", fontWeight: 800 }}>CAMA Tablet</h1>
        <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.6, marginBottom: 48 }}>
          인터넷 없이 동작하는 건강 데이터 수신 태블릿입니다.
          <br />
          QR을 생성하면 환자 앱이 스캔하여 블루투스로 데이터를 전송합니다.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          className="pulse"
          style={{
            padding: "20px 56px",
            fontSize: 22,
            fontWeight: 700,
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            color: "#052e16",
            boxShadow: "0 8px 32px rgba(34, 197, 94, 0.35)",
          }}
        >
          QR 생성하기
        </button>

        {!isNativeApp() && (
          <p style={{ marginTop: 20, fontSize: 13, color: "#64748b" }}>
            브라우저 개발 모드 — 네이티브 BLE 없이 UI만 테스트합니다.
          </p>
        )}
      </div>
    </div>
  );
}
