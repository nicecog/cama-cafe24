import { AlertTriangle, Minus, Plus, Repeat2, Trash2 } from "lucide-react";
import {
  LOW_CONFIDENCE_THRESHOLD,
  MEAL_LIMITS,
  type MealLogItemDto,
  PORTION_PRESETS,
} from "@/apis/types/nutrition.types";
import type { MealDraftItem } from "@/lib/nutrition/mealDraft";
import { cn } from "@/lib/utils";

type MealItemCardProps = {
  item: MealDraftItem;
  /** 서버 estimate 로 계산된 정본 값. 없으면 온디바이스 미리보기를 쓴다 */
  serverItem?: MealLogItemDto;
  onChangePortion: (uid: string, portionFactor: number) => void;
  onChangeQuantity: (uid: string, quantity: number) => void;
  /** 모델 후보로 바로 교체 */
  onSelectCandidate: (uid: string, classKey: string, nameKo?: string) => void;
  /** 후보에 없는 음식을 검색해서 교체 */
  onReplace: (uid: string) => void;
  onRemove: (uid: string) => void;
};

function formatKcal(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${Math.round(value)} kcal`;
}

export function MealItemCard({
  item,
  serverItem,
  onChangePortion,
  onChangeQuantity,
  onSelectCandidate,
  onReplace,
  onRemove,
}: MealItemCardProps) {
  const needsCheck =
    !item.isUserCorrected && item.confidence < LOW_CONFIDENCE_THRESHOLD;

  const previewKcal =
    item.kcalPreview === undefined
      ? undefined
      : item.kcalPreview * item.portionFactor * item.quantity;
  const kcal = serverItem?.kcal ?? previewKcal;

  const name = serverItem?.nameKo ?? item.nameKo ?? item.classKey;
  const grams = serverItem?.gramsG;

  const otherCandidates = (item.candidates ?? [])
    .filter((candidate) => candidate.classKey !== item.classKey)
    .slice(0, 3);

  return (
    <li
      className={cn(
        "rounded-xl border bg-white p-3",
        needsCheck ? "border-amber-300 bg-amber-50/40" : "border-gray-200",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold text-gray-900">
              {name}
            </span>
            {item.isUserCorrected ? (
              <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600">
                직접 지정
              </span>
            ) : (
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium",
                  needsCheck
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {Math.round(item.confidence * 100)}%
              </span>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <span>{formatKcal(kcal)}</span>
            {grams ? <span>{Math.round(grams)}g</span> : null}
            {serverItem?.estimated ? (
              <span className="text-gray-400">추정 영양값</span>
            ) : null}
          </div>

          {needsCheck ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-700">
              <AlertTriangle size={13} />
              인식 정확도가 낮습니다. 음식이 맞는지 확인해 주세요.
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onReplace(item.uid)}
            aria-label={`${name} 음식 변경`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 active:bg-gray-100"
          >
            <Repeat2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.uid)}
            aria-label={`${name} 삭제`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 active:bg-gray-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {PORTION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={item.portionFactor === preset}
              onClick={() => onChangePortion(item.uid, preset)}
              className={cn(
                "h-8 min-w-[46px] rounded-md border px-2 text-xs font-medium",
                item.portionFactor === preset
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-gray-500",
              )}
            >
              {preset}인분
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="수량 감소"
            disabled={item.quantity <= MEAL_LIMITS.minQuantity}
            onClick={() => onChangeQuantity(item.uid, item.quantity - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 disabled:opacity-40"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-medium text-gray-800">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="수량 증가"
            disabled={item.quantity >= MEAL_LIMITS.maxQuantity}
            onClick={() => onChangeQuantity(item.uid, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 disabled:opacity-40"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {otherCandidates.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2.5">
          <span className="self-center text-[11px] text-gray-400">
            다른 후보
          </span>
          {otherCandidates.map((candidate) => (
            <button
              key={candidate.classKey}
              type="button"
              onClick={() =>
                onSelectCandidate(
                  item.uid,
                  candidate.classKey,
                  candidate.nameKo,
                )
              }
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 active:bg-gray-200"
            >
              {candidate.nameKo ?? candidate.classKey}{" "}
              {Math.round(candidate.confidence * 100)}%
            </button>
          ))}
        </div>
      ) : null}
    </li>
  );
}
