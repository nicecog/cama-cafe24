import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Home } from "lucide-react";

export const Route = createFileRoute("/error")({
  component: ErrorPage,
});

// 에러 페이지 컨텐츠 컴포넌트 (재사용 가능하도록 export)
export function ErrorPageContent() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="w-full max-w-md text-center">
        {/* 에러 아이콘 */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            오류가 발생했습니다
          </h1>
          <p className="text-lg text-gray-600">
            일시적인 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            문제가 계속되면 관리자에게 문의해주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-5 w-5" />
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorPage() {
  return <ErrorPageContent />;
}
