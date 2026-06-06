import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import TextBox from "../../../component/Layout/TextBox";
import { FcAbout } from "react-icons/fc";
export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextArea className="mt-5">
        <MissionTitle>
          유방암 환자들이 자주하는 <br />
          생각을 살펴볼게요.
        </MissionTitle>
      </TextArea>
      <TextBox className="mt-5 ">
        <p className="font-oneMobile flex items-center gap-1">
          <FcAbout className="w-[20px]" />
          <span>'사람들이 수군거릴 것만 같아...'</span>
        </p>
        <p className="font-oneMobile flex items-center gap-1">
          <FcAbout className="w-[20px]" />
          <span>(수술 후에)</span>
        </p>

        <p className="font-oneMobile ml-6">
          '나는 더 이상 여자로서 매력이 없어.'
        </p>
        <p className="font-oneMobile flex items-center gap-1">
          <FcAbout className="w-[20px]" />
          <span>(작은 신체 증상에도)</span>
        </p>

        <p className="font-oneMobile  ml-6">'암이 재발한 건 아닐까?'</p>
      </TextBox>
      <TextArea className="mt-5">
        이런 생각은 스트레스가 되고 자신감을 더욱 더 잃게 만들 수 있어요.
      </TextArea>
      <Footer onNext={onNext} />
    </>
  );
}
