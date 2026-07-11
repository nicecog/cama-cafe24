import { createFileRoute } from "@tanstack/react-router";
import { HelpMenuList } from "@/components/help/HelpMenuList";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

export const Route = createFileRoute("/help/")({
  component: HelpIndexPage,
});

function HelpIndexPage() {
  return (
    <div className="min-h-dvh bg-white">
      <WebViewBackHeader title="도움말" backTo="/home" />
      <HelpMenuList linkBase="/help" />
    </div>
  );
}
