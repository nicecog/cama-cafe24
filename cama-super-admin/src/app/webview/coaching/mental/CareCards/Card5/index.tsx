import { useAtomValue, useSetAtom } from "jotai";
import { initAtom, maxStepAtom, stepAtom } from "../CareCardAtom";
import { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

//  수술 후 호흡 불편감
export default function Card5(props: { onSave: () => void }) {
  const step = useAtomValue(stepAtom);

  const setMax = useSetAtom(maxStepAtom);

  const init = useSetAtom(initAtom);

  useEffect(() => {
    setMax(2);
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
            2: <Step2 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </>
  );
}
