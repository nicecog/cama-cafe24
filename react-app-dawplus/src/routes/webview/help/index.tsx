import { createFileRoute } from "@tanstack/react-router";
import { HelpPageContent } from "@/components/help/HelpPageContent";

/** RN: /webview/help */
export const Route = createFileRoute("/webview/help/")({
  component: HelpPageContent,
});
