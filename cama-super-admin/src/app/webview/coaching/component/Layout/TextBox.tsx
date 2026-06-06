import { ReactNode } from "react";

import useFontSize from "@/hooks/useFontSize";

export default function TextBox(props: {
  children: ReactNode;
  className?: string;
}) {
  const [fontSize] = useFontSize([0]);

  return (
    <>
      <div
        className={` p-[16px] shadow-md rounded-xl  bg-white font-notoR text-camaText leading-[28px] tracking-[-0.36px] ${
          props.className || ""
        }`}
        style={{ fontSize }}
      >
        {props.children}
      </div>
    </>
  );
}
