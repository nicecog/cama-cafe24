import clsx from "clsx";
import { ReactNode } from "react";

type SubjectButtonType = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
};

export default function SubjectButton(props: SubjectButtonType) {
  return (
    <>
      <button
        className={clsx(
          "p-2 rounded-md bg-white w-[145px] h-[55px] font-oneMobile text-camaColor1 border-camaColor1 border-2 text-f5 hover:bg-camaColor1 hover:text-white ",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </>
  );
}
