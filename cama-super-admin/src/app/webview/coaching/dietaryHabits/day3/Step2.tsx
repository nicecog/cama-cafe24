import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

import { checkAnswerList } from "../index";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import TextArea from "../../component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import Day3Pic from "./day3Pic.png";
import ImageBox from "../../component/ImageBox";

const symptoms = [
  "식욕 부진은 암 자체와 그 치료 과정에서 흔히 발생할 수 있으며, 암으로 인한 두려움이나 우울감 때문에도 생길 수 있어요. 또, 암이나 항암치료, 혹은 치아 문제로 인해 음식의 맛이나 냄새에 대한 민감성이 증가할 수도 있어요. 특히 고단백 식품인 고기나 생선을 먹을 때, 쓴맛 또는 금속 같은 맛을 느끼고 아예 음식의 맛을 잃어버리는 경우가 있어요. 하지만 이러한 변화는 치료가 종료되면 사라질 거예요.",
  "수술, 화학요법, 방사선요법 등의 치료에서 메스꺼움은 흔히 겪는 부작용이에요. 일부 사람들은 치료 직후에 메스꺼움을 경험하는 반면, 다른 이들은 치료 2~3일 후에 증상이 나타나기도 해요. 물론 메스꺼움을 전혀 겪지 않는 사람들도 있고, 메스꺼움을 경험했던 대부분 사람은 치료가 종료되면 증상이 사라지기도 해요. 이런 부작용을 조절하기 위한 약물이 있으며, 항암 치료 전에는 구토 방지를 위해 항구토제를 미리 사용하기도 해요.",
  "입안과 목구멍은 우리 몸에서 가장 민감한 부분이에요. 방사선요법, 화학요법, 또는 감염 때문에 입은 통증, 잇몸 손상, 인후염, 식도염 등이 자주 발생할 수 있어요. 만약 입안 통증이나 잇몸에 염증이 있다면, 의사 선생님을 방문하여 진료받고, 이 증상이 항암치료의 부작용인지 아니면 치과 질환인지 알아보는 것이 좋아요.",
  "항암치료로 인한 탈수는 입안을 건조하게 만들 수 있어요. 특히, 머리나 목 부위에 방사선 치료를 받았다면 입안의 건조함이 더욱 심해질 수 있어요. 입안의 건조함은 수분 부족의 신호이기 때문에, 충분한 양의 물을 마시며 몸의 수분을 보충하는 것이 중요해요.",
  "암 환자분들은 치료 과정 중에 체중이 감소하는 경우가 흔해요. 체중 감소는 환자의 체력을 약하게 만들고, 암에 대한 저항력과 치료의 효과를 낮출 수 있어요. 따라서, 체중 감소를 방지하기 위해 충분한 열량과 단백질을 섭취하는 것이 중요해요.",
  "설사는 항암 화학요법, 감염, 음식에 대한 과민 반응, 불쾌감 등 다양한 원인으로 발생할 수 있어요. 이는 영양소의 흡수를 방해하고 과도한 수분 손실로 탈수를 일으킬 수 있으므로 주의가 필요해요.",
  "항암치료 중 약물로 인한 부작용, 장 운동성의 저하, 섬유질 섭취 부족, 수분 부족 등으로 변비가 생길 수 있어요. 변비는 암 치료 과정 중 자주 발생하는 문제이기 때문에, 치료의 초기 단계부터 이에 대한 관리 계획을 세우는 것이 좋아요. 필요하다면 약물 치료, 식이 조절, 운동 요법 등으로 개선할 수 있어요.",
  "암 자체나 암 치료로 인해 음식을 삼키기 어려워질 수 있어요. 이는 인두 부위의 점막 손상이나 삼키는 데 필요한 근육 조절 능력의 저하 때문일 수 있고, 식도에 암이 있거나 수술을 받은 경우도 원인이 될 수 있어요. 이런 문제는 심각한 영양 불균형과 체중 감소를 초래할 수 있으므로, 적절한 관리와 치료가 중요해요.",
];

export default function StartDayStep2(props: any) {
  // Props;
  const { onNext, onPrev, step1Data } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>방해요인 검토</InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day3Pic} />
          {step1Data.map((r: string, idx: number) => (
            <p className="text-camaColor1 font-bold" key={idx}>
              - {r}
            </p>
          ))}
          <p className="mt-2">이 주된 어려움이라고 답해 주셨네요.</p>
        </TextBox>
        {step1Data
          .map((r: string) => checkAnswerList.indexOf(r))
          .map((item: number) => (
            <TextArea className="mt-10 text-justify" key={item}>
              <TextAreaTitle>{checkAnswerList[item]}</TextAreaTitle>
              {symptoms[item]}
            </TextArea>
          ))}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
