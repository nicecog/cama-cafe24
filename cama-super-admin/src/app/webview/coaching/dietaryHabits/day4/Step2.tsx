import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useGetAnswer from "@/hooks/useGetAnswer";
import { checkAnswerList } from "../index";
import TextArea from "../../component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

import Day4Pic from "./day4Pic.png";
import CheckText from "../../component/CheckText";

export default function StartDayStep2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  const result = useGetAnswer("dietaryHabits", "03", ["A1"]);

  const chooseAnswers = result.map((r) =>
    checkAnswerList.indexOf(r.answerChoice)
  );

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <ImageBox imgSrc={Day4Pic} className="mt-5 shadow-md" />
        {chooseAnswers.includes(0) && (
          <TextArea className="mt-5">
            <TextAreaTitle>입맛이 없고 식욕이 떨어진다면</TextAreaTitle>
            <CheckText>조금씩 자주 먹도록 하세요.</CheckText>
            <CheckText>
              먹고 싶을 때 바로 먹을 수 있게 간식을 가까운 곳에 두세요.
            </CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(1) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>속이 메스껍고 토할 것 같다면</TextAreaTitle>
            <CheckText>
              기름진 음식이나 너무 단 음식, 향이 강한 음식은 피하세요.
            </CheckText>
            <CheckText>식사는 조금씩 자주 그리고 천천히 해보세요.</CheckText>
            <CheckText>
              치료받는 날은 치료받기 전에 간단한 식사나 간식을 드시는 것이
              좋아요.
            </CheckText>
            <CheckText>
              항암화학요법 또는 방사선치료를 받는 동안 메스꺼운 증세가
              나타난다면, 치료 1~2시간 전에는 음식을 섭취하지 않도록 해보세요.
            </CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(2) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>입안이 쓰리고 아프다면</TextAreaTitle>
            <CheckText>
              부드럽고 촉촉한 음식, 씹고 삼키기 쉬운 음식을 드세요.
            </CheckText>
            <CheckText>입안을 자극하는 음식은 피하세요.</CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(3) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>입안이 너무 건조하다면</TextAreaTitle>
            <CheckText>하루 종일 충분한 양의 물이나 음료를 드세요.</CheckText>
            <CheckText>
              조금씩 먹으면서 음식을 충분히 씹고 천천히 삼키는 것이 좋아요.
            </CheckText>
            <CheckText>
              음식을 먹을 때는 음료나 국(수프)으로 촉촉하게 만든 후 씹어
              넘기세요.
            </CheckText>
            <CheckText>
              입안이 마르지 않도록 얼음 조각이나 무설탕 사탕, 무설탕 껌을 입에
              넣고 있으면 침 분비를 자극할 수 있어요.
            </CheckText>
            <br />
          </TextArea>
        )}
        {chooseAnswers.includes(4) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>체중이 계속 줄고 있다면</TextAreaTitle>
            <CheckText>
              충분한 수분 섭취가 중요하다는 것을 잊지 마세요.
            </CheckText>
            <CheckText>
              견과류, 건과일, 그래놀라, 삶은 달걀과 같은 고열량, 고단백 식사와
              간식을 먹는 것이 도움이 돼요.
            </CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(5) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>설사를 너무 자주 한다면</TextAreaTitle>
            <CheckText>
              물, 사과주스, 육수, 스포츠음료, 젤라틴과 같은 부드럽고 탄산이 없는
              음료를 마시는 것이 좋아요.
            </CheckText>
            <CheckText>적은 양을 자주 섭취하는 것이 도움이 돼요.</CheckText>
            <CheckText>튀기거나 기름진 고지방 음식은 피하세요.</CheckText>
            <CheckText>
              고식이섬유 음식(견과류, 통곡물, 콩, 과일, 생야채 등)은 피하세요.
            </CheckText>
            <CheckText>
              우유와 대부분의 유제품은 피하되, 요거트는 섭취해도 괜찮아요.
            </CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(6) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>변비가 생겼다면</TextAreaTitle>
            <CheckText>
              담당 의사에게 배변 관리 계획을 요청하고, 필요하다면 식이섬유
              보조제나 변비약을 처방받으세요.
            </CheckText>
            <CheckText>
              규칙적으로 매일 같은 시간에 식사하는 습관을 유지하세요.
            </CheckText>
            <CheckText>충분한 수분을 섭취하려고 노력하세요.</CheckText>
          </TextArea>
        )}
        {chooseAnswers.includes(6) && (
          <TextArea className="mt-5 text-justify">
            <TextAreaTitle>삼키는 것이 어렵다면</TextAreaTitle>
            <CheckText>
              조금씩, 자주, 부드럽고 싱거운 고열량, 고단백 음식을 섭취하세요.
            </CheckText>
            <CheckText>
              한 번에 적은 양을 입에 넣고 완전히 삼킨 후 다음 음식을 섭취하세요.
            </CheckText>
            <CheckText>
              액상이나 유동식을 드실 때는 빨대를 사용해 보세요.
            </CheckText>
            <CheckText>
              퓌레나 이유식처럼 음식을 으깨거나 걸쭉하게 만들어 드시는 것도
              좋아요.
            </CheckText>
            <CheckText>
              젤라틴, 타피오카, 전분 등을 활용해 음식을 걸쭉하게 만들어 드셔
              보세요.
            </CheckText>
          </TextArea>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
