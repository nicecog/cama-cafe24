import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Image from "@/assets/images/mental/53.png";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";

// 억압형 - 인지적 회피
export default function Step1() {
  return (
    <>
      <TextBox className="text-justify">
        <h1 className="text-center my-5  text-[30px] font-oneMobile text-camaColor1">
          억압형
        </h1>
        <ImageBox
          imgSrc={Image}
          className="w-[250px]"
          containerClassName="mb-5"
        />
        <MissionTitle>
          생각하고 싶지 않아.. <br />
          그냥 어떻게든 되겠지..
        </MissionTitle>
      </TextBox>

      <TextArea className="mt-5 text-justify">
        암과 관련된 것들은 생각하지 않는 게 마음 편한 당신, 스트레스를 받으면
        불쾌하고 불편한 생각을 피하는 경향이 있으시군요. <br />암 뿐만 아니라
        여러가지 스트레스에 대처하는 방식일 수 있어요.
      </TextArea>
    </>
  );
}
