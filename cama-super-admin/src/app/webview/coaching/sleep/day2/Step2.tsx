import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "../../component/Layout/MainCard";
import TextBox from "../../component/Layout/TextBox";
import MissionTitle from "../../component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import ImageBox from "../../component/ImageBox";
import Day2Pic from "./day2Pic2.png";
export default function StartDayStep2(props: {
  data: string;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { data, onNext, onPrev } = props;

  const answerList = [
    "5시간 미만",
    "5~6시간",
    "6~7시간",
    "7~8시간",
    "9시간 이상",
  ];

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <TextBox>
          <ImageBox imgSrc={Day2Pic} />
          <MissionTitle className="my-5 ">
            {data} 만큼 <br />
            주무신다고 답하셨네요.
          </MissionTitle>
          {data === answerList[0] && (
            <>
              평균 5시간 미만으로 잠을 잔다면 수면 시간이 부족할 가능성이 커요.
            </>
          )}
          {data === answerList[1] && (
            <>
              수면 시간이 충분하지 않을 수 있어요. <br />
              어느 정도 피로 해소가 되긴 하겠지만, 깨어있는 동안 최상의 컨디션이
              유지되기 어려울 수 있습니다.
            </>
          )}
        </TextBox>

        {data === answerList[0] && (
          <>
            <TextArea className="mt-5 !text-camaColor   ">
              잠을 더 잘 자기 위해서는 다음과 같은 방법들을 시도해 보세요.
            </TextArea>
            <TextArea className="mt-5 font-bold !text-camaColor1">
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div className="tracking-tighter">
                  잠자리에 들기 전의 습관이 어떤지 확인하세요.
                </div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div>카페인을 줄여 보세요.</div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div>스마트폰이나 TV 시청을 줄여 보세요.</div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div className="tracking-tighter">
                  편안한 수면 환경을 만들기 위해 노력해 보세요.
                </div>
              </div>
            </TextArea>
            <TextArea className="mt-5">
              잠자기 30분 전부터는 적절한 이완을 통해 몸이 잠에 들 수 있는
              준비를 하는 것이 좋아요.
            </TextArea>
          </>
        )}
        {data === answerList[1] && (
          <>
            <TextArea className="mt-5 !text-camaColor text-justify ">
              잠을 더 잘 자기 위해서는 다음과 같은 방법들을 시도해 보세요.
            </TextArea>
            <TextArea className="mt-5 font-bold !text-camaColor1">
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div className="tracking-tighter">
                  잠자리에 들기 전의 습관이 어떤지 확인하세요.
                </div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div>카페인을 줄여 보세요.</div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div>스마트폰이나 TV 시청을 줄여 보세요.</div>
              </div>
              <div className="flex item-center gap-2">
                <span>✔ </span>
                <div className="tracking-tighter">
                  편안한 수면 환경을 만들기 위해 노력해 보세요.
                </div>
              </div>
            </TextArea>
            <TextArea className="mt-5">
              잠자기 30분 전부터는 적절한 이완을 통해 몸이 잠에 들 수 있는
              준비를 하는 것이 좋아요.
            </TextArea>
          </>
        )}

        {data === answerList[2] && (
          <>
            <TextArea className="mt-10 text-justify">
              수면 시간은 대체로 적절한 것으로 보여요. <br />
              그러나 일반적으로 7시간 이상의 수면이 권장되기 때문에 수면 시간을
              조금 더 늘릴 수 있다면 30분~1시간 정도 더 주무시는 것을
              추천드려요.
            </TextArea>
          </>
        )}
        {data === answerList[3] && (
          <TextArea className="mt-10">
            적절히 수면을 취하고 있네요. <br />
            그럼에도 피로가 회복되지 않거나 낮에 많이 졸린다면 수면의 질이
            저하되어 있을 가능성을 고려해 볼 수 있어요.
          </TextArea>
        )}

        {data === answerList[4] && (
          <TextArea className="mt-10">
            수면 시간이 충분하지만 너무 많은 수면은 건강에 해로울 수 있어요.{" "}
            <br />
            하루 중 대부분의 시간을 누워서 잠자는 데 쓴다면 면역력이 떨어지고
            피로감이 증가할 수 있습니다.
            <br /> 잠자리에서 벗어나 활동하는 시간을 늘려주세요.
          </TextArea>
        )}
      </MainCard>

      <NextButton onPrev={onPrev} onNext={onNext} />
    </>
  );
}
