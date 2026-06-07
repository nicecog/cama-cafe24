# Exercise Coaching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `asis` 운동코칭의 평가, 결과 계산, 추천 운동 목록, 영상 재생, 완료 저장 흐름을 `tobe`의 `/coaching/exercise` 아래에 동일 payload 계약으로 재구성한다.

**Architecture:** 운동코칭은 기존 day-based 코칭과 분리된 독립 라우트 군으로 구현한다. 라우트는 화면 조합과 이동만 담당하고, 판정식/추천목록 조합/payload 생성은 순수 함수와 작은 hook으로 분리한다. API 계약은 `asis`와 동일하게 유지하고, 한국어 문구는 exercise 전용 namespace json으로 분리한다.

**Tech Stack:** React 19, TanStack Router, TanStack Query, Jotai, react-i18next, TypeScript, Vite, Vitest, Testing Library

---

## File Structure

- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseCodeMap.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/routeGuards.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-state/exerciseAtoms.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-hooks/useExerciseEvaluationFlow.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseShell.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseCancerSelector.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseQuestionStep.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseResultSummary.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseWorkoutList.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseVideoPanel.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/eval.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/result.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/content.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/video.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/exerciseApiSurface.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/routeGuards.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.test.tsx`
- Create: `src/test/setup.ts`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/index.tsx`
- Modify: `src/apis/api/webview/coaching.ts`
- Modify: `src/apis/types/webview.types.ts`
- Modify: `src/apis/types/index.ts`
- Modify: `src/hooks/queries/webview/useCoachingQueries.ts`
- Modify: `src/hooks/mutations/webview/useCoachingMutations.ts`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/locales/ko/coaching/exercise/index.json`
- Create: `src/locales/ko/coaching/exercise/eval.json`
- Create: `src/locales/ko/coaching/exercise/result.json`
- Create: `src/locales/ko/coaching/exercise/content.json`
- Create: `src/locales/ko/coaching/exercise/video.json`

### Task 1: Add Exercise Test Harness And API Surface

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/exerciseApiSurface.test.ts`
- Modify: `src/apis/types/webview.types.ts`
- Modify: `src/apis/types/index.ts`
- Modify: `src/apis/api/webview/coaching.ts`
- Modify: `src/hooks/queries/webview/useCoachingQueries.ts`
- Modify: `src/hooks/mutations/webview/useCoachingMutations.ts`

- [ ] **Step 1: Write the failing API and test harness contract test**

```ts
import { describe, expect, it } from "vitest";
import {
  fetchExerciseContentList,
  saveExerciseSurveyResult,
  saveExerciseUserClass,
} from "@/apis/api/webview/coaching";

describe("exercise coaching api surface", () => {
  it("exports exercise-specific fetch and save functions", () => {
    expect(fetchExerciseContentList).toBeTypeOf("function");
    expect(saveExerciseUserClass).toBeTypeOf("function");
    expect(saveExerciseSurveyResult).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/routes/_auth/_coaching/coaching/exercise/-lib/exerciseApiSurface.test.ts`

Expected: FAIL with module resolution or missing `vitest`/missing export errors.

- [ ] **Step 3: Add minimal test infrastructure and API/type scaffolding**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "vitest": "^2.1.9"
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

```ts
// src/apis/types/webview.types.ts
export interface WebviewExerciseContentItem {
  difficultyCd: string;
  engName: string;
  exerciseTypeCd: string;
  indexNum: number;
  korName: string;
  loginId: string | null;
  url: string;
}

export interface ExerciseSurveyResultItem {
  seq: number;
  question: string;
  answer: string;
}

export interface SaveExerciseUserClassParams {
  loginId: string;
  cancerTypeCd: string;
  exerciseProgramCd: string;
  aerobic: string;
  therapyCd: string;
  surveyResult: ExerciseSurveyResultItem[];
}
```

```ts
// src/apis/api/webview/coaching.ts
export const fetchExerciseContentList = async (loginId: string) =>
  api
    .post("api/coaching/service/getExerciseContentList", {
      json: { loginId },
    })
    .json();

export const saveExerciseUserClass = async (params: SaveExerciseUserClassParams) =>
  api
    .put("api/coaching/service/saveExerciseUserClass", {
      json: params,
    })
    .json();

export const saveExerciseSurveyResult = async (
  params: SaveExerciseUserClassParams,
) =>
  api
    .put("api/coaching/service/saveExerciseSurveyResult", {
      json: {
        ...params,
        difficultyCd: params.exerciseProgramCd,
      },
    })
    .json();
```

```ts
// src/hooks/queries/webview/useCoachingQueries.ts
export const useExerciseContentList = (loginId: string = "") =>
  useQuery({
    queryKey: ["webview", "coaching", "exerciseContentList", loginId],
    queryFn: () => fetchExerciseContentList(loginId),
    enabled: !!loginId,
    select: (data) => data.response ?? [],
  });
```

```ts
// src/hooks/mutations/webview/useCoachingMutations.ts
export const useSaveExerciseUserClass = () =>
  useMutation({
    mutationFn: (params: SaveExerciseUserClassParams) =>
      saveExerciseUserClass(params),
  });

export const useSaveExerciseSurveyResult = () =>
  useMutation({
    mutationFn: (params: SaveExerciseUserClassParams) =>
      saveExerciseSurveyResult(params),
  });
```

- [ ] **Step 4: Run tests and type-check to verify the new surface passes**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/exerciseApiSurface.test.ts`

Expected: PASS for the API surface test.

Run: `npm run type-check`

Expected: PASS with no type errors from the new exports.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/test/setup.ts src/apis/types/webview.types.ts src/apis/types/index.ts src/apis/api/webview/coaching.ts src/hooks/queries/webview/useCoachingQueries.ts src/hooks/mutations/webview/useCoachingMutations.ts
git commit -m "test: add exercise coaching api harness"
```

### Task 2: Lock Down Evaluation Logic And Payload Builders

**Files:**
- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseCodeMap.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

- [ ] **Step 1: Write failing pure-function tests**

```ts
import { describe, expect, it } from "vitest";
import { evaluateExerciseProgram } from "./evaluateExerciseProgram";

describe("evaluateExerciseProgram", () => {
  it("returns A3 for colon cancer when high-function answers are all Y", () => {
    const answers = ["Y", "N", "Y", "N", "Y", "N", "Y", "Y", "N", "Y", "Y", "N", "N", "N", "N", "N"];
    expect(evaluateExerciseProgram("대장암", answers)).toEqual({
      program: "A3",
      aerobic: "N",
      therapy: "",
    });
  });

  it("returns T2 for lung cancer when sputum item is Y", () => {
    const answers = ["Y", "N", "Y", "N", "Y", "N", "Y", "Y", "N", "Y", "Y", "N", "N", "N", "Y", "N"];
    expect(evaluateExerciseProgram("폐암", answers).therapy).toBe("T2");
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import { buildExerciseRecommendationRefs } from "./buildExerciseRecommendations";

const sampleContentList = [
  {
    difficultyCd: "A2",
    engName: "lung",
    exerciseTypeCd: "E2",
    indexNum: 1,
    korName: "폐암 운동",
    loginId: null,
    url: "https://example.com/1",
  },
  {
    difficultyCd: "A2",
    engName: "core",
    exerciseTypeCd: "E5",
    indexNum: 1,
    korName: "코어 운동",
    loginId: null,
    url: "https://example.com/2",
  },
  {
    difficultyCd: "A2",
    engName: "aerobic",
    exerciseTypeCd: "E6",
    indexNum: 1,
    korName: "유산소 운동",
    loginId: null,
    url: "https://example.com/3",
  },
  {
    difficultyCd: "A1",
    engName: "breathing",
    exerciseTypeCd: "E7",
    indexNum: 1,
    korName: "호흡 운동",
    loginId: null,
    url: "https://example.com/4",
  },
];

describe("buildExerciseRecommendationRefs", () => {
  it("includes cancer, core, aerobic, and therapy items in asis order", () => {
    expect(
      buildExerciseRecommendationRefs({
        contentList: sampleContentList,
        cancerTypeCd: "E2",
        exerciseProgramCd: "A2",
        aerobic: "Y",
        therapyCd: "T2",
      }),
    ).toEqual(["1E2A2", "1E5A2", "1E6A2", "1E7A1"]);
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import { buildExerciseSeedPayload } from "./buildExercisePayloads";

describe("buildExerciseSeedPayload", () => {
  it("creates the same seed payload shape as asis", () => {
    expect(
      buildExerciseSeedPayload({
        accountName: "홍길동",
        loginId: "user01",
        refs: ["1E2A2"],
      }),
    ).toEqual([
      {
        accountName: "홍길동",
        answerChoice: "N",
        answerChoiceSeq: 0,
        categoryCd: "E",
        loginId: "user01",
        progressTypeCd: "A1",
        refVal1: "1E2A2",
        stepDayCd: "00",
      },
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: FAIL because the three helper modules do not exist yet.

- [ ] **Step 3: Implement minimal constants and pure functions**

```ts
// evaluateExerciseProgram.ts
export function evaluateExerciseProgram(
  cancerType: string,
  answers: string[],
) {
  let program = "A2";
  let aerobic = "N";
  let therapy = "";

  const highProgramAnswers = [
    answers[0],
    answers[2],
    answers[4],
    answers[6],
    answers[7],
    answers[9],
    answers[10],
  ];

  if (highProgramAnswers.every((answer) => answer === "Y")) {
    if (cancerType === "갑상선암" && [answers[14], answers[15]].every((answer) => answer === "Y")) {
      program = "A3";
    } else if (cancerType === "유방암" && answers[14] === "Y") {
      program = "A3";
    } else if (cancerType === "대장암" || cancerType === "폐암") {
      program = "A3";
    }
  }

  if (answers[11] === "Y") program = "A1";
  if ((cancerType === "갑상선암" || cancerType === "폐암") && answers[13] === "Y") {
    program = "A1";
  }

  if (answers[12] === "Y") aerobic = "Y";
  if (cancerType === "대장암" && (answers[14] === "Y" || answers[15] === "Y")) aerobic = "Y";
  if (cancerType === "폐암" && answers[13] === "Y") aerobic = "Y";

  if (cancerType === "갑상선암" && answers[16] === "Y") therapy = "T1";
  if (cancerType === "폐암" && answers[14] === "Y") therapy = "T2";
  if (cancerType === "유방암" && answers[15] === "Y") therapy = "T3";

  return { program, aerobic, therapy };
}
```

```ts
// buildExercisePayloads.ts
export function buildExerciseUserClassPayload(
  params: SaveExerciseUserClassParams,
) {
  return params;
}

export function buildExerciseSurveyResult({
  questions,
  answers,
}: {
  questions: string[];
  answers: string[];
}) {
  return questions.map((question, seq) => ({
    seq,
    question,
    answer: answers[seq] ?? "",
  }));
}

export function buildExerciseSeedPayload({
  accountName,
  loginId,
  refs,
}: {
  accountName: string;
  loginId: string;
  refs: string[];
}) {
  return refs.map((refVal1) => ({
    accountName,
    answerChoice: "N",
    answerChoiceSeq: 0,
    categoryCd: "E",
    loginId,
    progressTypeCd: "A1",
    refVal1,
    stepDayCd: "00",
  }));
}

export function buildExerciseCompletionPayload({
  answerList,
  selectedRef,
}: {
  answerList: WebviewUserAnswerInfo[];
  selectedRef: string;
}) {
  return answerList.map((item) => ({
    ...item,
    answerChoice: item.refVal1 === selectedRef ? "Y" : item.answerChoice,
  }));
}
```

```ts
// exerciseCodeMap.ts
export const CANCER_TYPE_CODE = {
  갑상선암: "E4",
  대장암: "E1",
  폐암: "E2",
  유방암: "E3",
} as const;

export function getCancerTypeCode(cancer: keyof typeof CANCER_TYPE_CODE) {
  return CANCER_TYPE_CODE[cancer];
}
```

- [ ] **Step 4: Run the helper tests and confirm green**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_auth/_coaching/coaching/exercise/-constants src/routes/_auth/_coaching/coaching/exercise/-lib
git commit -m "feat: add exercise coaching domain helpers"
```

### Task 3: Add Exercise State, Translation Content, And Entry Screen

**Files:**
- Create: `src/routes/_auth/_coaching/coaching/exercise/-state/exerciseAtoms.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseShell.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.test.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/index.tsx`
- Create: `src/locales/ko/coaching/exercise/index.json`
- Create: `src/locales/ko/coaching/exercise/eval.json`
- Create: `src/locales/ko/coaching/exercise/result.json`
- Create: `src/locales/ko/coaching/exercise/content.json`
- Create: `src/locales/ko/coaching/exercise/video.json`

- [ ] **Step 1: Write the failing entry-screen render test**

```tsx
import { render, screen } from "@testing-library/react";
import { ExerciseIntroCard } from "./ExerciseIntroCard";

describe("ExerciseIntroCard", () => {
  it("renders the asis evaluation intro copy", () => {
    render(<ExerciseIntroCard onStart={() => {}} />);
    expect(screen.getByText("운동평가")).toBeInTheDocument();
    expect(
      screen.getByText(/암 환자의 일상생활 신체 활동 수행 능력을 평가/i),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.test.tsx`

Expected: FAIL because the component and translation namespace do not exist.

- [ ] **Step 3: Add the minimal entry UI, translations, and state atoms**

```ts
// exerciseAtoms.ts
import { atom } from "jotai";
import type { WebviewExerciseContentItem } from "@/apis/types";

export const selectedCancerAtom = atom("");
export const exerciseAnswersAtom = atom<string[]>([]);
export const selectedWorkoutAtom = atom<WebviewExerciseContentItem | null>(null);
export const resetExerciseFlowAtom = atom(null, (_, set) => {
  set(selectedCancerAtom, "");
  set(exerciseAnswersAtom, []);
  set(selectedWorkoutAtom, null);
});
```

```tsx
// ExerciseIntroCard.tsx
export function ExerciseIntroCard({ onStart }: { onStart: () => void }) {
  const { pt } = usePageTranslation("coaching/exercise/index");

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="font-jalnan text-2xl text-slate-900">{pt("title")}</h2>
      <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">
        {pt("description")}
      </p>
      <button type="button" onClick={onStart} className="mt-6 h-12 w-full rounded-xl bg-primary font-bold text-white">
        {pt("start")}
      </button>
    </section>
  );
}
```

```tsx
// index.tsx
const loginId = accountMe.data?.loginId ?? "";
const navigate = useNavigate();
const { data: classInfo, isLoading } = useExerciseUserClassInfo(loginId);

useEffect(() => {
  if (classInfo) {
    navigate({ to: "/coaching/exercise/content", replace: true });
  }
}, [classInfo, navigate]);
```

- [ ] **Step 4: Run component test and type-check**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.test.tsx`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_auth/_coaching/coaching/exercise/index.tsx src/routes/_auth/_coaching/coaching/exercise/-state src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseShell.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntroCard.test.tsx src/locales/ko/coaching/exercise
git commit -m "feat: add exercise coaching entry flow"
```

### Task 4: Build Evaluation Route And Result Save Flow

**Files:**
- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.test.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-hooks/useExerciseEvaluationFlow.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseCancerSelector.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseQuestionStep.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseResultSummary.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/eval.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/result.tsx`

- [ ] **Step 1: Write the failing evaluation flow tests**

```ts
import { describe, expect, it } from "vitest";
import { getQuestionSet } from "../-constants/exerciseQuestions";

describe("getQuestionSet", () => {
  it("returns 17 questions for thyroid cancer", () => {
    expect(getQuestionSet("갑상선암")).toHaveLength(17);
  });

  it("returns 16 questions for lung cancer", () => {
    expect(getQuestionSet("폐암")).toHaveLength(16);
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import { buildExerciseUserClassPayload } from "../-lib/buildExercisePayloads";

describe("buildExerciseUserClassPayload", () => {
  it("preserves the asis saveExerciseUserClass shape", () => {
    expect(
      buildExerciseUserClassPayload({
        loginId: "user01",
        cancerTypeCd: "E2",
        exerciseProgramCd: "A2",
        aerobic: "Y",
        therapyCd: "T2",
        surveyResult: [{ seq: 0, question: "Q", answer: "Y" }],
      }),
    ).toEqual({
      loginId: "user01",
      cancerTypeCd: "E2",
      exerciseProgramCd: "A2",
      aerobic: "Y",
      therapyCd: "T2",
      surveyResult: [{ seq: 0, question: "Q", answer: "Y" }],
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: FAIL due to missing question selector or payload builder export.

- [ ] **Step 3: Implement eval/result routes with minimal orchestration**

```tsx
// eval.tsx
const cancer = useAtomValue(selectedCancerAtom);
const [answers, setAnswers] = useAtom(exerciseAnswersAtom);
const questions = getQuestionSet(cancer);
const currentIndex = answers.findIndex((answer) => answer === "");

const handleAnswer = (value: "Y" | "N") => {
  startTransition(() => {
    setAnswers((prev) => prev.map((item, index) => (index === currentIndex ? value : item)));
  });
};
```

```tsx
// result.tsx
const { program, aerobic, therapy } = evaluateExerciseProgram(cancer, answers);
const surveyResult = buildExerciseSurveyResult({
  questions,
  answers,
});
const userClassPayload = buildExerciseUserClassPayload({
  loginId,
  cancerTypeCd: getCancerTypeCode(cancer),
  exerciseProgramCd: program,
  aerobic,
  therapyCd: therapy,
  surveyResult,
});

const handleComplete = async () => {
  await saveExerciseUserClass(userClassPayload);
  await saveExerciseSurveyResult(userClassPayload);

  await saveCoachingAnswer(buildExerciseSeedPayload({
    accountName,
    loginId,
    refs: buildExerciseRecommendationRefs({
      contentList,
      cancerTypeCd: getCancerTypeCode(cancer),
      exerciseProgramCd: program,
      aerobic,
      therapyCd: therapy,
    }),
  }));
};
```

- [ ] **Step 4: Run focused tests plus type-check**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.test.ts src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS with no route typing errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_auth/_coaching/coaching/exercise/eval.tsx src/routes/_auth/_coaching/coaching/exercise/result.tsx src/routes/_auth/_coaching/coaching/exercise/-hooks src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseCancerSelector.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseQuestionStep.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseResultSummary.tsx src/routes/_auth/_coaching/coaching/exercise/-constants src/routes/_auth/_coaching/coaching/exercise/-lib
git commit -m "feat: add exercise evaluation and result flow"
```

### Task 5: Build Content And Video Routes With Completion Save

**Files:**
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseWorkoutList.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseVideoPanel.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/content.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/video.tsx`

- [ ] **Step 1: Write the failing completion payload test**

```ts
import { describe, expect, it } from "vitest";
import { buildExerciseCompletionPayload } from "./buildExercisePayloads";

describe("buildExerciseCompletionPayload", () => {
  it("updates only the selected recommendation answerChoice to Y", () => {
    expect(
      buildExerciseCompletionPayload({
        answerList: [
          { refVal1: "1E2A2", answerChoice: "N", loginId: "u1" },
          { refVal1: "1E5A2", answerChoice: "N", loginId: "u1" },
        ],
        selectedRef: "1E5A2",
      }).map((item) => item.answerChoice),
    ).toEqual(["N", "Y"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: FAIL because `buildExerciseCompletionPayload` is not implemented.

- [ ] **Step 3: Implement content/video pages and completion save**

```tsx
// content.tsx
const { data: contentList = [] } = useExerciseContentList(loginId);
const { data: answerList = [] } = useUserAnswerInfoList({ loginId, categoryCd: "E" });

const workouts = contentList
  .filter((item) =>
    answerList.some(
      (answer) => answer.refVal1 === `${item.indexNum}${item.exerciseTypeCd}${item.difficultyCd}`,
    ),
  )
  .sort(
    (left, right) =>
      left.exerciseTypeCd.localeCompare(right.exerciseTypeCd) ||
      left.indexNum - right.indexNum,
  );
```

```tsx
// video.tsx
const handleComplete = async () => {
  await saveCoachingAnswer(
    buildExerciseCompletionPayload({
      answerList,
      selectedRef: `${selectedWorkout.indexNum}${selectedWorkout.exerciseTypeCd}${selectedWorkout.difficultyCd}`,
    }),
  );

  await alert(pt("complete_success"));
  navigate({ to: "/coaching/exercise/content", replace: true });
};
```

- [ ] **Step 4: Run tests and route verification**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.test.ts`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS.

Run: `npm run test:webview-routes`

Expected: PASS with the new exercise webview paths recognized.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_auth/_coaching/coaching/exercise/content.tsx src/routes/_auth/_coaching/coaching/exercise/video.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseWorkoutList.tsx src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseVideoPanel.tsx src/routes/_auth/_coaching/coaching/exercise/-lib/buildExercisePayloads.ts
git commit -m "feat: add exercise content and video flow"
```

### Task 6: Final Integration Verification And Cleanup

**Files:**
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/routeGuards.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/routeGuards.test.ts`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/index.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/eval.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/result.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/content.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/video.tsx`

- [ ] **Step 1: Write a final smoke test for route guards**

```ts
import { describe, expect, it } from "vitest";
import { canEnterExerciseVideo } from "./routeGuards";

describe("canEnterExerciseVideo", () => {
  it("blocks entry when no selected workout exists", () => {
    expect(canEnterExerciseVideo(null)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `npm test -- src/routes/_auth/_coaching/coaching/exercise/-lib/routeGuards.test.ts`

Expected: FAIL because the route guard helper does not exist.

- [ ] **Step 3: Implement final guard/helper cleanup and run formatter**

```ts
export function canEnterExerciseVideo(selectedWorkout: WebviewExerciseContentItem | null) {
  return selectedWorkout !== null;
}
```

Run: `npx biome check --write src/routes/_auth/_coaching/coaching/exercise src/apis/api/webview/coaching.ts src/apis/types/webview.types.ts src/hooks/queries/webview/useCoachingQueries.ts src/hooks/mutations/webview/useCoachingMutations.ts package.json vite.config.ts`

- [ ] **Step 4: Run full verification**

Run: `npm test`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS.

Run: `npm run lint:check`

Expected: PASS.

Run: `npm run test:webview-routes`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_auth/_coaching/coaching/exercise src/apis/api/webview/coaching.ts src/apis/types/webview.types.ts src/apis/types/index.ts src/hooks/queries/webview/useCoachingQueries.ts src/hooks/mutations/webview/useCoachingMutations.ts package.json package-lock.json vite.config.ts src/test/setup.ts src/locales/ko/coaching/exercise
git commit -m "feat: finish exercise coaching migration"
```
