import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ReactPlayer from "react-player";
import useAlert from "@/hooks/useAlert";
import Bubble from "../../component/Bubble";
const url = "https://youtu.be/o42JtHKTcew?si=kZVQkI_monzCt58E";
export default function Step5() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const { confirm } = useAlert();

  const onNextHandler = () => {
    confirm(
      {
        text: "복식호흡 훈련은 잘 마치셨나요 ? ",
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      },
      () => {
        onNext();
      }
    );
  };

  return (
    <>
      <Bubble className="">
        우선, 편안한 자세로 자리에 <br />
        앉거나 누워 보세요.
        <p className="mt-2">준비되셨으면 시작할게요.</p>
      </Bubble>

      <div className="w-full h-[300px] mt-5">
        <ReactPlayer url={url} width="100%" height="100%" controls={true} />
      </div>

      <Footer onPrev={onPrev} onNext={onNextHandler} />
    </>
  );
}
