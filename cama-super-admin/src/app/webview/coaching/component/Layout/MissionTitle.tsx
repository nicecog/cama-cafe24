import useFontSize from "@/hooks/useFontSize";
import { ReactNode } from "react";

export default function MissionTitle(props: {
  children: ReactNode;
  className?: string;
}) {
  const [xl] = useFontSize([4]);
  return (
    <div
      className={` text-center tracking-[-0.44px]  font-oneMobile text-camaColor1 ${props.className}`}
      style={{ fontSize: xl }}
    >
      {props.children}
    </div>
  );
}
