import React, { useEffect, useRef, ReactNode, useCallback } from "react";

const useScrollToTopDiv = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const scrollDiv = divRef.current;
    if (scrollDiv) {
      scrollDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  interface ScrollToTopDivProps {
    children: ReactNode;
    onScrollToTop?: () => void;
  }

  const ScrollToTopDiv: React.FC<ScrollToTopDivProps> = ({
    children,
    onScrollToTop,
  }) => {
    useEffect(() => {
      scrollToTop();
    }, [children, scrollToTop]);

    useEffect(() => {
      if (onScrollToTop) {
        onScrollToTop();
      }
    }, [onScrollToTop]);

    return (
      <div className="pt-[90px] pb-[60px] overflow-y-auto h-full" ref={divRef}>
        {children}
      </div>
    );
  };

  return { ScrollToTopDiv, scrollToTop };
};

export default useScrollToTopDiv;
