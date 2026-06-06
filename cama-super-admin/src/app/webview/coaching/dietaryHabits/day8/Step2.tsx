import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import day8Pic1 from "./day8Pic1.png";
import day8Pic2 from "./day8Pic2.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import { useSelector } from "react-redux";
import { getState } from "../../lib/coachingSlice";
import { RootState } from "@/store/store";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

export default function Day8Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;
  const progress = useSelector((s: RootState) => getState(s).progress);

  const diseaseName = progress[0].diseaseName;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <TextBox className="mt-10 text-justify">
          <div className="mb-5 text-[#774F2D] font-bold">
            {step1 === "예" ? (
              <>
                <ImageBox imgSrc={day8Pic1} />
                과일과 채소를 매일 섭취하셨군요!
              </>
            ) : (
              <>
                <ImageBox imgSrc={day8Pic2} />
                평소 과일과 채소를 잘 챙겨 먹지 못하셨네요.
              </>
            )}
          </div>
          매일 과일과 채소를 드시면 좋은 이유를 알려드릴게요.
        </TextBox>

        <TextArea className="mt-10 text-justify flex gap-1 items-start">
          <div>✔</div>
          <div>
            과일과 채소에는 비타민 C, 비타민 E, 셀레늄과 같은 항산화 성분이
            풍부해, 활성산소로 인한 세포 손상을 줄여주고 암 발생 및 진행을
            억제할 수 있어요.
          </div>
        </TextArea>

        <TextArea className="mt-10 text-justify flex gap-1 items-start">
          <div>✔</div>
          <div>
            과일과 채소는 면역계를 강화하는 다양한 영양소와 미네랄을 함유하고
            있어, 감염과 다른 합병증에 더 잘 대처할 수 있게 해줘요.
          </div>
        </TextArea>

        <TextArea className="mt-10 text-justify flex gap-1 items-start">
          <div>✔</div>
          <div>
            여러 연구에서 과일과 채소의 성분이 염증을 줄이는 데 도움이 된다고
            밝혀졌어요. 염증이 줄어들면 암의 진행을 늦추고 항암치료의 효과를
            높일 수 있어요.
          </div>
        </TextArea>

        <TextArea className="mt-10 text-justify flex gap-1 items-start">
          <div>✔</div>
          <div>
            일부 과일과 채소는 식욕 부진, 피로, 구토와 같은 항암치료의 부작용을
            완화하는 데에도 도움을 줘요.
          </div>
        </TextArea>

        <TextArea className="mt-10 text-justify flex gap-1 items-start">
          <div>✔</div>
          <div>
            과일과 채소는 다양한 영양소를 제공하여 전반적인 영양 상태를
            개선함으로써, 암 치료의 효과를 높이고 빠른 회복을 지원해요.
          </div>
        </TextArea>
        <TextArea className="mt-10 text-justify">
          그러나 과일과 채소 섭취에도 주의사항이 있어요. 미생물에 의한 감염
          위험이 있는 혈액암의 경우, 반드시 잘 씻거나 익힌 과일과 채소를
          섭취하셔야 해요.
        </TextArea>

        {diseaseName === "대장암" && (
          <TextArea className="mt-10 text-justify">
            <TextAreaTitle>대장암인 경우</TextAreaTitle>
            대장암 환자라면 생과일이나 생채소는 설사를 유발할 수 있으니
            주의하셔야 해요. 또한 양배추나 양파는 뱃속에 가스를 유발하고,
            섬유질이 많이 함유된 채소는 장폐색을 유발할 수도 있어요. 그래서
            생채소보다는 푹 익힌 채소를 먹고 단백질을 더 많이 보충하시는 것이
            좋아요.
          </TextArea>
        )}
        {diseaseName === "소장암" && (
          <TextArea className="mt-10 text-justify">
            <TextAreaTitle>소장암인 경우</TextAreaTitle>
            소장암 환자라면 신결석의 예방을 위해 수산이 많이 든 음식(시금치,
            셀러리, 땅콩, 초콜릿, 차, 딸기 등)의 섭취를 줄이는 것이 좋아요.
          </TextArea>
        )}
        {diseaseName === "난소암" && (
          <TextArea className="mt-10 text-justify">
            <TextAreaTitle>난소암인 경우</TextAreaTitle>
            난소암 환자라면 충분한 단백질과 비타민, 미네랄을 섭취하되 채식은
            가능한 피하는 것이 좋아요. 특히 가스가 생기기 쉬운 마늘이나 양파는
            안 먹는 것이 좋아요.
          </TextArea>
        )}
        {diseaseName === "신장암" && (
          <TextArea className="mt-10 text-justify">
            <TextAreaTitle>신장암의 경우</TextAreaTitle>
            신장암 환자라면 면역 항암제나 표적 치료 시 기름기 많은 음식과 섬유질
            위주의 식사는 설사를 악화시킬 수 있으므로 주의해야 해요. 또한 자몽,
            자몽주스나 히페리시, 염소 풀이라고 불리는 세인트존스워트 추출물(St.
            John's wort extract) 등은 표적 치료제의 체내 대사계인 사이토크롬
            P450(CYP)에 영향을 줄 수 있으니 피하는 것이 좋아요.
          </TextArea>
        )}
        {diseaseName === "간암" && (
          <TextArea className="mt-10 text-justify">
            <TextAreaTitle>간암의 경우</TextAreaTitle>
            간암이면 종종 간에 좋다고 알려진 약초나 식물을 섭취하는 경우가
            있는데 오히려 간에 해로울 수 있어요. 혹시라도 이런 식물들을 섭취하고
            싶다면 반드시 의사와 상의 후에 결정하셔야 해요.
          </TextArea>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
