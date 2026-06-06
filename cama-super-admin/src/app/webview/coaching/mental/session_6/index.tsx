import { useEffect } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { initAtom, stepAtom } from "./session6Atom";
import useScrollToTopDiv from "@/hooks/useScrollDiv";

// 2회기
export default function Session2() {
  const step = useAtomValue(stepAtom);
  const init = useSetAtom(initAtom);

  useEffect(() => {
    return () => {
      init();
    };
  }, []);
  const { ScrollToTopDiv } = useScrollToTopDiv();
  return (
    <>
      <ScrollToTopDiv>
        <div className="px-[28px] py-5">
          {
            {
              1: <Step1 />,
              2: <Step2 />,
              3: <Step3 />,
            }[step]
          }
        </div>
      </ScrollToTopDiv>
    </>
  );
}
