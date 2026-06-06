import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Image from "@/assets/images/mental/52.png";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ImporText from "../../../component/ImportText";

export default function Step1() {
  return (
    <>
      <TextBox className="text-justify">
        <h1 className="text-center my-5  text-[30px] font-oneMobile text-camaColor1">
          순응형
        </h1>
        <ImageBox
          imgSrc={Image}
          className="w-[250px]"
          containerClassName="mb-5"
        />
        <MissionTitle>운명이야.. 피할 수 없어.. </MissionTitle>
      </TextBox>

      <TextArea className="mt-5 text-justify">
        순응적인 당신, 암을 진단받고{" "}
        <ImporText>‘어쩔 수 없는 일이야, 운명인가봐’</ImporText>
        하며 받아들이고 계시네요.
      </TextArea>
    </>
  );
}
