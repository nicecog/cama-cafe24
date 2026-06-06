import { useEffect, useRef } from "react";

const useScrollToTop = <T>(dep: T) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToTop();
  }, [dep]);

  const scrollToTop = () => {
    const scrollDiv = divRef.current;
    if (scrollDiv) {
      scrollDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return { divRef, scrollToTop };
};

export default useScrollToTop;
