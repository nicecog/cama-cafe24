import { format, parse } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  Bell,
  Heart,
} from "lucide-react";
import * as motion from "motion/react-client";
import { useMemo, useState } from "react";
import HeadImg from "@/assets/images/character/head/type5.png";
import { accountHospitalAtom, accountMeAtom } from "@/atoms/accountAtoms";
import { Each } from "@/components/common/Each";
import Popup from "@/components/ui/Popup";
import MotionProgress from "@/components/ui/Progress/MotionProgress";
import { useCancelCareTrackService } from "@/hooks/mutations/webview/useTrackMutations";
import { useCareTrackAppliedInfo } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";

type CareTrackInfoProps = {
  pageMode?: boolean;
  linkTo?: string;
};

export default function CareTrackInfo({
  pageMode = false,
  linkTo,
}: CareTrackInfoProps = {}) {
  const navigate = useNavigate();
  const accountResult = useAtomValue(accountMeAtom);
  const hospitalInfo = useAtomValue(accountHospitalAtom);
  const accountMe = accountResult.data;
  const { alert, confirm } = useDialog();
  const { data: careTrackInfo } = useCareTrackAppliedInfo();
  const { mutate: cancelTrack } = useCancelCareTrackService();
  const [open, setOpen] = useState(false);

  const onClick = () => {
    if (linkTo) {
      navigate({ to: linkTo });
      return;
    }
    setOpen(true);
  };

  const onClickStopGuide = () => {
    if (
      !hospitalInfo.data?.hospitalSeq ||
      !careTrackInfo?.seq ||
      !accountMe?.seq
    )
      return;

    confirm(
      { title: "안내", body: "암정보 가이드를 중단 하시겠습니까?" },
      () => {
        cancelTrack(
          {
            diseaseSeq: careTrackInfo?.seq,
            hospitalSeq: hospitalInfo.data?.hospitalSeq,
            acSeq: accountMe?.seq,
          },
          {
            onSuccess: () => {
              alert("가이드가 중단되었습니다.");
              setOpen(false);
              if (pageMode) navigate({ to: "/mypage" });
            },
            onError: () => {
              alert("중단 처리에 실패했습니다. 다시 시도해 주세요.");
            },
          },
        );
      },
    );
  };

  const parsedData = useMemo(() => {
    if (!careTrackInfo) return null;
    try {
      return {
        disease: JSON.parse(careTrackInfo.disease),
        interest: JSON.parse(careTrackInfo.interest),
      };
    } catch (e) {
      console.error("Data parsing error:", e);
      return null;
    }
  }, [careTrackInfo]);

  const formattedDate = useMemo(() => {
    if (!careTrackInfo?.trackCreatedAt) return "";
    try {
      const date = parse(
        careTrackInfo.trackCreatedAt,
        "yyyy-MM-dd HH:mm:ss",
        new Date(),
      );
      return format(date, "yyyy.MM.dd");
    } catch (_e) {
      return careTrackInfo.trackCreatedAt.split(" ")[0].replace(/-/g, ".");
    }
  }, [careTrackInfo?.trackCreatedAt]);

  if (!careTrackInfo || !parsedData) return null;

  const summaryCard = (
    <button
      type="button"
      className="relative overflow-hidden bg-white rounded-2xl p-5 border border-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full text-left group"
      onClick={pageMode ? undefined : onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Bell size={24} fill="currentColor" className="opacity-80" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {careTrackInfo.diseaseName}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            가이드 설정일 · {formattedDate}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">암정보 가이드가 진행중 입니다.</p>
      <MotionProgress
        value={Number(careTrackInfo.process.toFixed(1))}
        suffix="%"
        className="w-full"
      />
    </button>
  );

  const detailBody = (
    <div className="flex flex-col space-y-6">
      <section className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl px-5 py-3.5 shadow-lg relative">
        <h4 className="text-base font-bold text-white mb-3 flex items-center font-jalnan gap-5 justify-between">
          나의 맞춤 가이드 요약
          <img src={HeadImg} alt="head" className="w-14 h-14" />
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-[10px] text-white/70 font-bold">진행 기간</p>
            <p className="text-xl font-black text-white">{careTrackInfo.days}일</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-[10px] text-white/70 font-bold">암치료 시기</p>
            <div className="flex flex-wrap gap-1">
              {parsedData.disease.diseaseTreatment.map((t: { seq: number; name: string }) => (
                <span key={t.seq} className="text-lg font-black text-white">
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Each
            of={parsedData.disease.diseaseOption}
            render={(option: { groupName: string; optionName: string }) => (
              <div
                key={`${option.groupName}-${option.optionName}`}
                className="flex items-center justify-between py-1.5 text-white"
              >
                <span className="text-xs text-white/60">{option.groupName}</span>
                <span className="text-sm font-bold">{option.optionName}</span>
              </div>
            )}
          />
        </div>
        <div className="mt-4">
          <p className="text-xs text-white font-bold mb-1">가이드 달성률</p>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(careTrackInfo.process, 100)}%` }}
            />
          </div>
          <p className="text-right text-white font-black mt-1">
            {careTrackInfo.process.toFixed(1)}%
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Heart size={18} className="text-primary" fill="currentColor" />
          <h4 className="text-base font-bold text-gray-900">관심 영역</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <Each
            of={parsedData.interest}
            render={(item: string) => (
              <span className="px-3 py-1.5 rounded-lg bg-white text-gray-600 text-xs font-bold border">
                {item}
              </span>
            )}
          />
        </div>
      </section>

      <button
        type="button"
        onClick={onClickStopGuide}
        className="w-full py-4 rounded-2xl border border-gray-200 bg-white text-gray-400 text-sm font-bold hover:bg-red-50 hover:text-red-500"
      >
        암정보 가이드 중단
      </button>
    </div>
  );

  if (pageMode) {
    return detailBody;
  }

  return (
    <>
      {summaryCard}
      <Popup open={open} setOpen={setOpen} title="암정보 가이드 설정 정보">
        <div className="flex flex-col h-full px-5 py-3">{detailBody}</div>
      </Popup>
    </>
  );
}
