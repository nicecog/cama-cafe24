import { ReactNode } from "react";

export default function CardComponent(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={` whitespace-break-spaces bg-yellow-50 px-4 py-2 rounded-lg shadow-md ${props.className}`}
      >
        {props.children}
      </div>
    </>
  );
}
