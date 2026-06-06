import Footer from "../../component/Footer";
import {
  nextStepCdAtom,
  prevStepCdAtom,
  stepCdAtom,
  initAtom,
} from "./typeResultAtom";
import {
  questionResult,
  nextStepCdAtom as sessionNext,
  prevStepCdAtom as sessionPrev,
} from "../session1Atom";
import { useAtomValue, useSetAtom } from "jotai";
import Type1 from "./Type1";
import Type2 from "./Type2";
import Type3 from "./Type3";
import Type4 from "./Type4";
import Type5 from "./Type5";

import Mission from "@/assets/images/character/mission.png";
import { useEffect } from "react";
//
export default function TypeResult() {
  const stepCd = useAtomValue(stepCdAtom);
  const onNext = useSetAtom(nextStepCdAtom);
  const onPrev = useSetAtom(prevStepCdAtom);
  const init = useSetAtom(initAtom);

  const onSessionPrev = useSetAtom(sessionPrev);
  const onSessionNext = useSetAtom(sessionNext);
  // Atom
  const value = useAtomValue(questionResult);

  const onPrevHandler = () => {
    if (stepCd === 1) {
      onSessionPrev();
    } else {
      onPrev();
    }
  };

  const onNextHandler = () => {
    if (stepCd === 5) {
      onSessionNext();
    } else {
      onNext();
    }
  };

  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  return (
    <>
      {stepCd === 1 && (
        <div className="flex justify-center items-center gap-2 bg-white py-4 border-[#E8E8E8]  rounded-2xl border-[3px]">
          <img src={Mission} alt="mission" className="h-[60px]" />
          <div>
            <p className=" font-oneMobile -mt-1 text-center text-camaColorLight">
              당신은
              <span className="text-camaColor mx-1">{value.dispName}</span>
              입니다!
            </p>
          </div>
        </div>
      )}
      {
        {
          ["전투형"]: <Type1 />,
          ["순응형"]: <Type2 />,
          ["억압형"]: <Type3 />,
          ["자포자기형"]: <Type4 />,
          ["걱정형"]: <Type5 />,
        }[value.dispName]
      }

      <Footer onPrev={onPrevHandler} onNext={onNextHandler} />
    </>
  );
}
