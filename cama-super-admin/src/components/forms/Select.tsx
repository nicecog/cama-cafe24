import React, { useMemo } from "react";
import { Prettify } from "@/utils/Prettify";

type SelectProps = {
  options: { label: string; value: string | number }[];
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

type SelectOpts = {
  className?: string;
  label?: string;
  defaultOptions?: boolean | { label: string; value: string };
};

export type SelectType = Prettify<SelectProps & SelectOpts>;

const Select = (props: SelectType) => {
  const { label, options, value, name, onChange, defaultOptions, className } =
    props;

  const defaultOpt = useMemo(() => {
    if (!defaultOptions) return null;

    if (typeof defaultOptions === "boolean") {
      return <option value={""}>선택</option>;
    }
    if (typeof defaultOptions === "object") {
      return (
        <option value={defaultOptions.value}>{defaultOptions.label}</option>
      );
    }
  }, [defaultOptions]);

  return (
    <>
      <div className="flex">
        {label && (
          <label
            htmlFor={name}
            className="inline-block text-sm font-bold  mt-1 ml-[20px] mr-[10px] text-gray-900 "
          >
            {label}
          </label>
        )}
        <select
          id={name}
          name={name}
          value={value !== undefined ? value : ""}
          onChange={onChange}
          className={`bg-white border border-gray-300 text-gray-900 text-xs rounded-sm  focus:ring-blue-500 focus:border-blue-500 block p-1 mr-[5px] ${className}`}
        >
          {defaultOpt}
          {options.map((i: any, idx: number) => (
            <option value={i.value} key={idx}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
export default Select;
