import { HelpMenuList } from "@/components/help/HelpMenuList";
import { notifyWebViewNavigation } from "@/lib/webview/rnBridge";
import { useEffect } from "react";

/** /webview/help — cama-plus-app HelpPageMainScreen (레거시 re-export) */
export function HelpPageContent() {
  useEffect(() => {
    notifyWebViewNavigation();
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <HelpMenuList />
    </div>
  );
}
