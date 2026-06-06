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
            className={`text-md flex my-3 border-2 px-2.5 py-1 rounded-xl bg-white accent-camaColor1 ${
              data.includes(i.value) ? "border-camaColor1" : ""
            }`}
          >
            <input
              type="checkbox"
              name={`check_${idx}`}
              checked={data.includes(i.value)}
              id={`id_${idx}`}
              className={`w-3.5 min-w-3.5 mr-1 `}
              onChange={() => onChange(i.value)}
            />
            <label
              style={{ fontSize: sm }}
              htmlFor={`id_${idx}`}
              className={`ml-2 w-full ${
                data.includes(i.value) ? "font-semibold text-camaColor1" : ""
              }`}
            >
              {i.label}
            </label>
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
