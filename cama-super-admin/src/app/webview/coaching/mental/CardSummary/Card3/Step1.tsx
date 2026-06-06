import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import { motion } from "framer-motion";
import useAlert from "@/hooks/useAlert";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import { CardSummaryType } from "../Types/CardSummaryType";
import { useSetAtom } from "jotai";
import { onCheckAtom } from "./Card3Atom";

export default function Step1(props: CardSummaryType) {
  const { alert } = useAlert();

  const onCheck = useSetAtom(onCheckAtom);

  const onClick = (check: boolean) => () => {
    const text = check
      ? "훌륭하시네요. 바로 연습해볼게요."
      : "괜찮아요, 카마코치와 복습해볼게요.";

    alert(text, () => {
      onCheck(check);
    });
  };

  return (
    <>
      <div>
        <TextArea className="mt-10 text-justify tracking-tighter">
          <MissionTitle className="mb-5">
            좋아요.
            <br /> 이번엔 명상을 해볼게요.
            <br /> 명상 기억나시나요?
          </MissionTitle>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3   w-full">
              <motion.button
                className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
                whileTap={{ scale: 1.15 }}
                onClick={onClick(true)}
              >
                <img src={mental} className="w-[60px]" />
                <p className="font-oneMobile text-camaColor1">네</p>
              </motion.button>
              <motion.button
                className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
                whileTap={{ scale: 1.15 }}
                onClick={onClick(false)}
              >
                <img src={mission} className="w-[60px]" />
                <p className="font-oneMobile text-camaColor1">아니오</p>
              </motion.button>
            </div>
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={props.onComplete}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">
                오늘은 그만 할게요.
              </p>
            </motion.button>
          </div>
        </TextArea>
      </div>
    </>
  );
}
