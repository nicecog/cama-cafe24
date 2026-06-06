import { Transition } from "@headlessui/react";
import TextBox from "./Layout/TextBox";
import AnswerList from "./Layout/AnswerList";

const answerList = [
  "유산소운동만",
  "근력 운동만",
  "유산소운동과 근력 운동을 함께",
];

type ExerciseDataType = {
  type: string;
  time: string;
};

export default function ExerciseType(props: {
  data: ExerciseDataType;
  onChange: (info: any) => void;
}) {
  const { data, onChange } = props;

  const onClickhandler = (type: string) => () => {
    onChange((info: ExerciseDataType) => ({
      ...info,
      type,
      time: "10",
    }));
  };
  return (
    <>
      <AnswerList list={answerList} onChange={onClickhandler} data={data} />
      <Transition
        show={!!data.type}
        enter="ease-in-out duration-500"
        enterFrom="opacity-0 scale-70"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <TextBox className="bg-green-50 mt-2">
          <div className="my-2 text-center text-lg text-green-600 font-bold">
            {data.time}분
          </div>
          <div className="px-5 py-1 flex">
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
              className="block w-full h-2 bg-white rounded-lg cursor-pointer 
                      focus:border-blue-500  
                      focus:outline-none focus:ring"
            />
          </div>
        </TextBox>
      </Transition>
    </>
  );
}
