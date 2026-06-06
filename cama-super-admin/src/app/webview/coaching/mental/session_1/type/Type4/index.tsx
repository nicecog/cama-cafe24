import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

import { stepCdAtom } from "../typeResultAtom";
import { useAtomValue } from "jotai";
// 순응형 운명론
export default function Type1() {
  const stepCd = useAtomValue(stepCdAtom);

  return (
    <>
      {
        {
          1: <Step1 />,
          2: <Step2 />,
          3: <Step3 />,
          4: <Step4 />,
          5: <Step5 />,
        }[stepCd]
      }
    </>
  );
}
