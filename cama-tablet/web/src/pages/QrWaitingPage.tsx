import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearPersistedHealthData,
  isNativeApp,
  onNativeEvent,
  readNativeLastHealthData,
  requestGenerateQr,
  requestStopBle,
  simulateHealthData,
} from "../lib/nativeBridge";
import type { HealthDataPayload, QrPayload } from "../types/healthData";

type ConnectionStatus = "starting" | "waiting" | "connected" | "error";

export default function QrWaitingPage() {
  const navigate = useNavigate();
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [qrInfo, setQrInfo] = useState<QrPayload | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("starting");
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 새 세션: 이전 폴링 잔여 데이터가 있으면 대시보드로 튕기지 않도록 한 번 더 비움
    clearPersistedHealthData();
    requestGenerateQr();

    const poll = window.setInterval(() => {
      const data = readNativeLastHealthData();
      if (data) {
        navigate("/dashboard", { state: { data }, replace: true });
      }
    }, 1500);

    const unsubscribe = onNativeEvent((detail) => {
      switch (detail.type) {
        case "bleSessionStarted": {
          const raw = detail.payload.qrPayload;
          setQrPayload(raw);
          try {
            setQrInfo(JSON.parse(raw) as QrPayload);
          } catch {
            setQrInfo(null);
          }
          setStatus("waiting");
          setError(null);
          break;
        }
        case "bleConnected":
          setStatus("connected");
          setConnectedName(detail.payload.deviceName);
          break;
        case "bleDisconnected":
          setStatus("waiting");
          setConnectedName(null);
          break;
        case "healthDataReceived":
          navigate("/dashboard", {
            state: { data: detail.payload as HealthDataPayload },
            replace: true,
          });
          break;
        case "bleError":
          setStatus("error");
          setError(detail.error ?? "블루투스 오류");
          break;
        default:
          break;
      }
    });

    return () => {
      window.clearInterval(poll);
      unsubscribe();
    };
  }, [navigate]);

  const handleCancel = () => {
    requestStopBle();
    navigate("/");
  };

  const statusLabel: Record<ConnectionStatus, string> = {
    starting: "블루투스 준비 중…",
    waiting: "환자 앱에서 QR을 스캔해 주세요",
    connected: `${connectedName ?? "기기"} 연결됨 — 데이터 전송 대기`,
    error: error ?? "오류",
  };

  const statusColor: Record<ConnectionStatus, string> = {
    starting: "#fbbf24",
    waiting: "#38bdf8",
    connected: "#22c55e",
    error: "#f87171",
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 32,
        background: "#0f172a",
      }}
    >
      {/* QR 영역 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {qrPayload ? (
          <QRCodeSVG value={qrPayload} size={280} level="M" includeMargin />
        ) : (
          <div
            style={{
              width: 280,
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: 16,
            }}
          >
            QR 생성 중…
          </div>
        )}
        {qrInfo && (
          <div style={{ marginTop: 16, textAlign: "center", color: "#334155" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{qrInfo.deviceName}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, wordBreak: "break-all", maxWidth: 260 }}>
              {qrInfo.serviceUuid}
            </div>
          </div>
        )}
      </div>

      {/* 상태 패널 */}
      <div style={{ maxWidth: 400 }}>
        <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>연결 대기</h2>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "#1e293b",
            marginBottom: 24,
          }}
        >
          <span
            className={status === "waiting" ? "pulse" : undefined}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: statusColor[status],
            }}
          />
          <span style={{ fontSize: 14, color: statusColor[status] }}>{statusLabel[status]}</span>
        </div>

        <ol style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>환자 휴대폰에서 CAMA 앱을 실행합니다.</li>
          <li>앱 내 QR 스캔으로 이 코드를 읽습니다.</li>
          <li>블루투스로 걸음수·심박수·문의사항이 전송됩니다.</li>
          <li>수신 즉시 대시보드가 표시됩니다.</li>
        </ol>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "1px solid #475569",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 15,
            }}
          >
            취소
          </button>
          {!isNativeApp() && (
            <button
              type="button"
              onClick={simulateHealthData}
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: "none",
                background: "#334155",
                color: "#f8fafc",
                fontSize: 15,
              }}
            >
              테스트 데이터 수신
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
