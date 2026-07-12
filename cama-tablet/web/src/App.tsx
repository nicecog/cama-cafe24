import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PreviewPage from "./pages/PreviewPage";
import QrWaitingPage from "./pages/QrWaitingPage";
import { onNativeEvent, persistHealthData } from "./lib/nativeBridge";
import type { HealthDataPayload } from "./types/healthData";

function NativeHealthRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    return onNativeEvent((detail) => {
      if (detail.type !== "healthDataReceived" || !detail.ok) return;
      const data = detail.payload as HealthDataPayload;
      persistHealthData(data);
      navigate("/dashboard", { state: { data }, replace: true });
    });
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <NativeHealthRouter />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/qr" element={<QrWaitingPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}
