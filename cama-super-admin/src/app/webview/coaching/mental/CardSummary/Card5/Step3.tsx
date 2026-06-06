import Card3Summary from "../Card3";
import { CardSummaryType } from "../Types/CardSummaryType";

// 명상
export default function Step3(props: CardSummaryType) {
  return <Card3Summary onComplete={props.onComplete} />;
}
