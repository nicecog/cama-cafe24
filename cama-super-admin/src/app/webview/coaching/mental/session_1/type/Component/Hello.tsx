import Bubble from "../../../component/Bubble";

import { ReactNode } from "react";

export default function Hello(props: {
  type: "intro" | "result";
  children: ReactNode;
}) {
  return (
    <>
      <Bubble
        className="mt-2"
        type={props.type === "intro" ? "type1" : "type2"}
      >
        {props.children}
      </Bubble>
    </>
  );
}
