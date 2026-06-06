import ReactPlayer from "react-player";
import Mental from "@/assets/images/character/mental.png";
import V1Video from "./V1Video";
import V2Video from "./V2Video";
import V3Video from "./V3Video";

import ImageBox from "@/app/webview/coaching/component/ImageBox";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MentalButton from "../../../component/MentalButton";

// 나 말하기 기법
export default function Step4(props: {
  videoInfo: any;
  onComplete: () => void;
}) {
  //  V1: 호흡 ,   V2: 바디스캔,  V3 : 자비
  const { videoTypeCd } = props.videoInfo;

  return (
    <>
      <ImageBox
        imgSrc={Mental}
        className="w-[85px]"
        containerClassName="!mb-0 mt-5"
      />
      <TextBox className="mt-5">
        <MissionTitle>
          {
            {
              ["V1"]: <>호흡명상</>,
              ["V2"]: <>바디스캔명상</>,
              ["V3"]: <>자비명상</>,
            }[videoTypeCd as string]
          }
        </MissionTitle>
        <div className=" mt-1 text-center">
          {
            {
              ["V1"]: <>이완을 위한 집중명상</>,
              ["V2"]: <>자각 능력 향상을 위한 마음챙김 명상</>,
              ["V3"]: (
                <>
                  자신과 타인을 향한 사랑을 깨우는 <br />
                  자비명상
                </>
              ),
            }[videoTypeCd as string]
          }
        </div>
      </TextBox>
      <div className="border  mt-5 h-[300px] w-full">
        <ReactPlayer
          url={props.videoInfo.url}
          width="100%"
          height="100%"
          controls={true}
        />
      </div>
      <TextArea className="mt-5 text-justify">
        자리에 앉거나 누워봅니다.
        <br /> 몸에 긴장한 부분은 없는지 알아차리고 편안한 자세를 취합니다.
      </TextArea>
      {
        {
          ["V1"]: <V1Video />,
          ["V2"]: <V2Video />,
          ["V3"]: <V3Video />,
        }[videoTypeCd as string]
      }

      <MentalButton onClick={props.onComplete}>완료</MentalButton>
    </>
  );
}
