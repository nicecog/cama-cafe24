import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { MealLogDto } from "@/apis/types/nutrition.types";
import type { MealDraft } from "@/lib/nutrition/mealDraft";

/**
 * capture → review → result 사이에 공유되는 상태.
 *
 * sessionStorage 를 쓰는 이유: WebView 가 백그라운드에서 회수됐다가 복귀하면 SPA 가
 * 다시 로드될 수 있는데, 그때 사용자가 보정 중이던 초안이 사라지면 촬영을 처음부터
 * 다시 해야 한다. 탭을 닫으면 함께 사라지는 것이 맞으므로 localStorage 는 쓰지 않는다.
 * (전송 실패를 대비한 영속 저장은 `lib/nutrition/mealQueue` 가 담당한다)
 */
function sessionJsonStorage<T>() {
  return createJSONStorage<T>(() => sessionStorage);
}

export const mealDraftAtom = atomWithStorage<MealDraft | null>(
  "cama.meal.draft",
  null,
  sessionJsonStorage<MealDraft | null>(),
);

/** result 화면이 보여줄 서버 정본 저장 결과. 오프라인 큐로 넘어간 경우 null 이다 */
export const savedMealAtom = atomWithStorage<MealLogDto | null>(
  "cama.meal.saved",
  null,
  sessionJsonStorage<MealLogDto | null>(),
);

/** 저장 요청이 오프라인 큐로 들어갔는지 */
export const mealQueuedAtom = atomWithStorage<boolean>(
  "cama.meal.queued",
  false,
  sessionJsonStorage<boolean>(),
);
