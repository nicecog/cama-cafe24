import TextBox from "./Layout/TextBox";

type ExerciseDataType = {
  type: string;
  time: string;
};

export default function ExerciseResult(props: { data: ExerciseDataType }) {
  const { data } = props;
  return (
    <>
      <TextBox className="bg-yellow-50  mt-2">
        <p>자 그럼</p>
        <p>
          오늘
          <span className="font-bold text-lg text-blue-600 underline ml-2 tracking-tight">
            {data?.type}
          </span>
          {data?.type?.endsWith("만") ? "을" : "를"}
          <span className="font-bold text-lg text-green-600 underline ml-2 tracking-tight">
            {data?.time}분
          </span>
          동안 해볼까요?
        </p>
      </TextBox>
    </>
  );
}
