import React from "react";

export type BoxType = {
  style?: object;
  className?: string;
  children?: React.ReactNode;
};

export default function Box({ style, children, className }: BoxType) {
  return (
    <>
      <div
        className={`bg-white shadow-md rounded-md px-5 py-2 pt-4 overflow-hidden h-[calc(100vh_-_125px)] ${className}`}
        style={style}
      >
        {children}
      </div>
    </>
  );
}
