import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Image from "@/assets/images/mental/54.png";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";

// 무망감/무력감 - 자포자기형
export default function Step1() {
  return (
    <>
      <TextBox className="text-justify">
        <h1 className="text-center my-5  text-[30px] font-oneMobile text-camaColor1">
          자포자기형
        </h1>
        <ImageBox
          imgSrc={Image}
          className="w-[250px]"
          containerClassName="mb-5"
        />
        <MissionTitle>
          이제 끝이야.. <br />
          내가 뭘 할 수 있겠어..
        </MissionTitle>
      </TextBox>

      <TextArea className="mt-5 text-justify">
        포기하고 싶은 마음이 굴뚝같은 당신, 암 진단을 받고 비관적으로 느끼고
        계시는 것 같아요. <br />
        부정적인 생각이 가득하고 쉽게 압도당할 수 있는 유형이시네요.
      </TextArea>
    </>
  );
}
