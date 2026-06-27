import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDialog } from "@/hooks/useDialog";
import { fetchMentalVideoInfoList } from "@/apis/api/webview/coaching";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useAtomValue } from "jotai";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import card3Image from "@/assets/images/coaching/mental/58.png";
import mentalImage from "@/assets/images/coaching/mental/mental.png";
import mentalHeaderImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import questionImage from "@/assets/images/coaching/mental/question.png";
import type1Image from "@/assets/images/coaching/mental/type1.png";
import char4Image from "@/assets/images/character/char4.png";
import resultImage from "@/assets/images/character/result.png";
import {
  MentalCardBubble,
  MentalCardFooter,
  MentalCardImage,
  MentalCardOptionList,
  MentalCardPanel,
  MentalCardText,
  CoachingTitle,
} from "../-components";
import { useMentalCardState } from "../-useMentalCardState";
import type { MentalCardProps } from "../-types";
import type { WebviewMentalVideoItem } from "@/apis/types";
import useAccountName from "@/hooks/useAccountName";

const checklist = [
  "스스로에게 엄격하고 깐깐하다.",
  "늘 조급하거나 산만하다.",
  "의도와 다르게 버럭 화를 낸다.",
  "생각이 많아 집중하기가 어렵다.",
  "내가 뭘 원하는지 잘 모르겠다.",
  "해당없음.",
];

const meditationVideos = [
  {
    type: "V1",
    label: "호흡명상",
    description: "이완을 위한 집중명상",
    image: mentalHeaderImage,
    url: "https://www.youtube.com/embed/o42JtHKTcew2",
  },
  {
    type: "V3",
    label: "자비명상",
    description: "자신과 타인을 향한 사랑을 깨우는 자비명상",
    image: missionImage,
    url: "https://www.youtube.com/embed/o42JtHKTcew",
  },
  {
    type: "V2",
    label: "바디스캔명상",
    description: "자각 능력 향상을 위한 마음챙김 명상",
    image: questionImage,
    url: "https://www.youtube.com/embed/o42JtHKTcew",
  },
] as const;

const timeOptions = [
  "아침(일어난 직후)",
  "점심",
  "저녁",
  "밤(잠들기 전)",
  "기타",
];

export default function MentalCard3({
  onPrev,
  onSave,
  title = "카마코칭",
  type,
}: MentalCardProps) {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = useAccountName();
  const { alert } = useDialog();
  const { currentAnswers, next, prev, step, toggleAnswer } =
    useMentalCardState(6);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [selectedVideoType, setSelectedVideoType] = useState<
    "V1" | "V2" | "V3" | ""
  >("");
  const [selectedPracticeVideo, setSelectedPracticeVideo] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeExtra, setTimeExtra] = useState("");
  const [videoInfoByType, setVideoInfoByType] = useState<
    Partial<Record<"V1" | "V2" | "V3", WebviewMentalVideoItem>>
  >({});

  const handleStep1Next = () => {
    if (currentAnswers.length > 0) {
      next();
      return;
    }

    setShowEmptyConfirm(true);
  };

  useEffect(() => {
    if (!loginId) {
      return;
    }

    let cancelled = false;

    const loadVideoInfo = async () => {
      try {
        const response = await fetchMentalVideoInfoList(loginId);
        if (cancelled || !response.success || !response.response) {
          return;
        }

        const nextVideoInfo = response.response.reduce<
          Partial<Record<"V1" | "V2" | "V3", WebviewMentalVideoItem>>
        >((acc, item: WebviewMentalVideoItem) => {
          if (
            (item.videoTypeCd === "V1" ||
              item.videoTypeCd === "V2" ||
              item.videoTypeCd === "V3") &&
            item.useYn === "Y" &&
            item.url
          ) {
            acc[item.videoTypeCd] = item;
          }
          return acc;
        }, {});

        setVideoInfoByType(nextVideoInfo);
      } catch {
        // Leave fallback URLs in place if the video list cannot be loaded.
      }
    };

    void loadVideoInfo();

    return () => {
      cancelled = true;
    };
  }, [loginId]);

  const toEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;

    const youtudeBeMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (youtudeBeMatch)
      return `https://www.youtube.com/embed/${youtudeBeMatch[1]}`;

    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

    const watchMatch = url.match(/[?&]v=([^?&/]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    return url;
  };

  const selectedVideo = meditationVideos
    .map((item) => ({
      ...item,
      description:
        videoInfoByType[item.type]?.detailDesc?.trim() || item.description,
      url: videoInfoByType[item.type]?.url ?? item.url,
    }))
    .find((item) => item.type === selectedVideoType) ?? {
    ...meditationVideos[0],
    description:
      videoInfoByType[meditationVideos[0].type]?.detailDesc?.trim() ||
      meditationVideos[0].description,
    url:
      videoInfoByType[meditationVideos[0].type]?.url ?? meditationVideos[0].url,
  };

  const step2TypeText = {
    전투형:
      "특히나 열심히 암과 싸우는 중인 '전투형'의 사람들에게는 마음의 휴식이 꼭 필요하답니다.",
    순응형:
      "명상은 '순응형'인 내가 지금 이 순간에 필요한 것을 찾아 나설 수 있게 용기를 줄 거예요.",
    억압형:
      "생각과 감정을 피하고 눌러두기 일쑤인 '억압형'의 경우, 스스로에게 주의를 기울이도록 명상이 도와줄 수 있어요.",
    자포자기형:
      "절망감에 휩싸여 꼼짝할 수 없는 '자포자기형'에게는 무력감에서 벗어나 몸과 마음을 달랠 수 있는 방법이 필요해요.",
    걱정형:
      "특히나 암에 대한 걱정이 많고 불안한 '걱정형'의 사람들에게는 생각을 비워내는 것이 필요하지요. 신체 감각에 주의를 기울여 집중하는 명상이 생각을 비워내는 하나의 방법이에요.",
  }[type];

  const handleSave = async () => {
    if (!selectedPracticeVideo || !selectedTime) {
      await alert("답변을 선택해 주세요.");
      return;
    }

    if (selectedTime === "기타" && !timeExtra.trim()) {
      await alert("답변을 입력해 주세요 ");
      return;
    }

    await onSave([
      {
        progressTypeCd: "07",
        answerChoice: selectedTime === "기타" ? timeExtra : selectedTime,
      },
      {
        progressTypeCd: "07",
        answerChoice: selectedPracticeVideo,
      },
    ]);
  };

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
            {step} <span className="text-emerald-800/40">/ 6</span>
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
              평소 당신은 어떤가요?{"\n"}해당되는 것에 모두 체크해 보세요.
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
                해당되는 항목이 없으신가요 ?
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 rounded-2xl text-base font-extrabold"
                    onClick={() => setShowEmptyConfirm(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-2xl text-base font-extrabold"
                    onClick={() => {
                      setShowEmptyConfirm(false);
                      next();
                    }}
                  >
                    확인
                  </Button>
                </div>
              </div>
            ) : null}
            <MentalCardFooter onPrev={onPrev} onNext={handleStep1Next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardImage src={type1Image} alt="type" />
            <MentalCardText className="mt-5">
              앞선 보기에 체크를 많이 할수록 자신의 몸과 마음의 반응을 자각하지
              못할 때가 많을 수 있어요. 그럴 땐{" "}
              <span className="font-extrabold text-primary">명상</span>이
              도움돼요.
            </MentalCardText>
            <MentalCardText className="mt-5">{step2TypeText}</MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            <MentalCardText className="mt-5">
              명상은 몸의 반응, 떠오르는 생각, 느껴지는 감정, 주위 환경 등을
              알아차리도록 도와줘요.{"\n"}마음을 안정시키는 데 도움이 되지요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Sparkles}>
              쉽게 따라할 수 있는 3가지
              <br />
              <span className="text-primary font-black">명상</span>을
              소개할게요.
            </CoachingTitle>

            <MentalCardImage
              src={card3Image}
              alt="명상"
              className="w-full max-w-[180px]  "
            />

            <div className=" -mt-5  space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {meditationVideos.slice(0, 2).map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setSelectedVideoType(item.type);
                      next();
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="mx-auto w-[60px]"
                    />
                    <p className="mt-2 text-base font-extrabold text-primary">
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedVideoType("V2");
                  next();
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <img
                  src={questionImage}
                  alt="바디스캔명상"
                  className="mx-auto w-[60px]"
                />
                <p className="mt-2 text-base font-extrabold text-primary">
                  바디스캔명상
                </p>
              </button>
            </div>
            <MentalCardFooter onPrev={prev} showNext={false} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <CoachingTitle>{selectedVideo.label}</CoachingTitle>
            <p className="text-center text-sm font-bold text-slate-500 leading-relaxed  mb-4">
              {selectedVideo.description}
            </p>
            <MentalCardImage
              src={mentalImage}
              alt="mental"
              className="w-[60px] mx-auto -mt-1  "
            />
            <div className="  bg-slate-900 shadow-inner">
              <div className="aspect-video w-full">
                <iframe
                  title={selectedVideo.label}
                  src={toEmbedUrl(selectedVideo.url)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <MentalCardText className="mt-5">
              자리에 앉거나 누워봅니다.{"\n\n"}몸에 긴장한 부분은 없는지
              알아차리고 편안한 자세를 취합니다.
            </MentalCardText>
            <div className="mt-5 space-y-4">
              {selectedVideo.type === "V1" ? (
                <>
                  <MentalCardText>
                    가만히 눈을 감고 마음의 눈으로 호흡을 관찰합니다.
                  </MentalCardText>
                  <MentalCardText>
                    코로 숨이 들어가고 나오는 것을 느껴 봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    들이쉴 때 콧속으로 공기가 들어가고 내쉴 때 나오는 숨의
                    따뜻함을 느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    호흡을 알아차리는 '옳은' 방식은 없다는 사실을 기억하세요.
                  </MentalCardText>
                  <MentalCardText>
                    '지금 호흡을 잘하고 있다, 못하고 있다'는 생각이나 평가 없이,
                    현재 숨 쉬고 있는 그대로 내버려 두세요.
                  </MentalCardText>
                  <MentalCardText>
                    그저 파도가 밀려왔다 가는 것처럼, 호흡이 들어오고 나가는
                    것을 느껴봅니다.
                  </MentalCardText>
                </>
              ) : null}
              {selectedVideo.type === "V2" ? (
                <>
                  <MentalCardText>
                    정수리와 뒤통수의 굴곡, 이마, 눈, 코, 입을 차례로
                    느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    목과 어깨로 이어지는 선과 왼쪽 팔, 팔뚝, 팔꿈치가 구부러지는
                    느낌, 손목, 손으로 이어지는 느낌과 손가락 하나하나를 차례로
                    느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    이번엔 오른쪽 어깨, 팔, 팔꿈치, 손목, 손가락을 차례로
                    느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    가슴과 배로 주의를 가져가, 숨을 들이쉬고 내쉴 때마다
                    움직임을 느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    배 안의 공간이 확장되는 느낌을 느껴보고, 등쪽으로 주의를
                    가져가 척추의 상태를 느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    엉덩이쪽으로 주의를 가져와 엉덩이의 둥근 느낌, 허벅지로
                    이어지는 곳, 무릎, 종아리, 발목을 차례로 관찰합니다.{"\n\n"}
                    발가락 사이사이, 발바닥의 아치 모양도 느껴봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    호흡으로 주의를 가져와 숨이 들어가고 나가는 것을 관찰합니다.
                  </MentalCardText>
                  <MentalCardText>천천히 눈을 뜹니다.</MentalCardText>
                </>
              ) : null}
              {selectedVideo.type === "V3" ? (
                <>
                  <MentalCardText>
                    가장 친절한 말투와 모습으로 자신의 모습을 떠올리며 반복해서
                    말해봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    '내가 진정으로 편안하기를' 기원합니다.{"\n"}'내가 진정으로
                    평화롭기를' 기원합니다.{"\n"}'내가 진정으로 행복하기를'
                    기원합니다.
                  </MentalCardText>
                  <MentalCardText>
                    이번엔 가까운 누군가를 떠올려봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    그가 환하게 웃는 모습을 바라보며 말해 봅니다.
                  </MentalCardText>
                  <MentalCardText>
                    '그가 행복하기를' 기원합니다.{"\n"}'그가 고통스럽지 않기를'
                    기원합니다.{"\n"}'그가 건강하기를' 기원합니다.{"\n"}'그가
                    평화롭기를' 기원합니다.
                  </MentalCardText>
                  <MentalCardText>
                    나와 타인을 향한 자비명상을 반복해봅니다.
                  </MentalCardText>
                </>
              ) : null}
            </div>
            <div className="fixed inset-x-0 bottom-0 z-50 bg-[#f2f7f5]/80 backdrop-blur-md p-3 border-t border-emerald-900/5 shadow-[0_-10px_30px_rgba(242,247,245,0.9)]">
              <div className="mx-auto flex max-w-[32rem] gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl bg-white/60 hover:bg-white !text-slate-700 text-sm font-bold border-slate-200 transition-colors"
                  onClick={prev}
                >
                  이전
                </Button>
                <Button
                  type="button"
                  className="h-12 flex-[1.2] rounded-2xl text-sm font-bold shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  onClick={() => {
                    setSelectedVideoType("");
                    prev();
                  }}
                >
                  다른 명상도 해볼래요
                </Button>
                <Button
                  type="button"
                  className="h-12 flex-1 rounded-2xl text-sm font-bold shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  onClick={next}
                >
                  그만할래요
                </Button>
              </div>
            </div>
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
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

            <MentalCardText className="mt-5">
              <span className="font-extrabold text-primary">어떠셨나요?</span>
              {"\n"}잘 하지 않아도 괜찮아요.{"\n"}자꾸 집중력을 잃게 될 때, 나를
              탓하거나 포기하지 말고 그저 다시 주의를 가져오세요. 그러면
              된답니다.
            </MentalCardText>
            <MentalCardText className="mt-5">
              꾸준히 연습하면 삶이 더욱 생생하고 안정될거에요.{"\n\n"}그때까지
              카마코치가 곁에서 함께할게요!
            </MentalCardText>

            <div className="mt-5 text-center">
              <p className="text-lg font-black leading-snug text-primary break-keep">
                함께 훈련 일정을 정해볼까요?
              </p>
            </div>

            <div className="mt-5 text-center">
              <p className="text-lg font-black leading-snug text-slate-800 break-keep">
                1. 어떤 명상을 연습해보고 {"\n"}싶으신가요?
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-3.5">
                {["호흡명상", "바디스캔명상", "자비명상"].map((value) => {
                  const checked = selectedPracticeVideo === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedPracticeVideo(value)}
                      className={`rounded-xl border py-2.5 text-center text-sm font-black leading-relaxed transition-all ${
                        checked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/20"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-black leading-snug text-slate-800 break-keep">
                2. 언제 연습하는 것이 좋을까요?
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-3.5">
                {timeOptions.map((value) => {
                  const checked = selectedTime === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedTime(value)}
                      className={`rounded-xl border py-2.5 text-center text-sm font-black leading-relaxed transition-all ${
                        checked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/20"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              {selectedTime === "기타" ? (
                <input
                  value={timeExtra}
                  onChange={(event) => setTimeExtra(event.target.value)}
                  className="mt-3.5 h-12 w-full rounded-xl border border-slate-200 px-4 text-base font-bold text-slate-800 outline-none"
                />
              ) : null}
            </div>

            {selectedPracticeVideo &&
            selectedTime &&
            (selectedTime !== "기타" || timeExtra.trim()) ? (
              <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/10 p-5 text-center text-base font-extrabold leading-relaxed text-slate-800 break-keep">
                <p className="mb-2">
                  나는 안정적이고 생생하게 살아가기 위해{" "}
                  <span className="text-primary font-black">
                    {selectedPracticeVideo}
                  </span>
                  을{" "}
                  <span className="text-primary font-black">
                    {selectedTime === "기타" ? timeExtra : selectedTime}
                  </span>
                  에 연습해 볼 거에요.
                </p>
                <div className="mt-3.5 pt-3.5 border-t border-primary/10 text-center font-extrabold text-slate-800 flex flex-col items-center gap-1.5">
                  <span className="text-sm text-slate-600 font-bold">
                    {type === "전투형"
                      ? `잘 싸워내고 있는 ${accountName}님,`
                      : `용기내어 마주할 ${accountName}님의 삶,`}
                  </span>
                  <span className="text-base text-primary font-black">
                    언제나 응원할게요!
                  </span>
                </div>
              </div>
            ) : null}

            <MentalCardFooter
              onPrev={prev}
              onNext={handleSave}
              nextLabel="완료"
            />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
