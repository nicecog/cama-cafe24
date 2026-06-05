import { createFileRoute } from "@tanstack/react-router";
import { HelpPageContent } from "@/components/help/HelpPageContent";

export const Route = createFileRoute("/help/")({
  component: HelpPageContent,
});
