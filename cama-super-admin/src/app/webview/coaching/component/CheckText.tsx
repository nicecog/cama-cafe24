import { ReactNode } from "react";

// 체크 가 포함된 텍스트
export default function CheckText(props: { children: ReactNode }) {
  return (
    <>
      <div className="flex item-center gap-2 my-0.5">
        <span>✔</span>
        <div>{props.children}</div>
      </div>
    </>
  );
}
