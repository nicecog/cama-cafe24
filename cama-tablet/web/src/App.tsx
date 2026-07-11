import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PreviewPage from "./pages/PreviewPage";
import QrWaitingPage from "./pages/QrWaitingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/qr" element={<QrWaitingPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
