import { ReactNode } from "react";

export default function Title(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <h1
        className={` text-center text-camaColor1 font-bold text-f11 ${props.className}`}
      >
        {props.children}
      </h1>
    </>
  );
}
