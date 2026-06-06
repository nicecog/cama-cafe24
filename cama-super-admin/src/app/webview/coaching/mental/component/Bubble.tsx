import HelloType1 from "@/assets/images/character/helloType1.png";
import HelloType2 from "@/assets/images/character/helloType2.png";
import HelloType3 from "@/assets/images/character/helloType3.png";
import advice1 from "@/assets/images/character/advice1.png";
import advice2 from "@/assets/images/character/advice2.png";
import advice3 from "@/assets/images/character/advice3.png";

import { ReactNode } from "react";
export default function Bubble(props: {
  children: ReactNode;
  className?: string;
  type?: string;
}) {
  return (
    <>
      <div className={`flex flex-col items-center ${props.className}`}>
        <div className="bubble bubble-bottom-right shadow-lg   font-oneMobile text-f7 !text-camaColor1 text-center">
          {props.children}
        </div>
        <div className="mt-7">
          <img
            src={
              {
                type1: HelloType1,
                type2: HelloType2,
                type3: HelloType3,
                advice1: advice1,
                advice2: advice2,
                advice3: advice3,
              }[props.type || "type1"]
            }
            alt="Character"
            className="w-[110px]"
          />
        </div>
      </div>
    </>
  );
}
