import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** 라우트 오류·미매칭 시 로그인으로 보냄 (모바일 캐시·구버전 JS 대응) */
export default function AdminRouteFallback() {
  const navigate = useNavigate();
  const error = useRouteError();

  useEffect(() => {
    console.error("Admin route fallback:", error);
    navigate("/login", { replace: true });
  }, [error, navigate]);

  if (import.meta.env.DEV && isRouteErrorResponse(error)) {
    return (
      <div className="p-6 text-sm text-red-600">
        Route error {error.status}: {error.statusText}
      </div>
    );
  }

  return (
    <div className="flex min-h-[60dvh] items-center justify-center text-sm text-gray-600">
      로그인 화면으로 이동 중...
    </div>
  );
}
