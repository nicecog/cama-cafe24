import { createFileRoute } from "@tanstack/react-router";
import { HelpMenuList } from "@/components/help/HelpMenuList";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

/** RN: /webview/help */
export const Route = createFileRoute("/webview/help/")({
  component: WebviewHelpRoute,
});

function WebviewHelpRoute() {
  return (
    <div className="min-h-dvh bg-white">
      <WebViewBackHeader title="도움말" backTo="/home" />
      <HelpMenuList linkBase="/webview/help" />
    </div>
  );
}
