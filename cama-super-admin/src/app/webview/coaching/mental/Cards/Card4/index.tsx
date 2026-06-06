import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step12 from "./Step12";
import Step13 from "./Step13";
import Step14 from "./Step14";
import Step15 from "./Step15";
import Step16 from "./Step16";
import Step17 from "./Step17";
import Step18 from "./Step18";
import Step19 from "./Step19";
import Step20 from "./Step20";
import Step21 from "./Step21";

import { CardType } from "../CardTypes";
import { initAtom, maxStepAtom, stepAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

//  생각바꾸기 솔루션
export default function Card4(props: CardType) {
  // Props
  const { title = "카마코칭" } = props;

  const step = useAtomValue(stepAtom);
  const init = useSetAtom(initAtom);
  const setMax = useSetAtom(maxStepAtom);

  useEffect(() => {
    setMax(21);
    return () => {
      init();
    };
  }, []);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollDiv = divRef.current;
    if (scrollDiv) {
      setTimeout(() => {
        scrollDiv.scrollTop = 0;
        scrollDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [step]);

  return (
    <div className="pt-[90px] pb-[60px] overflow-y-auto h-full" ref={divRef}>
      <div className="px-[28px] py-5">
        {
          {
            1: <Step1 title={title} />,
            2: <Step2 />,
            3: <Step3 />,
            4: <Step4 />,
            5: <Step5 />,
            6: <Step6 />,
            7: <Step7 />,
            8: <Step8 />,
            9: <Step9 />,
            10: <Step10 />,
            11: <Step11 />,
            12: <Step12 />,
            13: <Step13 />,
            14: <Step14 />,
            15: <Step15 />,
            16: <Step16 />,
            17: <Step17 />,
            18: <Step18 />,
            19: <Step19 />,
            20: <Step20 />,
            21: <Step21 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </div>
  );
}
