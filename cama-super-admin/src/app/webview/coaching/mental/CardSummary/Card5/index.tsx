import { useAtomValue, useSetAtom } from "jotai";

import { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { initAtom, stepAtom } from "./Card5Atom";
import { CardSummaryType } from "../Types/CardSummaryType";

export default function Card5Summary(props: CardSummaryType) {
  const step = useAtomValue(stepAtom);

  const setStep = useSetAtom(stepAtom);

  const init = useSetAtom(initAtom);

  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  return (
    <>
      <div>
        {
          {
            1: <Step1 onComplete={props.onComplete}>{props.children}</Step1>,
            2: <Step2 onComplete={() => setStep(3)} />,
            3: <Step3 onComplete={props.onComplete} />,
          }[step]
        }
      </div>
    </>
  );
}
