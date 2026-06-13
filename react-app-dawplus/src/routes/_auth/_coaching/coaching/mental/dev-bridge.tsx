import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  MentalSection1Page,
} from "./Section1";
import { MentalSection2Page } from "./Section2";
import { MentalSection3Page } from "./Section3";
import { MentalSection4Page } from "./Section4";
import { MentalSection5Page } from "./Section5";
import { MentalSection6Page } from "./Section6";
import {
  MentalCard1,
  MentalCard2,
  MentalCard3,
  MentalCard4,
  type MentalCardAnswer,
  type MentalCardUserType,
} from "./-component/Cards";
import {
  MentalCardSummary1,
  MentalCardSummary2,
  MentalCardSummary3,
  MentalCardSummary4,
  MentalCardSummary5,
} from "./-component/CardSummary";
import MentalCareCard1 from "./-component/CareCards/Card1";
import MentalCareCard2 from "./-component/CareCards/Card2";
import MentalCareCard3 from "./-component/CareCards/Card3";
import MentalCareCard4 from "./-component/CareCards/Card4";
import MentalCareCard5 from "./-component/CareCards/Card5";
import MentalCareCard6 from "./-component/CareCards/Card6";
import MentalCareCard7 from "./-component/CareCards/Card7";
import MentalCareCard8 from "./-component/CareCards/Card8";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/mental/dev-bridge",
)({
  component: MentalDevBridgePage,
});

type PreviewKind = "section" | "card" | "care" | "summary";

type PreviewState =
  | { kind: "section"; index: 1 | 2 | 3 | 4 | 5 | 6 }
  | { kind: "card"; index: 1 | 2 | 3 | 4 }
  | { kind: "care"; index: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }
  | { kind: "summary"; index: 1 | 2 | 3 | 4 | 5 };

const mentalTypes: MentalCardUserType[] = [
  "전투형",
  "순응형",
  "억압형",
  "자포자기형",
  "걱정형",
];

const sectionMap = {
  1: MentalSection1Page,
  2: MentalSection2Page,
  3: MentalSection3Page,
  4: MentalSection4Page,
  5: MentalSection5Page,
  6: MentalSection6Page,
} as const;

const cardMap = {
  1: MentalCard1,
  2: MentalCard2,
  3: MentalCard3,
  4: MentalCard4,
} as const;

const careCardMap = {
  1: MentalCareCard1,
  2: MentalCareCard2,
  3: MentalCareCard3,
  4: MentalCareCard4,
  5: MentalCareCard5,
  6: MentalCareCard6,
  7: MentalCareCard7,
  8: MentalCareCard8,
} as const;

const summaryMap = {
  1: MentalCardSummary1,
  2: MentalCardSummary2,
  3: MentalCardSummary3,
  4: MentalCardSummary4,
  5: MentalCardSummary5,
} as const;

function MentalDevBridgePage() {
  const { toast } = useToast();
  const [mentalType, setMentalType] =
    React.useState<MentalCardUserType>("전투형");
  const [preview, setPreview] = React.useState<PreviewState>({
    kind: "card",
    index: 1,
  });

  const handleCardSave = React.useCallback(
    (answers: MentalCardAnswer[]) => {
      toast({
        title: "카드 저장 테스트",
        description: `${answers.length}개 답변이 생성되었습니다.`,
      });
      console.log("mental dev bridge answers", answers);
    },
    [toast],
  );

  const handleSimpleAction = React.useCallback(
    (label: string) => {
      toast({
        title: `${label} 테스트`,
        description: "동작이 실행되었습니다.",
      });
    },
    [toast],
  );

  React.useEffect(() => {
    document.body.dataset.mentalDevBridgeNoScroll = "true";
    return () => {
      delete document.body.dataset.mentalDevBridgeNoScroll;
    };
  }, []);

  const renderPreview = () => {
    if (preview.kind === "section") {
      const Component = sectionMap[preview.index];
      return <Component />;
    }

    if (preview.kind === "card") {
      const Component = cardMap[preview.index];
      return (
        <Component
          type={mentalType}
          title={`개발 브리지 · Card ${preview.index}`}
          onPrev={() => handleSimpleAction(`Card ${preview.index} 이전`)}
          onSave={handleCardSave}
        />
      );
    }

    if (preview.kind === "care") {
      const Component = careCardMap[preview.index];
      return (
        <Component
          onSave={() => handleSimpleAction(`CareCard ${preview.index} 저장`)}
        />
      );
    }

    const Component = summaryMap[preview.index];
    return (
      <Component
        open
        setOpen={() => {}}
        onComplete={() =>
          handleSimpleAction(`CardSummary ${preview.index} 완료`)
        }
      />
    );
  };

  const kindLabel: Record<PreviewKind, string> = {
    section: "Section",
    card: "Card",
    care: "CareCard",
    summary: "CardSummary",
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-4 lg:flex-row">
        <aside className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[340px] lg:overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Mental Dev Bridge
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">
              카드 테스트 허브
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              숨겨진 개발용 페이지입니다. 카드, 케어카드, 섹션을 바로 열어
              테스트할 수 있습니다.
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-sm font-extrabold text-slate-700">
                타입 선택
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {mentalTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMentalType(type)}
                    className={[
                      "rounded-2xl border px-3 py-2 text-sm font-bold transition",
                      mentalType === type
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30",
                    ].join(" ")}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <BridgeSection
              title="Sections"
              items={[1, 2, 3, 4, 5, 6]}
              active={preview.kind === "section" ? preview.index : null}
              onSelect={(index) =>
                setPreview({
                  kind: "section",
                  index: index as 1 | 2 | 3 | 4 | 5 | 6,
                })
              }
            />

            <BridgeSection
              title="Cards"
              items={[1, 2, 3, 4]}
              active={preview.kind === "card" ? preview.index : null}
              onSelect={(index) =>
                setPreview({
                  kind: "card",
                  index: index as 1 | 2 | 3 | 4,
                })
              }
            />

            <BridgeSection
              title="CareCards"
              items={[1, 2, 3, 4, 5, 6, 7, 8]}
              active={preview.kind === "care" ? preview.index : null}
              onSelect={(index) =>
                setPreview({
                  kind: "care",
                  index: index as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
                })
              }
            />

            <BridgeSection
              title="CardSummary"
              items={[1, 2, 3, 4, 5]}
              active={preview.kind === "summary" ? preview.index : null}
              onSelect={(index) =>
                setPreview({
                  kind: "summary",
                  index: index as 1 | 2 | 3 | 4 | 5,
                })
              }
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              현재 미리보기
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {kindLabel[preview.kind]} {preview.index}
              </span>
              {preview.kind === "card" ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {mentalType}
                </span>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {renderPreview()}
          </div>
        </main>
      </div>
    </div>
  );
}

function BridgeSection({
  title,
  items,
  active,
  onSelect,
}: {
  title: string;
  items: number[];
  active: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-extrabold text-slate-700">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map((index) => (
          <button
            key={`${title}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={[
              "rounded-2xl border px-3 py-2 text-sm font-bold transition",
              active === index
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400",
            ].join(" ")}
          >
            {title} {index}
          </button>
        ))}
      </div>
    </section>
  );
}
