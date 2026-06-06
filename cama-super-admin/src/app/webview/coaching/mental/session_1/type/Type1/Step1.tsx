import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Image from "@/assets/images/mental/51.png";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";

export default function Step1() {
  return (
    <>
      <TextBox className="text-justify">
        <h1 className="text-center my-5  text-[30px] font-oneMobile text-camaColor1">
          전투형
        </h1>
        <ImageBox
          imgSrc={Image}
          className="w-[280px]"
          containerClassName="mb-5"
        />
        <MissionTitle>나는 싸운다! 나는 승리한다!</MissionTitle>
      </TextBox>

      <TextArea className="mt-5 text-justify">
        암과의 싸움에서 두려움을 무릅쓰고 당당히 맞서기 위해 용기를 낸 당신,
        암이라는 새로운 도전에 맞서는 용맹한 전사이시네요.
      </TextArea>
    </>
  );
}
