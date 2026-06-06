import useFontSize from "@/hooks/useFontSize";
import React from "react";

export default function CheckAnswers(props: any) {
  const { list, data, onChange } = props;

  const [sm] = useFontSize([-2]);

  return (
    <>
      {list.map((i: any, idx: number) => (
        <React.Fragment key={idx}>
          <div
            className={`text-md flex items-center my-3 border-2 px-2.5 py-1 rounded-xl bg-white accent-camaColor1 ${
              data.includes(i) ? "border-camaColor1" : ""
            }`}
          >
            <input
              type="checkbox"
              name={`check_${idx}`}
              checked={data.includes(i)}
              id={`id_${idx}`}
              className={`w-3.5 min-w-3.5 mr-1 `}
              onChange={() => onChange(i)}
            />
            <label
              style={{ fontSize: sm }}
              htmlFor={`id_${idx}`}
              className={`ml-2 w-full ${
                data.includes(i) ? "font-semibold text-camaColor1" : ""
              }`}
            >
              {i}
            </label>
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
