import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";

import MissionTitle from "../../../component/Layout/MissionTitle";
import { VideoInfo } from "../CardTypes";
import TextArea from "../../../component/Layout/TextArea";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";
import Mental from "@/assets/images/character/mental.png";
import V1Video from "./component/V1Video";
import V2Video from "./component/V2Video";
import V3Video from "./component/V3Video";

// 나 말하기 기법
export default function Step4(props: { videoInfo: VideoInfo }) {
  //  V1: 호흡 ,   V2: 바디스캔,  V3 : 자비
  const { videoTypeCd } = props.videoInfo;

  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const onNextHandler = () => {
    Swal.fire({
      html: `
        다른 명상도 해보실래요 ? 
      `,
      showCancelButton: true,
      confirmButtonText: "예",
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      confirmButtonColor: "#FE8825",
      cancelButtonText: "아니오, 그만할래요.",
      customClass: {
        confirmButton: "focus:outline-none focus:ring-0",
        cancelButton: "focus:outline-none focus:ring-0",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onPrev();
      } else {
        onNext();
      }
    });
  };

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
            }[videoTypeCd]
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
            }[videoTypeCd]
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
        <br />
        <br /> 몸에 긴장한 부분은 없는지 알아차리고 편안한 자세를 취합니다.
      </TextArea>
      {
        {
          ["V1"]: <V1Video />,
          ["V2"]: <V2Video />,
          ["V3"]: <V3Video />,
        }[videoTypeCd]
      }

      <Footer onNext={onNextHandler} onPrev={onPrev} />
    </>
  );
}
