import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import { FcAbout } from "react-icons/fc";
import ImporText from "../../component/ImportText";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  ">
        마음근육훈련에서 배운 방법으로 생각을 바꿔볼까요?
      </TextArea>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'사람들이 수군거릴 것만 같아...'</ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          사람들이 내 흉터만 쳐다보는 건 아니야. 나를 본다고 해도 어떻게
          생각할지는 모르는 일이지.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText className="tracking-tighter">
            '나는 더 이상 여자로서 매력이 없어.'
          </ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          나의 매력은 가슴에만 있지 않아. 이 흉터는 나를 살린 흔적이야.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText className="tracking-tighter">
            '암이 재발한 건 아닐까?'
          </ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          암이 재발했다는 근거는 없어. 오늘은 좀 피곤한 것 같아. 쉬어봐야겠어.
        </div>
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
