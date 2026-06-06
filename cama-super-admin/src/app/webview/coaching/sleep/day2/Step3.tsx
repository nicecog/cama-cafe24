import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import useAccountName from "@/hooks/useAccountName";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";

const options = Array.from({ length: 24 }).map((_: any, index: number) => ({
  label: index + 1 + "시간",
  value: index + 1,
}));

export default function StartDayStep3(props: any) {
  const { data, onChange, onSave, onPrev } = props;

  const accountName = useAccountName();

  const { alert } = useAlert();

  const onSaveHandler = () => {
    if (data.trim() === "") {
      alert("시간을 선택해 주세요.");
      return;
    }
    onSave();
  };
  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"나의 적절한 수면 시간 정하기"</MissionTitle>
        <TextBox className=" mt-10">
          <p className="tracking-tighter">
            사람마다 적당한 수면 시간이 다를 수 있습니다.
          </p>
          건강상태와 치료 과정을 고려하여
          {` ${accountName}`}님에게 적당한 수면 시간을 정해보세요.
        </TextBox>
        <TextArea className="text-center mt-10 !text-camaColor font-bold ">
          나는 평균 (___) 시간 정도 잠을 자겠다.
        </TextArea>
        <select
          value={data}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="w-full font-bold  border-[#774F2D] border-2 text-camaColor  my-2 rounded-md bg-white py-2.5 px-1 "
        >
          <option value="">선택</option>
          {options.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {/* <Inputs
          value={data}
          onChange={(e: any) => {
            onChange(e.target.value);
          }}
          type={"number"}
          pattern="\d*"
        /> */}
        <MissionChallengeButton onClick={onSaveHandler} className="mt-10" />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
