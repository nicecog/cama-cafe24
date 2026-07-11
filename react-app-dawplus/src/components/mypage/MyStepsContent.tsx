import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Activity, Loader2 } from "lucide-react";
import { useAtomValue } from "jotai";
import { useState } from "react";
import {
  Bar,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import "@/assets/fonts/jalnan-gothic.css";
import activity from "@/assets/images/character/activity.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Button } from "@/components/ui/Button";
import IncrementNumber from "@/components/effect/IncrementNumber";
import { useCareTrackStepList } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { useToast } from "@/hooks/use-toast";
import { syncHeartRate } from "@/lib/health/syncHeartRate";
import { requestNativeOpenHealthConnectSettings } from "@/lib/webview/rnBridge";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

type MyStepsContentProps = {
  /** false면 API 조회 비활성 (팝업 닫힘) */
  active?: boolean;
};

/** cama-billive StepInfoScreen 본문 */
export function MyStepsContent({ active = true }: MyStepsContentProps) {
  const { toast } = useToast();
  const { confirm } = useDialog();
  const inApp = isReactNativeWebView();
  const [healthSyncing, setHealthSyncing] = useState(false);
  const { data: accountData } = useAtomValue(accountMeAtom);
  const accountSeq = accountData?.seq;

  const { data: stepData, isLoading } = useCareTrackStepList(
    String(accountSeq ?? ""),
    active && !!accountSeq,
  );

  const chartData = stepData
    ?.sort(
      (a, b) =>
        new Date(a.executionDate).getTime() -
        new Date(b.executionDate).getTime(),
    )
    .map((step) => {
      const date = new Date(step.executionDate);
      return {
        date: format(date, "M.d"),
        steps: step.stepNum,
        fullDate: format(date, "yyyy년 M월 d일", { locale: ko }),
        dayOfWeek: format(date, "EEE", { locale: ko }),
      };
    });

  const average = chartData
    ? Math.round(
        chartData.reduce((sum, item) => sum + item.steps, 0) / chartData.length,
      )
    : 0;

  const chartDisplayData = chartData?.slice(-7);
  const displayMaxSteps = chartDisplayData
    ? Math.max(...chartDisplayData.map((d) => d.steps))
    : 0;
  const chartDataWithMax = chartDisplayData?.map((item) => ({
    ...item,
    maxSteps: displayMaxSteps,
  }));
  const latestSteps = chartData?.[chartData.length - 1]?.steps ?? 0;

  const promptOpenHealthSettings = (detail: string) => {
    void confirm(
      {
        title: "헬스케어 연동이 필요합니다",
        body: `${detail}\n\n해당 설정화면으로 이동하시겠습니까?`,
        actionButton: "이동",
        cancelButton: "취소",
      },
      () => {
        void requestNativeOpenHealthConnectSettings();
      },
    );
  };

  const handleHealthCareSync = async () => {
    if (!accountSeq) {
      return;
    }
    setHealthSyncing(true);
    try {
      const result = await syncHeartRate(accountSeq, { daysBack: 7 });
      if (result.ok) {
        toast({
          description: `심박수 ${result.saved}건을 서버에 연동했습니다.`,
        });
        return;
      }
      if (result.reason === "permission_denied") {
        promptOpenHealthSettings(
          "Health Connect에서 심박수 읽기 권한을 허용해 주세요.",
        );
        return;
      }
      if (result.reason === "no_samples") {
        promptOpenHealthSettings(
          "연동할 심박 데이터가 없습니다. Health Connect에 심박 기록이 있는지 확인해 주세요.",
        );
        return;
      }
      if (result.reason === "unavailable") {
        promptOpenHealthSettings(
          "Health Connect 앱 설치 또는 업데이트가 필요합니다.",
        );
        return;
      }
      toast({
        description: "헬스케어 연동 중 오류가 발생했습니다.",
      });
    } finally {
      setHealthSyncing(false);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="relative bg-primary p-6 pb-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={activity}
              alt="activity"
              className="w-20 h-20 object-contain relative z-10"
            />
            <div className="flex-1">
              <p className="text-lg font-medium text-white/90 font-jalnan">
                총 걸음수
              </p>
              <p className="text-4xl font-black font-jalnan leading-tight">
                {chartData ? (
                  <>
                    <IncrementNumber
                      target={chartData.reduce(
                        (sum, item) => sum + item.steps,
                        0,
                      )}
                      duration={2000}
                    />
                    <span className="text-2xl ml-1 font-medium"> 걸음</span>
                  </>
                ) : (
                  "0"
                )}
              </p>
            </div>
          </div>
          {chartData && chartData.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/95 rounded-2xl py-3 text-center text-gray-900">
                <p className="text-sm text-sky-600 font-semibold">평균</p>
                <p className="text-xl font-bold font-jalnan">
                  <IncrementNumber target={average} duration={2000} /> 걸음
                </p>
              </div>
              <div className="bg-white/95 rounded-2xl py-3 text-center text-gray-900">
                <p className="text-sm text-indigo-600 font-semibold">최고</p>
                <p className="text-xl font-bold font-jalnan">
                  <IncrementNumber
                    target={Math.max(...chartData.map((d) => d.steps))}
                    duration={2000}
                  />{" "}
                  걸음
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        {isLoading ? (
          <p className="py-12 text-center text-gray-600">데이터를 불러오는 중...</p>
        ) : !chartData || chartData.length === 0 ? (
          <p className="py-12 text-center text-gray-600">
            걸음수 데이터가 없습니다
          </p>
        ) : (
          <>
            <div className="border-2 border-primary rounded-xl shadow-sm mb-4 pt-14 font-jalnanGothic relative">
              <div className="absolute top-4 left-5 z-10 font-jalnan">
                <p className="text-base-fixed text-gray-600 mb-1">최근 걸음수</p>
                <p className="text-3xl-fixed font-bold text-gray-900">
                  {latestSteps.toLocaleString()}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart
                  data={chartDataWithMax}
                  margin={{ top: 0, right: 35, left: 20, bottom: 0 }}
                  barGap={-40}
                  barCategoryGap={0}
                >
                  <XAxis dataKey="dayOfWeek" tickLine={false} axisLine={false} height={50} />
                  <YAxis hide />
                  <Bar dataKey="maxSteps" fill="#E5E7EB" radius={[25, 25, 25, 25]} maxBarSize={14} />
                  <Bar dataKey="steps" fill="#0066CC" radius={[25, 25, 25, 25]} maxBarSize={14} />
                  <ReferenceLine
                    y={average}
                    stroke="tomato"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                    label={{ value: "평균", position: "right", fill: "#374151", fontSize: 12 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-gray-900">
                      {item.date} ({item.dayOfWeek})
                    </p>
                    <p className="text-[9px] text-gray-400">{item.fullDate}</p>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {item.steps.toLocaleString()} 걸음
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {inApp && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-3 text-sm text-gray-600">
              Samsung Health·Google Fit 등에 저장된 심박수를 Health Connect를 통해
              서버에 연동합니다.
            </p>
            <Button
              type="button"
              className="h-12 w-full gap-2 text-base"
              disabled={healthSyncing || !accountSeq}
              onClick={() => void handleHealthCareSync()}
            >
              {healthSyncing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Activity className="h-5 w-5" />
              )}
              헬스케어 연동
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
