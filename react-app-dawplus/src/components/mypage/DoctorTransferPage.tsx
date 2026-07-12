import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  Bluetooth,
  CheckCircle2,
  Loader2,
  QrCode,
  Send,
  TabletSmartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getConsultationInquiries } from "@/apis/api/webview/consultationInquiry";
import { fetchCareTrackStepList } from "@/apis/api/webview/track";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Button } from "@/components/ui/Button";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { useMarkConsultationInquiriesTransmitted } from "@/hooks/mutations/webview";
import { useConsultationInquiries } from "@/hooks/queries/webview";
import { useCareTrackStepList } from "@/hooks/queries/webview/useTrackQueries";
import { syncTodaySteps } from "@/lib/health/syncTodaySteps";
import { buildTabletHealthPayload } from "@/lib/tablet/buildTabletHealthPayload";
import { queryKeys } from "@/lib/queryClient";
import {
  parseTabletQrPayload,
  type TabletHealthDataPayload,
  type TabletQrPayload,
} from "@/lib/tablet/tabletTransfer.types";
import {
  isReactNativeWebView,
  requestNativeStepCount,
  requestNativeTabletHealthDataSend,
  requestNativeTabletQrScan,
} from "@/lib/webview/nativeBridgeClient";
import { cn } from "@/lib/utils";

type Step = "intro" | "scanned" | "sending" | "done" | "error";

export function DoctorTransferPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: account } = useAtomValue(accountMeAtom);
  const { data: stepHistory } = useCareTrackStepList(
    String(account?.seq ?? ""),
    !!account?.seq,
  );
  const { data: consultationInquiries } = useConsultationInquiries(
    String(account?.seq ?? ""),
    !!account?.seq,
  );
  const markTransmitted = useMarkConsultationInquiriesTransmitted();

  const [step, setStep] = useState<Step>("intro");
  const [qrPayload, setQrPayload] = useState<TabletQrPayload | null>(null);
  const [healthPreview, setHealthPreview] =
    useState<TabletHealthDataPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inApp = isReactNativeWebView();

  const pendingInquiries = useMemo(
    () => (consultationInquiries ?? []).filter((item) => !item.transmitted),
    [consultationInquiries],
  );

  const previewJson = useMemo(() => {
    if (!healthPreview) return "";
    return JSON.stringify(healthPreview, null, 2);
  }, [healthPreview]);

  const handleScanQr = async () => {
    setErrorMessage(null);
    if (!inApp) {
      setErrorMessage("CAMA Plus 앱(WebView)에서만 QR 스캔이 가능합니다.");
      setStep("error");
      return;
    }

    const scan = await requestNativeTabletQrScan();
    if (!scan.ok) {
      setErrorMessage(
        scan.error === "CANCELLED"
          ? "QR 스캔이 취소되었습니다."
          : "QR 스캔에 실패했습니다. 카메라·블루투스 권한을 확인해 주세요.",
      );
      setStep("error");
      return;
    }

    if (!scan.data.raw) {
      setErrorMessage("QR 스캔 결과가 비어 있습니다.");
      setStep("error");
      return;
    }

    const parsed = parseTabletQrPayload(scan.data.raw);
    if (!parsed) {
      setErrorMessage(
        "CAMA Tablet QR이 아닙니다. 태블릿에서 「QR 생성하기」 화면의 코드를 스캔해 주세요.",
      );
      setStep("error");
      return;
    }

    const steps = await requestNativeStepCount();
    const payload = buildTabletHealthPayload({
      patientName: account?.name,
      patientId: account?.seq,
      todaySteps: steps,
      stepHistory: stepHistory ?? undefined,
      inquiries: pendingInquiries,
    });
    setQrPayload(parsed);
    setHealthPreview(payload);
    setStep("scanned");
  };

  const handleSend = async () => {
    if (!qrPayload || !healthPreview || !account?.seq) return;
    setStep("sending");
    setErrorMessage(null);

    await syncTodaySteps(account.seq);

    const accountSeq = String(account.seq);
    const [freshStepList, freshInquiries] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: queryKeys.webview.track.stepList(accountSeq),
        queryFn: () => fetchCareTrackStepList(accountSeq),
      }),
      queryClient.fetchQuery({
        queryKey: queryKeys.webview.consultationInquiry.list(accountSeq),
        queryFn: () => getConsultationInquiries(accountSeq),
      }),
    ]);
    const freshSteps = await requestNativeStepCount();
    const pendingToSend = (freshInquiries.response ?? []).filter(
      (item) => !item.transmitted,
    );

    const payload = buildTabletHealthPayload({
      patientName: account.name,
      patientId: account.seq,
      todaySteps: freshSteps,
      stepHistory: freshStepList.response ?? stepHistory ?? undefined,
      inquiries: pendingToSend,
    });

    const result = await requestNativeTabletHealthDataSend(qrPayload, payload);

    if (!result.ok) {
      setErrorMessage(
        result.error === "TIMEOUT"
          ? "태블릿 연결 시간이 초과되었습니다. 태블릿 QR 화면이 켜져 있는지 확인해 주세요."
          : "자료 전송에 실패했습니다. 블루투스를 켜고 다시 시도해 주세요.",
      );
      setStep("error");
      return;
    }

    if (pendingToSend.length > 0) {
      try {
        await markTransmitted.mutateAsync({
          acSeq: account.seq,
          seqs: pendingToSend.map((item) => item.seq),
        });
      } catch {
        // BLE 전송은 성공했으므로 전송완료 갱신 실패는 사용자에게 경고만 표시
        setErrorMessage(
          "자료는 전송되었으나 문의사항 전송여부 갱신에 실패했습니다. 문의사항 화면에서 확인해 주세요.",
        );
      }
    }

    setStep("done");
  };

  const handleReset = () => {
    setStep("intro");
    setQrPayload(null);
    setHealthPreview(null);
    setErrorMessage(null);
  };

  return (
    <MypageSubPageLayout
      title="의사앱 자료전송"
      backTo="/mypage"
      className="pb-[calc(env(safe-area-inset-bottom,0px)+5rem)]"
    >
      <div className="flex flex-col gap-5 p-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <TabletSmartphone className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">
                CAMA Tablet과 블루투스로 자료를 전송합니다
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed">
                <li>태블릿 앱에서 「QR 생성하기」를 눌러 QR을 표시합니다.</li>
                <li>아래 버튼으로 QR을 스캔합니다.</li>
                <li>
                  걸음수·미전송 문의사항을 확인한 뒤 블루투스로 보냅니다.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {step === "intro" && (
          <Button
            type="button"
            className="h-12 w-full gap-2 text-base"
            onClick={() => void handleScanQr()}
          >
            <QrCode size={20} />
            QR 코드 스캔
          </Button>
        )}

        {step === "scanned" && qrPayload && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">연결 대상</p>
              <p className="mt-1 font-semibold text-gray-900">
                {qrPayload.deviceName}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="text-xs font-medium text-gray-500">포함 문의사항</p>
              <p className="mt-1 text-gray-900">
                미전송 {healthPreview?.inquiries?.length ?? 0}건
              </p>
            </div>

            {healthPreview && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  전송 예정 JSON
                </p>
                <pre className="max-h-48 overflow-auto text-[10px] leading-relaxed text-gray-800">
                  {previewJson}
                </pre>
              </div>
            )}

            <Button
              type="button"
              className="h-12 w-full gap-2 text-base"
              onClick={() => void handleSend()}
            >
              <Send size={18} />
              태블릿으로 전송
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleReset}
            >
              QR 다시 스캔
            </Button>
          </div>
        )}

        {step === "sending" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-gray-800">
              블루투스로 연결 중…
            </p>
            <p className="text-xs text-gray-500">
              태블릿 QR 화면을 켜 두세요.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">전송 완료</p>
              <p className="mt-1 text-sm text-gray-600">
                태블릿 대시보드에서 자료를 확인하세요.
              </p>
              {errorMessage ? (
                <p className="mt-2 text-xs text-amber-700">{errorMessage}</p>
              ) : null}
            </div>
            <Button type="button" variant="outline" onClick={handleReset}>
              다시 전송
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: "/mypage" })}
            >
              마이페이지로
            </Button>
          </div>
        )}

        {step === "error" && (
          <div
            className={cn(
              "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800",
            )}
          >
            {errorMessage}
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full border-red-300"
              onClick={handleReset}
            >
              다시 시도
            </Button>
          </div>
        )}

        {!inApp && step === "intro" && (
          <p className="flex items-center gap-2 text-xs text-amber-700">
            <Bluetooth size={14} />
            브라우저에서는 QR·BLE 전송이 지원되지 않습니다. CAMA Plus 앱을
            사용해 주세요.
          </p>
        )}
      </div>
    </MypageSubPageLayout>
  );
}
