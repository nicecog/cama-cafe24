import { format, parse } from "date-fns";
import { useAtomValue } from "jotai";
import {
  Activity,
  Bell,
  Calendar,
  ClipboardList,
  Heart,
  Stethoscope,
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

export default function CareTrackInfo() {
  const accountResult = useAtomValue(accountMeAtom);
  const hospitalInfo = useAtomValue(accountHospitalAtom);
  const accountMe = accountResult.data;

  const { alert, confirm } = useDialog();

  // 암정보 가이드 여정 컨텐츠 조회 API 호출
  const { data: careTrackInfo } = useCareTrackAppliedInfo();
  const { mutate: cancelTrack } = useCancelCareTrackService();

  //  open
  const [open, setOpen] = useState(false);
  // onClick
  const onClick = () => {
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
      {
        title: "안내",
        body: "암정보 가이드를 중단 하시겠습니까?",
      },
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
            },
            onError: () => {
              alert("중단 처리에 실패했습니다. 다시 시도해 주세요.");
            },
          },
        );
      },
    );
  };

  // 데이터 파싱 로직 추가 (useMemo 활용)
  const parsedData = useMemo(() => {
    if (!careTrackInfo) return null;
    try {
      const disease = JSON.parse(careTrackInfo.disease);
      const interest = JSON.parse(careTrackInfo.interest);
      return { disease, interest };
    } catch (e) {
      console.error("Data parsing error:", e);
      return null;
    }
  }, [careTrackInfo]);

  // 날짜 파싱 및 포맷팅 (yyyy.MM.dd)
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

  return (
    <>
      <button
        className="relative overflow-hidden bg-white rounded-2xl p-5 border border-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 w-full text-left group"
        onClick={onClick}
      >
        {/* Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
              <Bell size={24} fill="currentColor" className="opacity-80" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {careTrackInfo.diseaseName}
                </h3>
                {/* <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                가이드설정중
              </span> */}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-400 font-medium">
                  가이드 설정일
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-[11px] font-bold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100/50 tabular-nums">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium font-Pretendard">
                암정보 가이드가 진행중 입니다.
              </p>
            </div>
          </div>
          <MotionProgress
            value={Number(careTrackInfo.process.toFixed(1))}
            suffix="%"
            className="w-full"
          />
        </div>
      </button>
      <Popup open={open} setOpen={setOpen} title="암정보 가이드 설정 정보">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col px-5 py-3 space-y-6 hide-scrollbar">
            {/* 1. 핵심 요약 카드 (Primary 강조) */}
            <section className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl px-5 py-3.5 shadow-lg shadow-primary/20 relative ">
              {/* 장식용 서클 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

              <h4 className="text-base font-bold text-white mb-3 flex items-center  font-jalnan gap-5 justify-between">
                나의 맞춤 가이드 요약
                <img src={HeadImg} alt="head" className="w-14 h-14" />
              </h4>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                {/* 진행 기간 타일 */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={12} className="text-white/70" />
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                      진행 기간
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white leading-none">
                      {careTrackInfo.days}
                    </span>
                    <span className="text-[10px] font-bold text-white/80">
                      일
                    </span>
                  </div>
                </div>

                {/* 암치료 시기 타일 */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={12} className="text-white/70" />
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                      암치료 시기
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedData.disease.diseaseTreatment.map((t: any) => (
                      <span
                        key={t.seq}
                        className="text-lg font-black text-white leading-none"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 나의 설정 상세 (카드 내부로 통합) */}
              <div className="mt-4 space-y-2 relative z-10">
                <div className="h-[1px] bg-white/10 w-full my-3" />
                <Each
                  of={parsedData.disease.diseaseOption}
                  render={(option: any) => (
                    <div className="flex items-center justify-between py-1.5 group">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                          {option.groupName === "암 종류" ? (
                            <Stethoscope size={14} />
                          ) : (
                            <ClipboardList size={14} />
                          )}
                        </div>
                        <span className="text-xs font-medium text-white/60 leading-none">
                          {option.groupName}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {option.optionName}
                      </span>
                    </div>
                  )}
                />
                <div className="h-[1px] bg-white/10 w-full mt-3 mb-4" />
              </div>

              {/* 추가: 진행률 프로그레스 바 (화이트 테마) */}
              <div className="mt-4 space-y-2 relative z-10">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[12px] text-white  font-bold uppercase tracking-wider">
                    가이드 달성률
                  </p>
                  <span className="text-xl font-black text-white leading-none">
                    {careTrackInfo.process.toFixed(1)}%
                  </span>
                </div>
                {/* 커스텀 화이트 프로그레스 바 직접 구현 (타입 에러 방지 및 가독성) */}
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden relative mt-2">
                  <motion.div
                    className="h-full bg-white rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(careTrackInfo.process, 100)}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 h-full w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="space-y-4 flex-1">
              <div className="flex items-center gap-2 px-1">
                <Heart size={18} className="text-primary" fill="currentColor" />
                <h4 className="text-base font-bold text-gray-900">관심 영역</h4>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {parsedData.interest.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Each
                  of={parsedData.interest}
                  render={(item: string) => (
                    <span className="px-3 py-1.5 rounded-lg bg-white text-gray-600 text-xs font-bold border border-gray-200">
                      {item}
                    </span>
                  )}
                />
              </div>
            </section>

            {/* 가이드 중단 버튼 */}
            <section className="pt-4 pb-2">
              <button
                type="button"
                onClick={onClickStopGuide}
                className="w-full py-4 rounded-2xl border border-gray-200 bg-white text-gray-400 text-sm font-bold transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-[0.98]"
              >
                암정보 가이드 중단
              </button>
            </section>
          </div>
        </div>
      </Popup>
    </>
  );
}
