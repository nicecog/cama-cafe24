import { ChangeEvent } from "react";
import TextBox from "../../component/Layout/TextBox";
import useFontSize from "@/hooks/useFontSize";
import { useAtom } from "jotai";
import { QuestionType } from "./session1Atom";

type LikerScaleType = {
  index: number;
  itemAtom: any;
};

const descriptions = [
  { label: "전혀\n그렇지\n않다", key: 0 },
  { label: "그렇지\n않다", key: 1 },
  { label: "그렇다", key: 2 },
  { label: "매우\n그렇다", key: 3 },
];

export default function LikertScale(props: LikerScaleType) {
  const { index, itemAtom } = props;

  const [fontSize] = useFontSize([1]);
  // Question Atom
  const [question, setQuestion] = useAtom<QuestionType>(itemAtom);

  // OnChange
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion({ ...question, value: Number(e.target.value) });
  };

  return (
    <>
      <h1
        className="-mb-1 mx-2 text-camaColor1 font-oneMobile mt-8"
        style={{ fontSize }}
      >
        {`문항 ${index + 1}`}
      </h1>
      <TextBox className="">
        <div className="text-camaColor font-bold tracking-tighter ">
          {question.label}
        </div>
        <div className="w-full">
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={question.value}
            className="w-full"
            onChange={onChangeHandler}
          />
          <div className="flex justify-between mt-1 text-center text-f2 leading-4">
            {descriptions.map((desc) => (
              <div
                key={desc.key}
                className={`${
                  question.value === desc.key
                    ? "font-bold text-camaColor1"
                    : "text-gray-600"
                }`}
              >
                {desc.label.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </TextBox>
    </>
  );
}
