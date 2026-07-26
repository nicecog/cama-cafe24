import { useEffect, useLayoutEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { initAtom, stepAtom } from "./-session6Atoms";
import Step1 from "./-Step1";
import Step2 from "./-Step2";
import Step3 from "./-Step3";

export function MentalSection6Page() {
  const step = useAtomValue(stepAtom);
  const init = useSetAtom(initAtom);

  useLayoutEffect(() => {
    if (!step) return;
    if (document.body.dataset.mentalDevBridgeNoScroll === "true") {
      return;
    }

    const scrollContainerId = import.meta.env.VITE_MAIN_SCROLL_CONTAINER_ID;

    const scrollToTop = () => {
      const mainContainer = scrollContainerId
        ? document.getElementById(scrollContainerId)
        : null;

      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const frameId = window.requestAnimationFrame(scrollToTop);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [step]);

  useEffect(() => {
    return () => {
      init();
    };
  }, [init]);

  return (
    <div className="min-h-screen relative px-5 pb-28 pt-6 overflow-x-hidden">
      {/* Fixed Full Background to prevent scroll cutoffs */}
      <div className="fixed inset-0 -z-20 bg-[#f2f7f5]" />

      {/* Decorative background blurs */}
      <div className="fixed -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="fixed -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="mx-auto max-w-[32rem] space-y-5 relative z-10">
        {{
          1: <Step1 />,
          2: <Step2 />,
          3: <Step3 />,
        }[step] ?? null}
      </div>
    </div>
  );
}
