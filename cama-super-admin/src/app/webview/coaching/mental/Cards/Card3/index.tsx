import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

import { CardType } from "../CardTypes";
import { initAtom, maxStepAtom, stepAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { VideoInfo } from "@/app/main/contentMng/videoMng/Page";

const initialVideoInfo: VideoInfo = {
  createdAt: "",
  detailDesc: "",
  loginId: null,
  priority: 0,
  seq: 0,
  updatedAt: "",
  url: "",
  useYn: "",
  videoTypeCd: "",
};

//  명상 솔루션
export default function Card3(props: CardType) {
  // Props
  const { title = "카마코칭" } = props;

  const step = useAtomValue(stepAtom);
  const init = useSetAtom(initAtom);
  const setMax = useSetAtom(maxStepAtom);

  const [videoInfo, setVideo] = useState(initialVideoInfo);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMax(5);
    return () => {
      init();
    };
  }, []);

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
            1: <Step1 title={title} onPrev={props.onPrev} />,
            2: <Step2 />,
            3: <Step3 setVideoInfo={setVideo} />,
            4: <Step4 videoInfo={videoInfo} />,
            5: <Step5 onSave={props.onSave} />,
          }[step]
        }
      </div>
    </div>
  );
}
