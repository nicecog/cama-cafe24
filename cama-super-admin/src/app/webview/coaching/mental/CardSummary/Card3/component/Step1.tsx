import { useSetAtom } from "jotai";
import { nextSubStepAtom } from "../Card3Atom";

import { motion } from "framer-motion";

import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import question from "@/assets/images/character/question.png";

import useMentalApi from "@/app/webview/coaching/mentalApi";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import { useParams } from "react-router-dom";

export default function Step3(props: { setVideoInfo: (data: any) => void }) {
  const onNext = useSetAtom(nextSubStepAtom);

  const { loginId } = useParams();

  const { getCmVideoInfoList } = useMentalApi(loginId);

  const { data } = getCmVideoInfoList();
  //  V1: 호흡 , V3 : 자비 , V2: 바디스캔
  const onClick = (type: string) => () => {
    const _info = data?.find((r: any) => r.videoTypeCd === type);
    props.setVideoInfo(_info);
    onNext();
  };

  return (
    <>
      <MissionTitle className="mt-5">
        따라하기 쉬운 명상 <br />세 가지를 소개합니다.
      </MissionTitle>

      <TextArea className="mt-6 text-justify tracking-tighter">
        <div className="flex gap-4 flex-col w-full">
          <div className="flex w-full gap-4">
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick("V1")}
            >
              <img src={mental} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">호흡명상</p>
            </motion.button>
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick("V3")}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">자비명상</p>
            </motion.button>
          </div>
          <motion.button
            className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
            whileTap={{ scale: 1.09 }}
            onClick={onClick("V2")}
          >
            <img src={question} className="w-[60px]" />
            <p className="font-oneMobile text-camaColor1">바디스캔명상</p>
          </motion.button>
        </div>
      </TextArea>
    </>
  );
}
