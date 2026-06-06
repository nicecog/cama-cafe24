import { useRef, useEffect } from "react";

export const useEffectOnce = (
  effect: () => void | (() => void) | Promise<void>
) => {
  const destroyFunc = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    const runEffect = async () => {
      const effectCleanup = await effect();
      destroyFunc.current = () => {
        if (typeof effectCleanup === "function") {
          effectCleanup();
        }
      };
    };

    if (!effectCalled.current) {
      runEffect();
      effectCalled.current = true;
    }

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};
