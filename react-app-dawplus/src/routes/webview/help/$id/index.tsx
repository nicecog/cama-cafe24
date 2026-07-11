import { createFileRoute, redirect } from "@tanstack/react-router";
import { FontSizeController } from "@/components/FontSizeController";
import {
  getHelpDetailContent,
  getHelpDetailTitle,
  isValidHelpDetailId,
} from "@/components/help/helpDetailMap";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

export const Route = createFileRoute("/webview/help/$id/")({
  beforeLoad: ({ params }) => {
    const id = Number(params.id);
    if (!isValidHelpDetailId(id)) {
      throw redirect({ to: "/webview/help" });
    }
  },
  component: WebviewHelpDetailPage,
});

function WebviewHelpDetailPage() {
  const { id } = Route.useParams();
  const detailId = Number(id);

  return (
    <div className="min-h-dvh bg-white pb-8">
      <WebViewBackHeader title={getHelpDetailTitle(detailId)} backTo="/webview/help" />
      <div className="sticky top-[50px] z-10 flex justify-end border-b bg-white px-4 py-2">
        <FontSizeController />
      </div>
      {getHelpDetailContent(detailId)}
    </div>
  );
}
