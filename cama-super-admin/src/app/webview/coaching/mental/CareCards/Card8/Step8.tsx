import Footer from "../../component/Footer";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";
import TextBox from "../../../component/Layout/TextBox";
import MentalButton from "../../component/MentalButton";
import { FcAbout, FcRight } from "react-icons/fc";

export default function Step11(props: { onSave: () => void }) {
  return (
    <>
      <Bubble className="mt-5 mb-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>

      <TextArea className="mt-5 text-justify">
        <ImporText className="!mx-0">5가지 행복의 기술</ImporText>로 삶의 질을
        높이며 더 많이 행복하게 살아보아요.
      </TextArea>

      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5  font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            1. 긍정정서
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcRight className="text-f7" />
          <p className="text-camaColor1">
            긍정적인 정서를 자주 경험하고 만끽하기
          </p>
        </div>
      </TextBox>

      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5  font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            2. 몰입
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcRight className="text-f7" />
          <p className="text-camaColor1">
            다양한 영역에서 몰입하는 순간 경험하기
          </p>
        </div>
      </TextBox>

      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5  font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            3. 관계
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcRight className="text-f7" />
          <p className="text-camaColor1">긍정적인 관계 형성하기</p>
        </div>
      </TextBox>

      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5  font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            4. 의미
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcRight className="text-f7" />
          <p className="text-camaColor1">
            나만의 삶의 의미를 발견하고 추구하기
          </p>
        </div>
      </TextBox>
      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5  font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            5. 성취
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcRight className="text-f7" />
          <p className="text-camaColor1">강점을 발휘해 성취감 느끼기</p>
        </div>
      </TextBox>

      <MentalButton onClick={props.onSave}>완료</MentalButton>
      <Footer />
    </>
  );
}
