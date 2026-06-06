import { useMemo } from "react";
import TextArea from "./TextArea";

type ExerciseDataType = {
  type: string;
  time: string;
};

export default function ExerciseResult(props: { data: ExerciseDataType }) {
  const { data } = props;

  const text = useMemo(() => {
    return data?.type === "유산소운동과 근력 운동을 함께"
      ? data?.type
      : data?.type;
  }, [data]);

  return (
    <>
      <TextArea className=" bg-[#F7F8FA]  px-2.5 py-4 rounded-lg mt-5 border-2 border-camaColor1 font-bold">
        <div>
          자 그럼 오늘
          <span className=" mx-1 text-camaColor underline">{text}</span>
          <span className="text-camaColor1 underline  mx-1">
            {data?.time}분
          </span>
          동안 해볼까요?
        </div>
      </TextArea>
      {/* <TextArea className=" bg-[#F7F8FA]  px-2.5 py-4 rounded-lg mt-5 border-2 border-camaColor1 font-bold">
        {data?.type === "유산소운동만" && (
          <div>
            자 그럼 오늘 <span className="underline">{data?.type}</span>을
            <span className="text-camaColor1 underline">{data?.time}분</span>
            동안 <br />
            해볼까요?
          </div>
        )}
        {data?.type === "근력 운동만" && (
          <div>
            자 그럼 오늘 <span className="underline">{data?.type}</span>을
            <span className="text-camaColor1 underline">{data?.time}분 </span>
            동안 <br />
            해볼까요?
          </div>
        )}
        {data?.type === "유산소운동과 근력 운동을 함께" && (
          <div>
            자 그럼 오늘 <br />
            <span className="underline">{data?.type}</span>
            <span className="text-camaColor1 underline">{data?.time}분</span>
            <br />
            동안 해볼까요?
          </div>
        )}
      </TextArea> */}
    </>
  );
}
