import { ReactNode, useEffect, useRef } from "react";

export default function Section(props: {
  children: ReactNode;
  progressTypeCd: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollDiv = divRef.current;
    if (scrollDiv) {
      setTimeout(() => {
        scrollDiv.scrollTop = 0;
        scrollDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [props.progressTypeCd]);

  return (
    <section
      className="pt-[90px] overflow-y-scroll pb-[60px] h-full"
      ref={divRef}
    >
      {props.children}
    </section>
  );
}
