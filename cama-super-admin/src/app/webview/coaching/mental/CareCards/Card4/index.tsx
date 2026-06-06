import { useAtomValue, useSetAtom } from "jotai";
import { initAtom, maxStepAtom, stepAtom } from "../CareCardAtom";
import { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

//  성기능 저하와 친밀감 문제
export default function Card4(props: { onSave: () => void }) {
  const step = useAtomValue(stepAtom);

  const setMax = useSetAtom(maxStepAtom);

  const init = useSetAtom(initAtom);

  useEffect(() => {
    setMax(5);
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
            5: <Step5 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </>
  );
}
