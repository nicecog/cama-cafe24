import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import { CardType } from "../CardTypes";
import { initAtom, maxStepAtom, stepAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

//  나말하기 기법
export default function Card2(props: CardType) {
  // Props
  const { title = "카마코칭" } = props;

  const step = useAtomValue(stepAtom);
  const init = useSetAtom(initAtom);

  const setMax = useSetAtom(maxStepAtom);

  useEffect(() => {
    setMax(9);
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
            9: <Step9 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </div>
  );
}
