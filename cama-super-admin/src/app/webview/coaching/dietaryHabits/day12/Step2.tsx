import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

import { checkAnswerList } from "../index";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

import Day12Pic from "./day12.png";

export default function Day12Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1Data } = props;

  const checkAnswer = step1Data.map((r: string) => checkAnswerList.indexOf(r));

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <ImageBox imgSrc={Day12Pic} />

        {checkAnswer.includes(0) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[0]}</TextAreaTitle>
            ✔ 컨디션이 좋을 때 많이 먹으려고 해보세요. <br />✔ 식사할 때는
            음료를 적게 마시고, 식사 사이에 수분을 보충하세요.
          </TextArea>
        )}
        {checkAnswer.includes(1) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[1]}</TextAreaTitle>
            ✔ 적은 양의 고열량 식품(푸딩, 아이스크림, 요거트, 밀크셰이크 등)을
            하루에 여러 번 먹는 것도 도움이 돼요.
            <br />
            ✔ 구토 증상이 있을 때는 되도록 식사를 피하시는 것이 좋아요.
            <br />
            ✔ 구토가 멈추면 죽이나 부드러운 음식으로 식사를 시작하세요.
            <br />
            ✔ 하루 이상 구토가 계속되면 담당 의사와 상담하세요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(2) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[2]}</TextAreaTitle>
            ✔ 뜨거운 음식은 피하고, 입안이 쓰릴 때는 빨대를 사용하세요.
            <br />
            ✔ 가글액을 사용해 주기적으로 입안을 헹구세요. 이는 구강 내 감염을
            예방하고 통증을 완화하는 데 도움이 돼요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(3) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[3]}</TextAreaTitle>
            ✔ 차가운 물을 항상 가까이 두고 자주 조금씩 마셔서 입 안을
            적셔주세요.
            <br />
            ✔ 집에서 가글액(베이킹소다 1ts, 소금 1ts, 물 4컵)을 직접 만들어서
            하루에 4-6회 사용해보세요.
            <br />
            ✔ 바셀린, 코코아버터, 립밤 등으로 입술 보습에 신경써주세요. <br />
            ✔ 금주, 금연하기 / 매운 음식, 산성 음식(음료)은 자제하세요. <br />
            ✔ 쫄깃한 사탕류, 질긴 고기, 프레즐, 딱딱한 생과일과 생야채는
            피해주세요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(4) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[4]}</TextAreaTitle>
            ✔ 스무디, 셰이크, 영양 보조식품 등을 이용해 열량과 단백질을 보충해
            보세요.
            <br />
            ✔ 휘핑크림, 사워크림, 크림치즈, 버터와 같은 고열량 식품을 음식에
            추가해 드셔 보세요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(5) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[5]}</TextAreaTitle>
            ✔ 고염분 음식(육수, 수프, 스포츠음료, 크래커 등)을 드세요.
            <br />
            ✔ 고칼륨 음식(과일 주스, 스포츠음료, 바나나 등)을 드세요.
            <br />
            ✔ 설사 후에는 최소한 1컵의 음료를 마셔 수분을 보충하세요.
            <br />
            ✔ 빵, 사탕, 디저트, 젤리 등은 가능한 피하세요.
            <br />
            ✔ 설사가 지속되거나 대변의 색, 냄새가 이상할 경우 치료받고 있는
            병원이나 담당 의사에게 연락하세요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(6) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[6]}</TextAreaTitle>
            ✔ 가스를 유발할 수 있는 음식(사과, 아보카도, 콩, 양배추, 브로콜리,
            우유 등)은 피하려고 노력하세요.
            <br />
            ✔ 껌을 씹거나 음료를 빨대로 마시는 행위는 가능한 한 자제해 주세요.
            이는 장내 가스를 유발할 수 있어요.
            <br />
            ✔ 신체적 활동을 최대한 늘려보세요.
            <br />
          </TextArea>
        )}
        {checkAnswer.includes(7) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>{checkAnswerList[7]}</TextAreaTitle>
            ✔ 약을 가루로 만들어 주스, 소스, 젤리, 푸딩에 섞어 드셔 보세요. 다만
            약효가 떨어지거나 음식과 안 맞을 수 있으므로, 실행하기 전에 주치의나
            약사와 상의하세요.
            <br />
            ✔ 술, 맵고 자극적인 음식, 산성 음식은 가능한 한 피하세요.
            <br />
            ✔ 식사할 때는 바른 자세로 앉아 있으세요. 식사 후에도 몇 분간 앉은
            자세를 유지하여 소화를 돕는 것이 좋아요.
            <br />
            ✔ 음식을 삼킬 때 구역질, 기침이 나거나 숨이 막히는 증상이 있다면,
            안전하게 음식을 삼키는 방법을 알려주는 전문가에게 문의하여 증상을
            완화할 수 있도록 도움을 받으세요.
            <br />
          </TextArea>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
