import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import { useSelector } from "react-redux";
import { getState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";

import Day6Pic1 from "./day6Pic1.png";
import Day6Pic2 from "./day6Pic2.png";
import ImageBox from "../../component/ImageBox";

export default function Day6Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;
  const progress = useSelector((s: RootState) => getState(s).progress);

  const diseaseName = progress[0].diseaseName;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        {step1 === "예" ? (
          <>
            <TextBox className="  text-justify">
              <ImageBox imgSrc={Day6Pic1} />
              <div className="mb-5   text-camaColor ">
                단백질을 충분히 잘 섭취하고 있네요!
              </div>
              암 치료 과정에서 단백질 보충은 세포 재생, 면역 기능 강화, 에너지
              공급에 도움이 되므로 매우 중요해요. <br />
              하지만 단백질을 섭취할 때 주의할 사항도 있으니 참고하세요.
            </TextBox>

            <TextArea className="mt-5  text-justify flex gap-1.5 items-start">
              <div>✔</div>
              <div>
                과도한 단백질 섭취는 신장에 부담을 줄 수 있어요. 암 치료로 인해
                신장 기능이 약해질 수 있으므로, 단백질 섭취량은 담당 의사와
                상의하는 것이 좋아요.
              </div>
            </TextArea>
            <TextArea className="mt-5  text-justify flex gap-1.5 items-start">
              <div>✔</div>
              <div>
                특히, 간 기능이 약한 경우에는 소고기, 돼지고기나 어류(생선),
                조류 등의 동물성 고단백질 음식을 많이 섭취하면 의식이 상실되는
                간성혼수의 위험이 있으니 조심하세요.
              </div>
            </TextArea>
            {diseaseName === "간암" && (
              <TextArea className="mt-10  text-justify">
                <TextAreaTitle>간암 환자인 경우</TextAreaTitle>
                간암 환자는 동물성 고단백질 음식을 많이 섭취하면 간성혼수가 올
                수 있어 주의가 필요해요. 또한 복수가 찬 경우라면 염분 섭취를
                최대한 줄이셔야 해요.
              </TextArea>
            )}
          </>
        ) : (
          <>
            <TextBox className=" text-justify ">
              <ImageBox imgSrc={Day6Pic2} />
              <div className="mb-5   text-camaColor tracking-tighter">
                단백질 섭취가 충분하지 않은 것 같네요.
              </div>
              육류 섭취가 부담되신다면 달걀, 콩, 두부, 생선 같은 단백질 음식을
              섭취해 보세요. 단백질 셰이크 형태의 균형 잡힌 식사나 단백질 음료를
              섭취하는 것도 좋은 방법이에요.
            </TextBox>
            <TextArea className="  mt-10  text-justify">
              단백질 섭취가 중요한 이유는 다음과 같아요.
            </TextArea>
            <TextArea className="mt-5  text-justify">
              <TextAreaTitle>✔ 세포 재생과 복구에 꼭 필요해요. </TextAreaTitle>
              단백질은 체내 세포의 주요 구성 요소로써 항암 치료로 손상된 세포의
              복구와 재생에 필수적이에요.
            </TextArea>
            <TextArea className="mt-5  text-justify">
              <TextAreaTitle> ✔ 면역 기능을 강화해요. </TextAreaTitle>
              단백질은 면역계에 중요한 구성요소예요. 충분한 단백질을 섭취하면
              감염에 대한 저항력을 높이고 면역 시스템을 강화할 수 있어요.
            </TextArea>
            <TextArea className="mt-5  text-justify">
              <TextAreaTitle> ✔ 근육량 유지 및 회복을 도와줘요. </TextAreaTitle>
              항암 치료는 근육량 감소를 초래할 수 있는데, 단백질은 이를
              예방하거나 최소화하는 데 도움을 줘요.
            </TextArea>
            <TextArea className="mt-5  text-justify">
              <TextAreaTitle> ✔ 에너지 공급에 이바지해요. </TextAreaTitle>
              단백질은 에너지의 중요한 원천이에요. 특히 다른 영양소 섭취가
              제한될 때 유용해요.
            </TextArea>
            <TextArea className="mt-5  text-justify">
              <TextAreaTitle>
                ✔ 항암 치료의 부작용을 완화할 수 있어요.
              </TextAreaTitle>
              단백질이 풍부한 식품은 피로, 식욕 부진 등의 항암 치료로 인한
              부작용을 완화하는 데 도움이 돼요.
            </TextArea>
            {diseaseName === "간암" && (
              <TextArea className="mt-10">
                <TextAreaTitle>간암 환자인 경우</TextAreaTitle>
                간암 환자는 동물성 고단백질 음식을 많이 섭취하면 간성혼수의
                위험이 있으니 주의해야 해요. 복수가 차 있는 경우라면 염분 섭취를
                최대한 줄이세요.
              </TextArea>
            )}
          </>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
