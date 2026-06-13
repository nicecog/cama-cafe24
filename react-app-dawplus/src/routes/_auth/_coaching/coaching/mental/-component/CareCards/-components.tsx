import { useLayoutEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function CareCardSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/80 bg-white/90 px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CareCardMutedSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <CareCardSurface
      className={cn(
        "border-primary/10 bg-gradient-to-b from-white to-emerald-50/40",
        className,
      )}
    >
      {children}
    </CareCardSurface>
  );
}

export function CareCardSelectButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-14 w-full rounded-2xl border-slate-200 bg-white/85 text-base font-extrabold text-primary shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:border-primary/30 hover:bg-white hover:text-primary active:text-primary focus:text-primary",
        className,
      )}
      onClick={(event) => {
        event.currentTarget.blur();
        onClick?.();
      }}
    >
      {children}
    </Button>
  );
}

export function CareCardImageChoiceButton({
  imageAlt,
  imageSrc,
  label,
  className,
  onClick,
}: {
  imageAlt: string;
  imageSrc: string;
  label: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/90 px-3 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white",
        className,
      )}
      onClick={(event) => {
        event.currentTarget.blur();
        onClick?.();
      }}
    >
      <img src={imageSrc} alt={imageAlt} className="w-[60px]" />
      <p className="mt-1.5 font-extrabold text-primary">{label}</p>
    </button>
  );
}

export function useCareCardStepScrollReset(step: number) {
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
        mainContainer.scrollTop = 0;
        mainContainer.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate attempt (useLayoutEffect fires before paint)
    scrollToTop();

    // Second attempt after first paint frame
    const frameId = window.requestAnimationFrame(() => {
      scrollToTop();
      // Third attempt: double-rAF to catch cases where layout
      // isn't fully settled after the first animation frame
      innerFrameId = window.requestAnimationFrame(scrollToTop);
    });

    // Final fallback via setTimeout for edge cases (e.g. iOS Safari)
    const timerId = window.setTimeout(scrollToTop, 50);

    let innerFrameId: number | undefined;

    return () => {
      window.cancelAnimationFrame(frameId);
      if (innerFrameId !== undefined) {
        window.cancelAnimationFrame(innerFrameId);
      }
      window.clearTimeout(timerId);
    };
  }, [step]);
}
