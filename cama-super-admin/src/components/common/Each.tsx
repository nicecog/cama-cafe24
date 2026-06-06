import { ReactElement } from "react";

type EachProps<T> = {
  of: T[] | undefined | null;
  render: (item: T, index: number) => ReactElement;
  keyItem?: (item: T, index: number) => string | number;
  noData?: ReactElement;
};

export default function Each<T>({
  of,
  render,
  keyItem,
  noData,
}: EachProps<T>) {
  // undefined인 경우 로딩 상태로 간주
  if (of === undefined) {
    return null;
  }

  // null이거나 빈 배열인 경우 noData 표시
  if (of === null || of.length === 0) {
    return noData || null;
  }

  // 데이터가 있는 경우 렌더링
  return (
    <>
      {of.map((item, index) => {
        const key = keyItem ? keyItem(item, index) : index;
        return <div key={key}>{render(item, index)}</div>;
      })}
    </>
  );
}
