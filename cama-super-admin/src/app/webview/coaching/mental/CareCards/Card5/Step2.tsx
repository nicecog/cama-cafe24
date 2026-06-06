import Footer from "../../component/Footer";
import { prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import Card1Summary from "../../CardSummary/Card1";

export default function Step2(props: { onSave: () => void }) {
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Card1Summary onComplete={props.onSave} />
      <Footer onPrev={onPrev} />
    </>
  );
}
