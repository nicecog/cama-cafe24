import { ReactNode } from "react";

import useFontSize from "@/hooks/useFontSize";

export default function TextArea(props: {
  children: ReactNode;
  className?: string;
}) {
  const [fontSize] = useFontSize([0]);

  return (
    <>
      <div
        className={` font-notoR text-camaColor leading-[30px] tracking-[-0.36px] ${props.className}`}
        style={{ fontSize }}
      >
        {props.children}
      </div>
    </>
  );
}
