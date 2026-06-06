import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Advice from "@/assets/images/character/advice1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
import Card3Image from "@/assets/images/mental/58.png";
import { motion } from "framer-motion";
import useMentalApi from "../../../mentalApi";
import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import question from "@/assets/images/character/question.png";
import { VideoInfo } from "../CardTypes";
import { useParams } from "react-router-dom";

export default function Step3(props: {
  setVideoInfo: (data: VideoInfo) => void;
}) {
  const { loginId } = useParams();

  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

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
      <ImageBox
        imgSrc={Advice}
        className="w-[110px] mt-5"
        containerClassName="!mb-5"
      />
      <TextBox className="mt-5 text-justify ">
        명상은 몸의 반응, 떠오르는 생각, 느껴지는 감정, 주위 환경 등을
        알아차리도록 도와줘요. <br />
        마음을 안정시키는 데 도움이 되지요.
      </TextBox>

      <TextBox className="mt-4">
        <ImageBox imgSrc={Card3Image} containerClassName="mb-0" />
        쉽게 따라할 수 있는 3가지 <ImporText className="!mx-0">명상</ImporText>
        을 소개할게요.
      </TextBox>

      <TextArea className="mt-3 text-justify tracking-tighter">
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

      <Footer onPrev={onPrev} />
    </>
  );
}
