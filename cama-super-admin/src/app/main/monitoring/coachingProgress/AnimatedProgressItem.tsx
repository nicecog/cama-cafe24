import { useEffect, useState } from "react";

const AnimatedProgressItem = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {
  const COLORS = [
    "bg-[#39906a]", // 시그니처: 청록색
    "bg-[#7ccab0]", // 민트 (채도 ↑)
    "bg-[#89c2f0]", // 하늘색 (채도 ↑)
    "bg-[#b09be0]", // 라벤더 (선명하게)
    "bg-[#f29cb6]", // 인디핑크 (더 쨍하게)
    "bg-[#ffe07d]", // 옐로우 (레몬 느낌)
    "bg-[#fbbd74]", // 오렌지 (살짝 감귤 느낌)
    "bg-[#bce29e]", // 연그린 (채도 살짝 ↑)
  ];

  const [percent, setPercent] = useState(0);

  // 초기 값 처리 및 형 변환
  const raw = item.value?.toString().trim();
  const numericValue = parseFloat(raw);
  const value =
    !isNaN(numericValue) && isFinite(numericValue) ? numericValue : 0;

  const max = item.max ?? 100;
  const actualPercent = Math.min((value / max) * 100, 100);

  // 애니메이션 트리거
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPercent(actualPercent);
    }, 100); // mount 후 약간 delay
    return () => clearTimeout(timeout);
  }, [actualPercent]);

  const color = COLORS[index % COLORS.length];
  const isEmpty = value === 0;

  return (
    <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-1">
          {item.icon && <span className="text-base">{item.icon}</span>}
          {item.label}
        </div>
        <div className="text-gray-800 font-semibold">
          {isEmpty ? "0" : value}
          {item.max ? ` ` : `%`}
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            isEmpty ? "bg-gray-300" : color
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default AnimatedProgressItem;
