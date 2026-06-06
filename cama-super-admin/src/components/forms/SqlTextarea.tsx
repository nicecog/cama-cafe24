import { ChangeEvent, useMemo, useState } from "react";

export type SqlTextareaType = {
  name: string;
  value: string;
  onChange: (e: any) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
};

export default function SqlTextarea(props: SqlTextareaType) {
  const {
    className,
    value = "",
    name,
    onChange,
    rows = 4,
    placeholder,
  } = props;

  const [viewer, setViewer] = useState(true);

  const _value = useMemo(() => {
    return value;
    // if (!viewer) {
    //   return value;
    // }

    // const checkedValue = value ? value : " ";

    // try {
    //   return format(checkedValue, {
    //     language: "mysql",
    //     tabWidth: 2,
    //     keywordCase: "upper",
    //     linesBetweenQueries: 2,
    //   });
    // } catch (e) {
    //   return checkedValue;
    // }
  }, [value]);

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (viewer) {
      setViewer((_) => false);
    }
    onChange(e);
  };

  return (
    <>
      <textarea
        name={name}
        value={_value}
        rows={rows}
        className={`block p-2 w-full text-sm text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 ${className}`}
        onChange={onChangeHandler}
        placeholder={placeholder}
      />
    </>
  );
}
