import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Image from "@/assets/images/mental/55.png";
import ImporText from "../../../component/ImportText";

// 불안몰두 - 걱정형
export default function Step1() {
  return (
    <>
      <TextBox className="text-justify">
        <h1 className="text-center my-5  text-[30px] font-oneMobile text-camaColor1">
          걱정형
        </h1>
        <ImageBox
          imgSrc={Image}
          className="w-[250px]"
          containerClassName="!mb-0"
        />
      </TextBox>

      <TextArea className="mt-5 text-justify">
        온통 암에 대한 생각으로 머릿속이 꽉찬 당신, 계속된 걱정으로
        <ImporText>'혹시 더 나빠지면 어떡하지', '재발은 아닐까' </ImporText>하는
        염려 때문에 더 많은 정보를 찾아 헤매고 있지는 않나요?
      </TextArea>
    </>
  );
}
