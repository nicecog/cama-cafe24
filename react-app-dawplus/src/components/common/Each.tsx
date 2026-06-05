import React from "react";

type EachProps<T> = {
  of?: T[] | null; // undefined: 로딩 중, null: 없음, []: 빈 배열
  render: (item: T, index: number) => React.ReactNode;
  keyItem?: keyof T; // object일 경우 key로 사용할 필드
  noData?: React.ReactNode; // 실제 데이터 없을 때만 보여줄 컴포넌트
};

export function Each<T extends string | number | object>({
  of,
  render,
  keyItem,
  noData = null,
}: EachProps<T>) {
  // undefined이면 아직 로딩 중, 아무것도 렌더링하지 않음
  if (of === undefined) return null;

  // 빈 배열이면 noData 렌더링
  if (Array.isArray(of) && of.length === 0) return <>{noData}</>;

  // 배열이면 map
  if (Array.isArray(of)) {
    return of.map((item, index) => (
      <React.Fragment key={getKey(item, index, keyItem)}>
        {render(item, index)}
      </React.Fragment>
    ));
  }

  // array가 아님 (null 등) → 안전하게 null 반환
  return null;
}

// key 생성 유틸
function getKey<T extends string | number | object>(
  item: T,
  index: number,
  keyItem?: keyof T,
): string {
  if (keyItem && typeof item === "object" && item && keyItem in item) {
    return String((item as any)[keyItem]);
  }

  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${index}-${Date.now()}`;
}
