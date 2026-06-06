import { useAtomValue, useSetAtom } from "jotai";
import { initAtom, maxStepAtom, stepAtom } from "../CareCardAtom";
import { useEffect } from "react";
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

//  암재발 불안

export default function Card7(props: { onSave: () => void }) {
  const step = useAtomValue(stepAtom);

  const setMax = useSetAtom(maxStepAtom);

  const init = useSetAtom(initAtom);

  useEffect(() => {
    setMax(11);
    return () => {
      init();
    };
  }, []);

  return (
    <>
      <div>
        {
          {
            1: <Step1 />,
            2: <Step2 />,
            3: <Step3 />,
            4: <Step4 />,
            5: <Step5 />,
            6: <Step6 />,
            7: <Step7 />,
            8: <Step8 />,
            9: <Step9 />,
            10: <Step10 />,
            11: <Step11 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </>
  );
}
