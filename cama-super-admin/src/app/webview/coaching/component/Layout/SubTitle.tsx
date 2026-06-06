import useFontSize from "@/hooks/useFontSize";
import { ReactNode } from "react";

export default function SubTitle(props: {
  children: ReactNode;
  className?: string;
}) {
  const [xl] = useFontSize([2]);
  return (
    <>
      <div
        className={`mt-3 font-bold text-title ${props.className}`}
        style={{ fontSize: xl }}
      >
        {props.children}
      </div>
    </>
  );
}
