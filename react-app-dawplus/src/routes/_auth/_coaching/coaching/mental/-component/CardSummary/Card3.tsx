import { useEffect, useState } from "react";
import { fetchMentalVideoInfoList } from "@/apis/api/webview/coaching";
import type { WebviewMentalVideoItem } from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useAtomValue } from "jotai";
import useAlert from "@/hooks/useAlert";
import mentalImage from "@/assets/images/coaching/mental/mental.png";
import mentalHeaderImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import questionImage from "@/assets/images/coaching/mental/question.png";
import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import { MentalCardImage, MentalCardText } from "../Cards/-components";
import {
  CareCardImageChoiceButton,
  CareCardSelectButton,
  CareCardSurface,
} from "../CareCards/-components";
import ImporText from "../../component/-ImportText";
import {
  CardSummaryPopup,
  CardSummaryShell,
  EncourageAlertDialog,
} from "./-utils";
import type { CardSummaryPopupProps } from "./-types";

const meditationVideos = [
  {
    type: "V1",
    label: "호흡명상",
    description: "이완을 위한 집중명상",
    image: mentalHeaderImage,
    url: "https://www.youtube.com/embed/o42JtHKTcew",
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

function V1Video() {
  return (
    <>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        가만히 눈을 감고 마음의 눈으로 호흡을 관찰합니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        코로 숨이 들어가고 나오는 것을 느껴 봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        들이쉴 때 콧속으로 공기가 들어가고 내쉴 때 나오는 숨의 따뜻함을
        느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        호흡을 알아차리는 <ImporText>'옳은'</ImporText> 방식은 없다는 사실을
        기억하세요.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        <ImporText>'지금 호흡을 잘하고 있다, 못하고 있다'</ImporText>는 생각이나
        평가 없이, 현재 숨 쉬고 있는 그대로 내버려 두세요.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        그저 파도가 밀려왔다 가는 것처럼, 호흡이 들어오고 나가는 것을
        느껴봅니다.
      </MentalCardText>
    </>
  );
}

function V2Video() {
  return (
    <>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        자리에 앉거나 누워봅니다. 몸에 긴장한 부분은 없는지 알아차리고 편안한
        자세를 취합니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        정수리와 뒤통수의 굴곡, 이마, 눈, 코, 입을 차례로 느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        목과 어깨로 이어지는 선과 왼쪽 팔, 팔뚝, 팔꿈치가 구부러지는 느낌, 손목,
        손으로 이어지는 느낌과 손가락 하나하나를 차례로 느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        이번엔 오른쪽 어깨, 팔, 팔꿈치, 손목, 손가락을 차례로 느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        가슴과 배로 주의를 가져가, 숨을 들이쉬고 내쉴 때마다 움직임을
        느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        배 안의 공간이 확장되는 느낌을 느껴보고, 등쪽으로 주의를 가져가 척추의
        상태를 느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        엉덩이쪽으로 주의를 가져와 엉덩이의 둥근 느낌, 허벅지로 이어지는 곳,
        무릎, 종아리, 발목을 차례로 관찰합니다. <br />
        발가락 사이사이, 발바닥의 아치 모양도 느껴봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        호흡으로 주의를 가져와 숨이 들어가고 나가는 것을 관찰합니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        천천히 눈을 뜹니다.
      </MentalCardText>
    </>
  );
}

function V3Video() {
  return (
    <>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        가장 친절한 말투와 모습으로 자신의 모습을 떠올리며 반복해서 말해봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '내가 진정으로 편안하기를'
          </span>
          기원합니다.
        </p>
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '내가 진정으로 평화롭기를'
          </span>
          기원합니다.
        </p>
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '내가 진정으로 행복하기를'
          </span>
          기원합니다.
        </p>
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        이번엔 가까운 누군가를 떠올려봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        그가 환하게 웃는 모습을 바라보며 말해
        <br />
        봅니다.
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '그가 행복하기를'
          </span>
          기원합니다.
        </p>
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '그가 고통스럽지 않기를'
          </span>
          기원합니다.
        </p>
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '그가 건강하기를'
          </span>
          기원합니다.
        </p>
        <p>
          <span className="mx-1 font-extrabold text-primary">
            '그가 평화롭기를'
          </span>
          기원합니다.
        </p>
      </MentalCardText>
      <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
        나와 타인을 향한 자비명상을 반복해봅니다.
      </MentalCardText>
    </>
  );
}

export function MentalCardSummary3Content({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { alert, confirm } = useAlert();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<"V1" | "V2" | "V3">("V1");
  const [showEncourage, setShowEncourage] = useState(false);
  const [videoInfoByType, setVideoInfoByType] = useState<
    Partial<Record<"V1" | "V2" | "V3", WebviewMentalVideoItem>>
  >({});

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

  const selectedVideo =
    meditationVideos
      .map((item) => ({
        ...item,
        description:
          videoInfoByType[item.type]?.detailDesc?.trim() || item.description,
        url: toEmbedUrl(videoInfoByType[item.type]?.url ?? item.url),
      }))
      .find((item) => item.type === selectedType) ?? {
      ...meditationVideos[0],
      description:
        videoInfoByType[meditationVideos[0].type]?.detailDesc?.trim() ||
        meditationVideos[0].description,
      url: toEmbedUrl(
        videoInfoByType[meditationVideos[0].type]?.url ??
          meditationVideos[0].url,
      ),
    };

  const handleStopMeditation = () => {
    setShowEncourage(true);
  };

  const handleComplete = () => {
    void confirm({ html: "명상을 이해하는 데 <br/>도움이 되셨나요?" }, () =>
      setShowEncourage(true),
    );
  };

  if (step === 1) {
    return (
      <>
        <CardSummaryShell cardType="card3">
          <MissionTitle className="mt-5 mb-5 text-2xl font-black text-slate-800 leading-snug">
            좋아요.
            <br /> 이번엔 명상을 해볼게요.
            <br /> 명상 기억나시나요?
          </MissionTitle>
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-3">
              <CareCardImageChoiceButton
                onClick={() =>
                  void alert("훌륭하시네요. 바로 연습해볼게요.", () =>
                    setStep(2),
                  )
                }
                imageSrc={mentalHeaderImage}
                imageAlt="네"
                label="네"
              />
              <CareCardImageChoiceButton
                onClick={() =>
                  void alert("괜찮아요, 카마코치와 복습해볼게요.", () =>
                    setStep(2),
                  )
                }
                imageSrc={missionImage}
                imageAlt="아니오"
                label="아니오"
              />
            </div>
            <CareCardImageChoiceButton
              onClick={handleStopMeditation}
              imageSrc={missionImage}
              imageAlt="오늘은 그만 할게요."
              label="오늘은 그만 할게요."
            />
          </div>
        </CardSummaryShell>
        <EncourageAlertDialog
          open={showEncourage}
          onConfirm={() => {
            setShowEncourage(false);
            onComplete();
          }}
        />
      </>
    );
  }

  return (
    <>
      <CardSummaryShell cardType="card3">
        <div className="mt-5 flex justify-center">
          <MissionTitle className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white px-6 py-2.5 text-slate-800 font-black shadow-[0_4px_12px_rgba(15,23,42,0.03)] text-center">
            "평소에 어떻게 지내시나요?
          </MissionTitle>
        </div>
        <CareCardSurface className="mt-5 text-left border border-slate-200/60 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)] p-5">
          <div className="space-y-2.5">
            <p className="font-bold text-slate-800 flex items-start gap-2">
              <span className="text-primary shrink-0">✔</span>
              <span>내가 무엇을 원하는지 잘 모르겠다.</span>
            </p>
            <p className="font-bold text-slate-800 flex items-start gap-2">
              <span className="text-primary shrink-0">✔</span>
              <span>스스로에게 엄격하고 엄격하다.</span>
            </p>
            <p className="font-bold text-slate-800 flex items-start gap-2">
              <span className="text-primary shrink-0">✔</span>
              <span>항상 조급하거나 산만하다.</span>
            </p>
            <p className="font-bold text-slate-800 flex items-start gap-2">
              <span className="text-primary shrink-0">✔</span>
              <span>의도와 다르게 화를 낸다.</span>
            </p>
            <p className="font-bold text-slate-800 flex items-start gap-2">
              <span className="text-primary shrink-0">✔</span>
              <span>생각이 많아 집중하기 어렵다.</span>
            </p>
          </div>
        </CareCardSurface>
        
        <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm mt-5">
          <MentalCardText className="text-justify leading-relaxed !text-slate-800">
            이 항목에 많이 체크할수록, 몸과 마음의 반응을 인식하지 못할 가능성이
            큽니다. 이런 경우, <ImporText className="!mx-0">명상</ImporText>이
            도움이 됩니다.
          </MentalCardText>
          <MentalCardText className="text-justify leading-relaxed !text-slate-800">
            혹은 해당 사항이 많지 않더라도,{" "}
            <ImporText className="!mx-0">명상</ImporText>은 마음을 잘 다스리고
            필요한 것을 찾을 용기를 줄 것입니다.
          </MentalCardText>
          <MentalCardText className="text-justify leading-relaxed !text-slate-800">
            <ImporText className="!mx-0">명상</ImporText>은 몸의 반응, 떠오르는
            생각, 느끼는 감정, 주변 환경을 인식하게 도와줍니다. 또한 마음을
            진정시키는 데 도움을 줍니다.
          </MentalCardText>
        </div>

        <div className="mt-10 flex justify-center">
          <MissionTitle className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white px-6 py-2.5 text-slate-800 font-black shadow-[0_4px_12px_rgba(15,23,42,0.03)] text-center">
            따라하기 쉬운 명상 <br />세 가지를 소개합니다.
          </MissionTitle>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex gap-4">
            {meditationVideos.slice(0, 2).map((item) => (
              <CareCardImageChoiceButton
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                imageSrc={item.image}
                imageAlt={item.label}
                label={item.label}
              />
            ))}
          </div>
          <CareCardImageChoiceButton
            onClick={() => setSelectedType("V2")}
            imageSrc={questionImage}
            imageAlt="바디스캔명상"
            label="바디스캔명상"
          />
        </div>
        <MentalCardImage
          src={mentalImage}
          alt="mental"
          className="mt-8 w-[85px]"
        />
        <CareCardSurface className="mt-5 p-5 text-center border border-primary/10 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <MissionTitle className="text-xl font-black text-slate-800 leading-snug">
            {selectedVideo.label}
          </MissionTitle>
          <p className="mt-1 text-base font-bold text-slate-500">
            {selectedVideo.description}
          </p>
        </CareCardSurface>
        <div className="mt-5 overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <div className="aspect-video w-full">
            <iframe
              title={selectedVideo.label}
              src={selectedVideo.url}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
          자리에 앉거나 누워봅니다.
          <br /> 몸에 긴장한 부분은 없는지 알아차리고 편안한 자세를 취합니다.
        </MentalCardText>
        {selectedType === "V1" ? <V1Video /> : null}
        {selectedType === "V2" ? <V2Video /> : null}
        {selectedType === "V3" ? <V3Video /> : null}
        <CareCardSelectButton
          className="mt-6 border-transparent bg-primary text-white hover:bg-primary hover:text-white"
          onClick={handleComplete}
        >
          완료
        </CareCardSelectButton>
      </CardSummaryShell>
      <EncourageAlertDialog
        open={showEncourage}
        onConfirm={() => {
          setShowEncourage(false);
          onComplete();
        }}
      />
    </>
  );
}

export default function MentalCardSummary3({
  onComplete,
  open,
  setOpen,
  afterClose,
}: CardSummaryPopupProps) {
  return (
    <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
      <MentalCardSummary3Content onComplete={onComplete} />
    </CardSummaryPopup>
  );
}
