import React from "react";
import Answer from "./Answer";

export default function AnswerList(props: any) {
  // props
  const { list, value, onChange } = props;

  const onChangeHandler = (value: string) => () => {
    onChange(value);
  };

  return (
    <>
      <div className="">
        {list.map((i: any, idx: number) => (
          <Answer
            key={idx}
            onChange={onChangeHandler(i)}
            checked={value === i}
            className="mt-1"
          >
            {i
              .split(". ")
              .map((sentence: string, index: number, array: string[]) => (
                <React.Fragment key={index}>
                  {sentence}
                  {index !== array.length - 1 ? ". " : null}
                  <br />
                </React.Fragment>
              ))}
          </Answer>
        ))}
        {props.children}
      </div>
    </>
  );
}
