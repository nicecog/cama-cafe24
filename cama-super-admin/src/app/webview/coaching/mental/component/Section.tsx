import { ReactNode, useEffect, useRef } from "react";

// Scroll Top
export default function Section(props: {
  children: ReactNode;
  stepCd: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollDiv = divRef.current;
    if (scrollDiv) {
      scrollDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [props.stepCd]);
  return (
    <>
      <div ref={divRef} className="pt-[90px] pb-[60px] overflow-y-auto h-full">
        {props.children}
      </div>
    </>
  );
}
