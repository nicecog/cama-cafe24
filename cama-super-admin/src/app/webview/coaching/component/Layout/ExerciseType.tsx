import TextBox from "./TextBox";

import AnswerList from "./AnswerList";
import useFontSize from "@/hooks/useFontSize";
import TextArea from "./TextArea";

const answerList = [
  "유산소 운동만",
  "근력 운동만",
  "유산소 운동과 근력 운동을 함께",
];

type ExerciseDataType = {
  type: string;
  time: string;
};

export default function ExerciseType(props: {
  data: ExerciseDataType;
  onChange: (info: any) => void;
}) {
  const [sm, base] = useFontSize([-4, -2]);
  const { data, onChange } = props;

  const onClickhandler = (type: string) => {
    onChange((info: ExerciseDataType) => ({
      ...info,
      type,
      time: "10",
    }));
  };

  return (
    <>
      <TextArea className="  mt-2">
        <AnswerList
          list={answerList}
          onChange={onClickhandler}
          value={data.type}
        />
      </TextArea>
      <TextBox className="  mt-2">
        <div
          className=" text-center   text-camaColor1 font-bold"
          style={{ fontSize: base }}
        >
          {data.time}분
        </div>
        <div className="px-5 py-1">
          <input
            type="range"
            name="value1"
            value={data.time}
            min="10"
            onChange={(e) => {
              onChange((s: any) => ({ ...s, time: e.target.value }));
            }}
            step={10}
            max="60"
            className="range blue"
          />
        </div>
        <p className=" text-center font-title " style={{ fontSize: sm }}>
          바를 움직여서 시간을 선택해 보세요.
        </p>
      </TextBox>
    </>
  );
}
