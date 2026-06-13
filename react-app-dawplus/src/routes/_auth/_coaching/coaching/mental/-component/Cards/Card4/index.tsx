import { useEffect, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import {
  Sparkles,
  Brain,
  Lightbulb,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import card4Image from "@/assets/images/coaching/mental/59.png";
import ideaImage from "@/assets/images/coaching/mental/60.png";
import type1Image from "@/assets/images/coaching/mental/type1.png";
import char4Image from "@/assets/images/character/char4.png";
import resultImage from "@/assets/images/character/result.png";
import {
  MentalCardBubble,
  MentalCardFooter,
  MentalCardImage,
  MentalCardOptionList,
  MentalCardPanel,
  MentalCardRadioList,
  MentalCardText,
  CoachingTitle,
} from "../-components";
import { useMentalCardState } from "../-useMentalCardState";
import type { MentalCardProps } from "../-types";
import useAccountName from "@/hooks/useAccountName";



const checklist = [
  "나는 실패자다.",
  "내 인생은 내가 원하는 대로 흘러가고 있지 않다.",
  "도대체 나에게 무엇이 문제란 말인가?",
  "나는 미래에 대한 희망이 없다.",
  "해당없음.",
];

const scenarioOptionsByType = {
  전투형: [
    "결과가 대체로 좋다니 성공이야.",
    "또 기다려야한다니.",
    "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
    "해당없음.",
  ],
  순응형: [
    "어쩔 수 없지만 앞으로 어떻게 할지 찾아봐야겠어.",
    "이미 암에 걸린걸 되돌릴 수 없잖아.",
    "암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어.",
    "해당없음.",
  ],
  억압형: [
    "결과가 대체로 좋다니 성공이야.",
    "나쁜 이야기일 거야 듣고 싶지 않아.",
    "치료가 실패했나봐.",
    "해당없음.",
  ],
  자포자기형: [
    "결과가 대체로 좋다니 성공이야.",
    "또 기다려야한다니.",
    "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
    "해당없음.",
  ],
  걱정형: [
    "결과가 대체로 좋다니 성공이야.",
    "또 기다려야한다니.",
    "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
    "해당없음.",
  ],
} as const;

const finalChoiceByType = {
  전투형: [
    "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    "퇴원을 앞두고 혼자라는 생각이 들 때",
    "검사 결과를 확인하는 주치의의 표정이 어두울 때",
  ],
  순응형: [
    " 암 진단을 받았을 때",
    "책을 읽다가 '재발'이라는 단어를 봤을 때",
    "검사 결과를 확인하는 주치의의 표정이 어두울 때",
  ],
  억압형: [
    "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    "책을 읽다가 '재발'이라는 단어를 봤을 때",
    "검사 결과를 확인하는 주치의의 표정이 어두울 때",
  ],
  자포자기형: [
    "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    "퇴원을 앞두고 혼자라는 생각이 들 때",
    "검사 결과를 확인하는 주치의의 표정이 어두울 때",
  ],
  걱정형: [
    "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    "책을 읽다가 '재발'이라는 단어를 봤을 때",
    "검사 결과를 확인하는 주치의의 표정이 어두울 때",
  ],
} as const;

export default function MentalCard4({
  onPrev,
  onSave,
  title = "카마코칭",
  type,
}: MentalCardProps) {
  const { alert } = useDialog();
  const accountName = useAccountName();
  const {
    answers,
    currentAnswers,
    next,
    prev,
    setSingleAnswer,
    step,
    toggleAnswer,
  } = useMentalCardState(21);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [freeText, setFreeText] = useState("");

  useEffect(() => {
    if (step === 21) {
      setFreeText(currentAnswers[0] ?? "");
    }
  }, [currentAnswers, step]);

  const handleStep1Next = () => {
    if (currentAnswers.length > 0) {
      next();
      return;
    }

    setShowEmptyConfirm(true);
  };

  const exampleIntro = {
    전투형:
      "검사 결과를 확인하는 날, 주치의가'결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'라고 말했어요.\n그 이야기를 들은 나는 기분이 울적해졌어요.",
    순응형:
      "검사 결과를 확인한 주치의는 내게 암이라고 말합니다. \n어쩔 수 없는 일이라고 생각하며 내가 할 수 있는 건 없다고 체념합니다.",
    억압형:
      "검사 결과를 확인하는 날, 주치의는 결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같다 고 말합니다.\n다음 진료 때 병원에 오기가 싫어집니다.",
    자포자기형:
      "검사 결과를 확인하는 날, 주치의가'결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'라고 말했어요.\n그 이야기를 들은 나는 기분이 울적해졌어요.",
    걱정형:
      "검사 결과를 확인하는 날, 주치의가'결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'라고 말했어요.\n그 이야기를 들은 나는 기분이 울적해졌어요.",
  }[type];

  const hiddenErrorTitle = {
    전투형: '"하나가 좋지 않다니, 내 노력이 모두 실패한거야."',
    순응형: '"암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어."',
    억압형: '"나쁜 이야기일거야, \n듣고 싶지 않아."',
    자포자기형: '"하나가 좋지 않다니, 내 노력이 모두 실패한거야."',
    걱정형: '"하나가 좋지 않다니, \n내 노력이 모두 실패한거야."',
  }[type];

  const altThoughts = {
    전투형: [
      "나머지가 좋았으니, 다음 결과도 좋을거야.",
      "많은 것들이 좋아졌다니 희망적이야.",
      "아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.",
    ],
    순응형: [
      "내가 치료받을 병원을 결정하고, 치료 방법을 선택할 수 있어.",
      "암환자이기도 하지만 나는 여전히 소중한 내 아이의 엄마/아빠야.",
    ],
    억압형: [
      "결과를 들어봐야 알 수 있어.",
      "나머지가 좋았으니, 다음 결과도 좋을거야.",
      "많은 것들이 좋아졌다니 희망적이야.",
    ],
    자포자기형: [
      "나머지가 좋았으니, 다음 결과도 좋을거야.",
      "많은 것들이 좋아졌다니 희망적이야.",
      "아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.",
    ],
    걱정형: [
      "나머지가 좋았으니, 다음 결과도 좋을거야.",
      "많은 것들이 좋아졌다니 희망적이야.",
      "아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.",
    ],
  }[type];

  const secondScenario = {
    전투형:
      "치료를 잘 마치고 퇴원을 앞두고 있습니다. 그동안 의료진과 함께여서 안심했었는데 이제는 혼자서 암과 싸워 나가야 한다니 불현듯 기분이 우울해지고 맙니다.",
    순응형:
      "책을 읽다가 '재발'이라는 단어를 본 당신, 우울한 느낌에 책을 덮습니다.",
    억압형:
      "책을 읽다가 '재발'이라는 단어를 본 당신, 불안하고 초조한 마음이 들어 책을 덮습니다.",
    자포자기형:
      "치료를 잘 마치고 퇴원을 앞두고 있습니다. 그동안 의료진과 함께여서 안심했었는데 이제는 혼자서 암과 싸워 나가야 한다니 불현듯 기분이 우울해지고 맙니다.",
    걱정형:
      "책을 읽다가 '재발'이라는 단어를 본 당신, 불안하고 초조한 마음이 들어 책을 덮습니다.",
  }[type];

  const finalStep20Options = finalChoiceByType[type];

  const selectedScenario =
    answers.find((item) => item.progressTypeCd === "20")?.answerChoice ?? "";

  return (
    <div className="min-h-[100dvh] flex flex-col relative px-5 pb-10 pt-6">
      {/* Fixed Full Background to prevent scroll cutoffs */}
      <div className="fixed inset-0 -z-20 bg-[#f2f7f5]" />

      {/* Decorative background blurs */}
      <div className="fixed -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="fixed -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="mx-auto max-w-[32rem] w-full space-y-5 relative z-10">
        {/* Step Indicator */}
        <div className="flex justify-end mb-2 relative z-20">
          <div className="rounded-full bg-white/60 backdrop-blur-md px-3.5 py-1 text-sm font-extrabold text-emerald-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white">
            {step} <span className="text-emerald-800/40">/ 21</span>
          </div>
        </div>

        {step === 1 ? (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-2">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[20rem] bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-6 px-5 mb-4 text-center z-20">
                <h2 className="relative z-10 text-xl font-black text-slate-800 leading-snug break-keep text-pretty tracking-tight">
                  {title}
                </h2>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 (아래로 향하게) */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/90 drop-shadow-sm" />
              </div>

              {/* 캐릭터 (말풍선 아래에 배치) */}
              <img
                src={char4Image}
                alt="카마 코치"
                className="w-[110px] drop-shadow-md animate-soft-float z-10"
              />
            </div>

            <MentalCardText className="mt-8 text-slate-600">
              평소 {accountName}님의 생각은 어떠신가요?{"\n"}해당되는 것에
              모두 체크해 보아요.
            </MentalCardText>
            <div className="mt-6">
              <MentalCardOptionList
                values={checklist}
                selectedValues={currentAnswers}
                onToggle={toggleAnswer}
              />
            </div>
            {showEmptyConfirm ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center text-base font-bold leading-relaxed text-amber-800">
                항목을 선택해 주세요.
              </div>
            ) : null}
            <MentalCardFooter onPrev={onPrev} onNext={handleStep1Next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardImage src={type1Image} alt="type" />
            <MentalCardText className="mt-5">
              앞선 보기에 많이 해당할수록 현재 상황에 대한 불만족이 크고 자신을
              부정적으로 평가하고 있다는 뜻이에요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              생각이 균형을 잃어버린 상태일 가능성이 크지요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Brain}>
              생각이 균형을 잃는다고요?
            </CoachingTitle>
            <div className="flex flex-col items-center !mt-2 mb-2">
              <MentalCardImage
                src={card4Image}
                alt="생각"
                className="w-full max-w-[180px]"
              />
              <div className="mt-3 text-center text-lg font-extrabold leading-relaxed text-slate-800">
                건강하고 균형잡힌 생각은 <br />
                <span className="text-primary">'유연하고 합리적'</span>
                이에요.
              </div>
            </div>
            <MentalCardText className="!mt-4">
              <span className="font-extrabold text-primary">
                '경직되고 비합리적'
              </span>
              인 생각으로 치우쳐 있으면 마음의 균형도 깨져요.
            </MentalCardText>
            <MentalCardText className="mt-3">
              긍정적인 마음가짐을 위해서는 생각의 균형을 바로잡아야 해요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Lightbulb}>
              생각을 바꾸는 게 어떤 <br /> 도움이 되나요?
            </CoachingTitle>
            <MentalCardText className="mt-5">
              인간의 감정, 생각, 행동은 톱니바퀴처럼 긴밀하게 연결되어 있어요.
              그래서 하나가 바뀌면 나머지도 영향을 받게 되지요.{"\n"} 즉,{" "}
              <span className="font-extrabold text-primary">생각을 바꾸면</span>{" "}
              기분이 나아지고 기분이 좋아지면 행동에도 자신감이 생기는 거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Sparkles}>
              예를 한 번 살펴볼까요?
            </CoachingTitle>
            <MentalCardText className="mt-5">{exampleIntro}</MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1">이때 내 머릿속을 스쳐간</p>
              <p>생각은 무엇일까요?</p>
              <p className="mt-4">체크해 보세요.</p>
            </MentalCardBubble>
            <div className="mt-6">
              <MentalCardOptionList
                values={[...scenarioOptionsByType[type]]}
                selectedValues={currentAnswers}
                onToggle={toggleAnswer}
              />
            </div>
            <MentalCardFooter
              onPrev={prev}
              onNext={
                currentAnswers.length
                  ? next
                  : () => {
                      void alert("항목을 선택해 주세요 ");
                    }
              }
            />
          </MentalCardPanel>
        ) : null}

        {step === 7 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            <MentalCardText className="mt-5">
              어쩌면 다른 생각이 떠올랐을 수도 있어요. 중요한 건{" "}
              <span className="font-extrabold text-primary">
                머릿속에 생각이 떠올랐었다는 것
              </span>
              을 알아차리는 거에요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              매 순간 생각은 자동적으로 떠오르지만, 우리는 알아차리지 못할 때가
              더 많아요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              그런데 같은 상황에서도 어떤 생각이 떠오르냐에 따라 기분이 매우
              달라질 수 있어요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 8 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            {scenarioOptionsByType[type]
              .filter((value) => value !== "해당없음.")
              .map((value) => (
                <MentalCardText key={value} className="mt-5">
                  <span className="font-extrabold text-primary">'{value}'</span>
                  {type === "순응형" && value.includes("앞으로 어떻게")
                    ? "라고 생각하면 의욕적이고 희망적인 기분이 들 수 있어요."
                    : ""}
                  {type === "순응형" && value.includes("되돌릴 수")
                    ? "라는 생각이 들면 낙담하거나 포기하고 싶어질 수 있어요."
                    : ""}
                  {type === "순응형" && value.includes("아무 것도")
                    ? "라는 생각은 절망스럽거나 좌절감, 무력한 기분을 느끼게 할 수 있어요."
                    : ""}
                  {type === "억압형" && value.includes("성공이야")
                    ? "라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요."
                    : ""}
                  {type === "억압형" && value.includes("듣고 싶지")
                    ? "라는 생각은 걱정하게 하거나 불안하고 초조해지게 만들 수 있어요."
                    : ""}
                  {type === "억압형" && value.includes("실패했나봐")
                    ? "라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수 있어요."
                    : ""}
                  {type !== "순응형" &&
                  type !== "억압형" &&
                  value.includes("성공이야")
                    ? "라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요."
                    : ""}
                  {type !== "순응형" &&
                  type !== "억압형" &&
                  value.includes("기다려야")
                    ? "라는 생각은 낙담하거나 실망감, 지치는 느낌, 불안하고 초조함 등을 느끼게 할 수 있어요."
                    : ""}
                  {type !== "순응형" &&
                  type !== "억압형" &&
                  value.includes("실패한거야")
                    ? "라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수도 있어요."
                    : ""}
                </MentalCardText>
              ))}
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 9 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            <MentalCardText className="mt-5">
              그런데 생각은 때때로{" "}
              <span className="font-extrabold text-primary">오류</span>를
              범해요.{"\n"}예시를 다시 살펴볼게요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              <span className="text-xl font-black text-slate-900 whitespace-pre-line">
                {hiddenErrorTitle}
              </span>
              {"\n"}이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께
              오류를 찾아 보아요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 10 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            {type === "순응형" ? (
              <>
                <MentalCardText className="mt-5">
                  흑백논리{"\n"}암에 걸리냐 걸리지 않느냐로만 보는 시각이에요.
                  암에 걸리기 이전으로 되돌아갈 수 없어도, 암을 잘 치료하고
                  행복한 삶을 살아갈 수 있어요.
                </MentalCardText>
                <MentalCardText className="mt-5">
                  지나친 일반화{"\n"}암에 걸린 일은 내 노력으로 통제할 수
                  없었지만, 내가 할 수 있는 다른 일들이 있어요.
                </MentalCardText>
              </>
            ) : type === "억압형" ? (
              <>
                <MentalCardText className="mt-5">
                  부정적 결과를 예상하기/지레짐작{"\n"}주치의는 경과를
                  지켜보자고 했을 뿐인데, 그 결과를 나쁠거라고 예상하지요. 또
                  어떤 면에서는 아직 결과를 확인하지 않고 지레짐작하는 것일 수도
                  있어요.
                </MentalCardText>
                <MentalCardText className="mt-5">
                  과장하기/축소하기{"\n"}그리고 대체로{" "}
                  <span className="font-extrabold text-primary">
                    '결과가 좋다'
                  </span>
                  는 평가는 축소하고 있어요.
                </MentalCardText>
              </>
            ) : (
              <>
                <MentalCardText className="mt-5">
                  부정적 결과를 예상하기{"\n"}주치의는 경과를 지켜보자고 했을
                  뿐인데, 결과를 '좋지 않다', '실패'라고 해석했지요.
                </MentalCardText>
                <MentalCardText className="mt-5">
                  과장하기/축소하기{"\n"}그리고 대체로{" "}
                  <span className="font-extrabold text-primary">
                    '결과가 좋다'
                  </span>
                  는 평가는 축소하고 있어요.
                </MentalCardText>
                <MentalCardText className="mt-5">
                  흑백논리{"\n"}설사 하나의 검사 결과가 나쁘다고 해도, 그동안의
                  노력이 모두 실패인 것은 아니에요.
                </MentalCardText>
              </>
            )}
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 11 ? (
          <MentalCardPanel>
            <div className="flex flex-col items-center !mt-4 mb-2">
              <MentalCardImage
                src={ideaImage}
                alt="idea"
                className="w-full max-w-[190px] -mt-5"
              />
              <MentalCardText className="text-center text-lg font-bold leading-relaxed text-slate-800">
                {type === "순응형" || type === "억압형" ? (
                  <>
                    이렇게{" "}
                    <span className="font-black text-primary text-xl break-keep">
                      "생각에 오류가 있을 수 있다는 것"
                    </span>
                    을<br />
                    깨닫는 것이 중요해요.
                  </>
                ) : (
                  <>
                    중요한 건,
                    <br />
                    <span className="font-black text-primary text-xl break-keep">
                      "생각에 오류가 있을 수 있다는 것"
                    </span>
                    을<br />
                    아는 거에요.
                  </>
                )}
              </MentalCardText>
            </div>
            <MentalCardText className="!mt-6 text-center text-slate-600 font-medium break-keep">
              {type === "순응형" || type === "억압형"
                ? "그럼 어떻게 바꿔볼 수 있을까요?\n카마 코치와 함께 생각의 균형을 잡아 보아요."
                : "카마 코치와 함께 생각의 균형을 잡아 보아요."}
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 12 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1.5">카마 코치의 조언</p>
            </MentalCardBubble>
            <MentalCardText className="mt-5">
              1. 부정적인 것 뿐만 아니라 긍정적인 면도 함께 살펴봅니다.
            </MentalCardText>
            <MentalCardText className="mt-2">
              2. 다양한 가능성을 생각해 봅니다.
            </MentalCardText>
            <MentalCardText className="mt-2">
              3. 내 생각이 맞다는 증거를 찾아봅니다. 그리고 틀렸다는 증거도
              찾아봅니다.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 13 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p>균형 잡힌 생각으로</p>
              <p className="mt-1">바꿔볼까요?</p>
            </MentalCardBubble>
            <MentalCardText className="mt-4 text-center">
              <span className="text-xl font-black   whitespace-pre-line text-primary">
                {hiddenErrorTitle}
              </span>
            </MentalCardText>
            <div className="mt-3 space-y-3">
              {altThoughts.map((item) => (
                <MentalCardText key={item}>{item}</MentalCardText>
              ))}
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 14 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1.5">어떠신가요?</p>
              <p>생각이 바뀌면 기분도</p>
              <p className="mt-1">달라지는 것을 느끼셨나요?</p>
            </MentalCardBubble>
            <MentalCardText className="mt-5">
              {type === "전투형" || type === "자포자기형"
                ? "다른 방식으로 생각하면 기분을 바꿀 수 있어요."
                : "대안적으로 생각하면 기분을 바꿀 수 있습니다."}
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 15 ? (
          <MentalCardPanel>
            <MentalCardBubble>자, 다른 예도 살펴볼까요?</MentalCardBubble>
            <MentalCardText className="mt-5 text-black">
              {secondScenario}
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 16 ? (
          <MentalCardPanel>
            {/* 상단 소개 */}
            <div className="text-center mb-6">
              <MentalCardImage
                src={char4Image}
                alt="카마 코치"
                className="w-[150px] mx-auto -mt-10 "
              />
              <MentalCardText className="text-lg font-bold text-slate-800 break-keep">
                {type === "전투형" || type === "자포자기형"
                  ? "혼자 감당해야 한다는 생각에\n기분이 울적해졌어요.\n하지만 다른 생각을 한다면 어떨까요?\n카마 코치와 함께 바꿔볼게요!"
                  : "'재발'이라는 단어를 보고\n어떤 생각이 떠오르셨나요?\n카마 코치와 함께 생각을 바꿔봅시다!"}
              </MentalCardText>
            </div>

            {/* 생각 바꾸기 카드 리스트 */}
            <div className="space-y-6">
              {type === "전투형" || type === "자포자기형" ? (
                <div className="relative">
                  {/* 부정적인 생각 (Before) */}

                  <div className="  text-xl font-bold leading-snug text-center text-primary mb-5">
                    "혼자서 싸워나가야 해."
                  </div>

                  {/* 긍정적인 생각 (After) */}
                  <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 relative z-10">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed break-keep">
                          필요할 땐 언제든 의료진의 도움을 받을 수 있어.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed break-keep">
                          혼자서 다 해결해야하는 건 아니야. 가족에게 도움을
                          요청할 수 있어.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed break-keep">
                          지금까지 잘 해왔으니 앞으로도 잘 할 수 있을거야.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 첫 번째 세트 */}
                  <div className="relative">
                    <div className="bg-slate-200/50 border border-slate-200 rounded-t-[2rem] rounded-b-2xl p-5 pb-8">
                      <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-sm">
                        <MessageCircle className="w-3.5 h-3.5" /> 떠오른 생각
                      </div>
                      <div className="text-slate-700 text-lg font-bold leading-snug">
                        "나도 재발하면 어떡하지…"
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-5 -mt-5 relative z-10">
                      <div className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" /> 대안적인 생각
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed break-keep">
                          재발될 수도 있지. 하지만 그렇지 않을 확률이 더 높아.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 두 번째 세트 */}
                  <div className="relative">
                    <div className="bg-slate-200/50 border border-slate-200 rounded-t-[2rem] rounded-b-2xl p-5 pb-8">
                      <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-sm">
                        <MessageCircle className="w-3.5 h-3.5" /> 떠오른 생각
                      </div>
                      <div className="text-slate-700 text-lg font-bold leading-snug">
                        "재발하면 죽는걸텐데…"
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-5 -mt-5 relative z-10">
                      <div className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" /> 대안적인 생각
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed break-keep">
                          설사 재발되더라도 다시 치료할 수 있어.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 17 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1.5">카마코치와 한번 더</p>
              <p>연습해볼까요?</p>
            </MentalCardBubble>
            <MentalCardText className="mt-5 text-black">
              검사 결과를 확인하는 데 주치의의 표정이 어두워보입니다. 나는
              조바심이 나고 긴장되기 시작합니다.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 18 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1">주치의의 표정을 보고</p>
              <p>어떤 생각이 떠올랐을까요?</p>
            </MentalCardBubble>
            <MentalCardText className="mt-5 text-center">
              <span className="font-extrabold text-primary">
                '결과가 안 좋은가?'
              </span>
              {"\n"}
              <span className="font-extrabold text-primary">
                '수치가 나빠진 게 틀림 없어.'
              </span>
            </MentalCardText>
            <MentalCardText className="mt-2">
              카마코치와 함게 생각을 바꿔보아요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              '결과가 안 좋은가?'
            </MentalCardText>
            <MentalCardText>'주치의가 오늘 좀 피곤한가봐.'</MentalCardText>
            <MentalCardText className="mt-5">
              '수치가 나빠진 게 틀림 없어.'
            </MentalCardText>
            <MentalCardText>
              '수치가 조금 안 좋아졌더라도 회복 할 수 있을거야.'
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 19 ? (
          <MentalCardPanel>
            <MentalCardBubble tone="summary">
              <div className="flex items-center gap-2 justify-center flex-col">
                <p className="mb-1.5">카마 코치의 요약</p>
                <img
                  src={resultImage}
                  className="h-[180px] object-contain rounded-lg drop-shadow-md animate-soft-float transition-transform duration-300 hover:scale-[1.03]"
                />
              </div>
            </MentalCardBubble>
            <MentalCardText className="mt-5 text-center">
              <span className="font-extrabold text-primary">
                "균형잡힌 생각"
              </span>
              {"\n"}은 유연하고 합리적 이에요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              생각 속에 숨어 있는 오류를 찾아 바꾸면 기분이 훨씬 나아질 수
              있어요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              생각은 고집이 세서 한 번에 바뀌지 않을 수 있지만, 그래도 괜찮아요.
              계속 하다보면 어느새 생각의 균형을 잡는 데 선수가 돼 있을거에요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              그때까지 카마코치가 함께할게요!
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 20 ? (
          <MentalCardPanel>
            <CoachingTitle icon={MessageCircle} color="primary">
              예시 중에서 가장 와닿았던 <br />
              상황은 무엇인가요?
            </CoachingTitle>
            <div className="mt-5">
              <MentalCardRadioList
                values={[...finalStep20Options]}
                selectedValue={currentAnswers[0] ?? ""}
                onSelect={setSingleAnswer}
              />
            </div>
            <MentalCardFooter
              onPrev={prev}
              onNext={
                currentAnswers.length
                  ? next
                  : () => {
                      void alert("상황을 선택해 주세요 ");
                    }
              }
            />
          </MentalCardPanel>
        ) : null}

        {step === 21 ? (
          <MentalCardPanel>
            <CoachingTitle icon={CheckCircle2} color="slate">
              <span className="text-primary block text-lg mb-2 leading-tight">
                {selectedScenario}
              </span>
              이러한 상황에서 어떠한 생각을 마음에 기억해두면 좋을까요?
            </CoachingTitle>
            <MentalCardText className="mt-5 text-center">
              긍정적이고 현실적인 생각을 {"\n"}아래에 적어보아요.
            </MentalCardText>
            <input
              value={freeText}
              onChange={(event) => {
                const value = event.target.value;
                setFreeText(value);
                setSingleAnswer(value);
              }}
              className="mt-5 h-14 w-full rounded-2xl border border-slate-200 px-4 text-base font-bold text-slate-800 outline-none"
            />
            <MentalCardFooter
              onPrev={prev}
              onNext={() => {
                if (!freeText.trim()) {
                  void alert("내용을 입력해 주세요 ");
                  return;
                }

                void onSave(answers);
              }}
              nextLabel="완료"
            />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
