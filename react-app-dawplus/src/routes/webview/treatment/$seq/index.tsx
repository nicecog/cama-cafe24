import { createFileRoute, redirect } from "@tanstack/react-router";

/** RN: /webview/treatment/{seq} → 콘텐츠 상세 */
export const Route = createFileRoute("/webview/treatment/$seq/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/content/detail/$id",
      params: { id: params.seq },
    });
  },
});
