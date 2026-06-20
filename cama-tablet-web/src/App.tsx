import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ScanPage from "./pages/ScanPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScanPage />} />
      <Route path="/dashboard/:accountSeq" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
