import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateMockHealthData } from "../lib/mockHealthData";

/** 개발용: 샘플 데이터로 대시보드 바로 표시 */
export default function PreviewPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", {
      replace: true,
      state: { data: generateMockHealthData() },
    });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#94a3b8",
      }}
    >
      샘플 데이터 로딩 중…
    </div>
  );
}
