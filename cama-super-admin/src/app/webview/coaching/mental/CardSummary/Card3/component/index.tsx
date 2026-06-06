import Step1 from "./Step1";
import Step2 from "./Step2";

import { subStepAtom } from "../Card3Atom";
import { useAtomValue } from "jotai";
import { useState } from "react";
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
export default function Card3Type1(props: { onComplete: () => void }) {
  const step = useAtomValue(subStepAtom);

  const [videoInfo, setVideo] = useState(initialVideoInfo);

  return (
    <>
      {
        {
          1: <Step1 setVideoInfo={setVideo} />,
          2: <Step2 videoInfo={videoInfo} onComplete={props.onComplete} />,
        }[step]
      }
    </>
  );
}
