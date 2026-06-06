import { ReactNode } from "react";
import Bubble from "../component/Bubble";
import useMentalType from "@/hooks/useMentalType";

type SummaryType = {
  CardType: "card1" | "card2" | "card3" | "card4";
};

const Card1Title: { [key: string]: ReactNode } = {
  ["전투형"]: (
    <>
      마음의 휴식을 위한
      <br />
      복식호흡
    </>
  ),
  ["억압형"]: (
    <>
      기분을 다스리는
      <br />
      복식호흡
    </>
  ),
  ["순응형"]: (
    <>
      기분을 다스리는 <br />
      복식호흡
    </>
  ),
  ["자포자기형"]: (
    <>
      마음이 편안해지는 <br />
      복식호흡
    </>
  ),
  ["걱정형"]: (
    <>
      마음이 편안해지는 <br />
      복식호흡
    </>
  ),
};

const Card2Title: { [key: string]: ReactNode } = {
  ["전투형"]: (
    <>
      나를 돌보는
      <br />
      마음 표현하기
    </>
  ),
  ["억압형"]: (
    <>
      적극적 대처를 위한
      <br />
      마음 표현하기
    </>
  ),
  ["순응형"]: (
    <>
      나를 돌보는
      <br />
      마음 표현하기
    </>
  ),
  ["자포자기형"]: (
    <>
      나를 돌보는
      <br />
      마음 표현하기
    </>
  ),
  ["걱정형"]: (
    <>
      나를 돌보는
      <br />
      마음 표현하기
    </>
  ),
};

const Card3Title: { [key: string]: ReactNode } = {
  ["전투형"]: (
    <>
      마음의 휴식을 위한
      <br />
      명상
    </>
  ),
  ["억압형"]: (
    <>
      마음을 알아차리는
      <br />
      명상
    </>
  ),
  ["순응형"]: (
    <>
      마음을 달래는
      <br />
      명상
    </>
  ),
  ["자포자기형"]: (
    <>
      마음의 회복을 돕는
      <br />
      명상
    </>
  ),
  ["걱정형"]: (
    <>
      생각을 덜어내기 위한
      <br />
      명상
    </>
  ),
};

const Card4Title: { [key: string]: ReactNode } = {
  ["전투형"]: (
    <>
      긍정적인 마음을 위한
      <br />
      생각바꾸기
    </>
  ),
  ["억압형"]: (
    <>
      기분을 달래는
      <br />
      생각바꾸기
    </>
  ),
  ["순응형"]: (
    <>
      긍정적인 마음을 위한
      <br />
      생각바꾸기
    </>
  ),
  ["자포자기형"]: (
    <>
      긍정적인 마음을 위한
      <br />
      생각바꾸기
    </>
  ),
  ["걱정형"]: (
    <>
      걱정을 줄이기 위한
      <br />
      생각바꾸기
    </>
  ),
};

const useCardSummary = (props: SummaryType) => {
  const type: string = useMentalType();

  let title: ReactNode;

  switch (props.CardType) {
    case "card1":
      title = Card1Title[type];
      break;
    case "card2":
      title = Card2Title[type];
      break;
    case "card3":
      title = Card3Title[type];
      break;
    case "card4":
      title = Card4Title[type];
      break;
    default:
      title = null;
  }

  return <Bubble>{title}</Bubble>;
};

export default useCardSummary;
