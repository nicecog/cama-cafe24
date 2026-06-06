import { ReactNode } from "react";

export default function ImporText(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`font-oneMobile text-camaColor1 mx-1 ${props.className}`}>
      {props.children}
    </span>
  );
}
