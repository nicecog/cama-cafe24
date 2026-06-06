import Card1Summary from "../Card1";
import { CardSummaryType } from "../Types/CardSummaryType";

// 복식호흡 복습
export default function Step2(props: CardSummaryType) {
  return (
    <>
      <Card1Summary onComplete={props.onComplete} />
    </>
  );
}
