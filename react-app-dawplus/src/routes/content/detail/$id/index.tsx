import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ContentDetail from "@/components/ContentDetail";
import { useUpdateTrackGuestProgress } from "@/hooks/mutations/webview";
import { useGetContentDetail } from "@/hooks/queries";
import { notifyWebViewNavigation } from "@/lib/webview/rnBridge";

export const Route = createFileRoute("/content/detail/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.id,
    };
  },
});

function RouteComponent() {
  const { id } = Route.useLoaderData();
  const { data, isLoading } = useGetContentDetail(id);

  // 비회원 진도율 업데이트
  const { mutate: updateGuestProgress } = useUpdateTrackGuestProgress();

  useEffect(() => {
    notifyWebViewNavigation();
  }, []);

  useEffect(() => {
    // 콘텐츠가 로드되었을 때 진도율 업데이트
    if (data?.seq) {
      updateGuestProgress({
        contentsSeq: Number(data.seq),
        progress: 100,
      });
      console.log("비회원 진도율 업데이트:", data.seq);
    }
  }, [data?.seq, updateGuestProgress]);

  // interest 값에서 대괄호와 따옴표 제거
  const cleanInterest = (interest: string) => {
    return interest.replace(/[[\]"]/g, "").trim();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">콘텐츠를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base-fixed font-semibold text-gray-700 font-jalnan">
              {cleanInterest(data.interest)}
            </h2>
          </div>
        </div>
      </header>

      {/* Content - 컴포넌트로 분리 (ScrollToTop 버튼 포함) */}
      <ContentDetail
        title={data.title}
        contents={data.contents || ""}
        interest={data.interest}
        disease={data.disease || "{}"}
        createdAt={data.createdAt}
      />
    </div>
  );
}
