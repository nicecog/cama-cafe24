import { useAtomValue, useSetAtom } from "jotai";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

import Step6 from "./Step6";
import { initAtom, stepCdAtom } from "./session1Atom";
import { useEffect } from "react";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function Session_1() {
  const stepCd = useAtomValue(stepCdAtom);
  const initialize = useSetAtom(initAtom);

  const { divRef } = useScrollToTop(stepCd); // 훅을 사용합니다.

  useEffect(() => {
    return () => {
      initialize();
    };
  }, []);

  return (
    <>
      <div className="pt-[90px] pb-[60px] overflow-y-auto h-full" ref={divRef}>
        {
          {
            1: <Step1 />,
            2: <Step2 />,
            3: <Step3 />,
            4: <Step4 />,
            5: <Step5 />,
            6: <Step6 />,
          }[stepCd]
        }
      </div>
    </>
  );
}
