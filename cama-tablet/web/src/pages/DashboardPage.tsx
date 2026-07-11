import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HealthTab from "../components/HealthTab";
import InquiryTab from "../components/InquiryTab";
import TabBar from "../components/TabBar";
import { requestGenerateQr, requestStopBle } from "../lib/nativeBridge";
import type { DashboardTab, HealthDataPayload } from "../types/healthData";

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = (location.state as { data?: HealthDataPayload })?.data;
  const [activeTab, setActiveTab] = useState<DashboardTab>("health");

  if (!data) {
    return (
      <div className="dashboard-empty">
        <p>표시할 데이터가 없습니다.</p>
        <button type="button" className="dashboard-btn" onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    );
  }

  const inquiryCount = data.inquiries?.length ?? 0;

  const handleNewSession = () => {
    requestStopBle();
    requestGenerateQr();
    navigate("/qr");
  };

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div className="dashboard-header-info">
          <div className="dashboard-avatar">
            {(data.patientName ?? "환")[0]}
          </div>
          <div>
            <h1 className="dashboard-title">{data.patientName ?? "환자"}</h1>
            <p className="dashboard-subtitle">
              {data.patientId ? `ID ${data.patientId}` : "블루투스 수신 데이터"}
              {" · "}건강 리포트
            </p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <button type="button" className="dashboard-btn dashboard-btn--primary" onClick={handleNewSession}>
            새 QR 연결
          </button>
          <button type="button" className="dashboard-btn" onClick={() => navigate("/")}>
            홈
          </button>
        </div>
      </header>

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "health", label: "건강 데이터" },
          { id: "inquiry", label: "문의사항", badge: inquiryCount },
        ]}
      />

      <main className="dashboard-content">
        {activeTab === "health" && <HealthTab data={data} />}
        {activeTab === "inquiry" && <InquiryTab items={data.inquiries ?? []} />}
      </main>
    </div>
  );
}
