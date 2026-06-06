import { ReactNode } from "react";

export default function TextAreaTitle(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <p
        className={`bg-camaColor1 rounded-lg px-4 py-1 text-white font-bold mb-3 ${props.className}`}
      >
        {props.children}
      </p>
    </>
  );
}
