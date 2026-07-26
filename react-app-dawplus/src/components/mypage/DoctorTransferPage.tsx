import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  Bluetooth,
  CheckCircle2,
  Loader2,
  QrCode,
  RotateCcw,
  Send,
  TabletSmartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getConsultationInquiries } from "@/apis/api/webview/consultationInquiry";
import { fetchCareTrackStepList } from "@/apis/api/webview/track";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Button } from "@/components/ui/Button";
import { useMarkConsultationInquiriesTransmitted } from "@/hooks/mutations/webview";
import { useConsultationInquiries } from "@/hooks/queries/webview";
import { useCareTrackStepList } from "@/hooks/queries/webview/useTrackQueries";
import { syncTodaySteps } from "@/lib/health/syncTodaySteps";
import { queryKeys } from "@/lib/queryClient";
import { buildTabletHealthPayload } from "@/lib/tablet/buildTabletHealthPayload";
import {
  parseTabletQrPayload,
  type TabletHealthDataPayload,
  type TabletQrPayload,
} from "@/lib/tablet/tabletTransfer.types";
import { cn } from "@/lib/utils";
import {
  isReactNativeWebView,
  requestNativeStepCount,
  requestNativeTabletHealthDataSend,
  requestNativeTabletQrScan,
} from "@/lib/webview/nativeBridgeClient";

type Step = "intro" | "scanned" | "sending" | "done" | "error";

type DoctorTransferPageProps = {
  onClose?: () => void;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}

export function DoctorTransferPage({ onClose }: DoctorTransferPageProps) {
  const queryClient = useQueryClient();
  const { data: account } = useAtomValue(accountMeAtom);
  const accountSeq = String(account?.seq ?? "");
  const { data: stepHistory } = useCareTrackStepList(
    accountSeq,
    Boolean(account?.seq),
  );
  const { data: consultationInquiries } = useConsultationInquiries(
    accountSeq,
    Boolean(account?.seq),
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

  const handleScanQr = async () => {
    setErrorMessage(null);
    if (!inApp) {
      setErrorMessage("CAMA Plus 앱에서만 QR 스캔이 가능합니다.");
      setStep("error");
      return;
    }

    const scan = await requestNativeTabletQrScan();
    if (!scan.ok) {
      setErrorMessage(
        scan.error === "CANCELLED"
          ? "QR 스캔이 취소되었습니다."
          : "QR 스캔에 실패했습니다. 카메라와 블루투스 권한을 확인해 주세요.",
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
      setErrorMessage("CAMA Tablet QR이 아닙니다.");
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

    try {
      await syncTodaySteps(account.seq);

      const freshAccountSeq = String(account.seq);
      const [freshStepList, freshInquiries] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: queryKeys.webview.track.stepList(freshAccountSeq),
          queryFn: () => fetchCareTrackStepList(freshAccountSeq),
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.webview.consultationInquiry.list(freshAccountSeq),
          queryFn: () => getConsultationInquiries(freshAccountSeq),
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

      const result = await requestNativeTabletHealthDataSend(
        qrPayload,
        payload,
      );

      if (!result.ok) {
        setErrorMessage(
          result.error === "TIMEOUT"
            ? "태블릿 연결 시간이 초과되었습니다. QR 화면이 켜져 있는지 확인해 주세요."
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
          setErrorMessage(
            "자료는 전송됐지만 문의사항 전송여부 갱신에 실패했습니다.",
          );
        }
      }

      setStep("done");
    } catch {
      setErrorMessage(
        "자료 전송 준비 중 오류가 발생했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
      );
      setStep("error");
    }
  };

  const handleReset = () => {
    setStep("intro");
    setQrPayload(null);
    setHealthPreview(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-gray-50 to-white px-4 pb-6 pt-4">
      <section className="mb-6 overflow-hidden rounded-2xl bg-primary px-5 py-4 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80">진료 자료</p>
            <p className="mt-1 text-xl font-black leading-none">
              의사앱으로 전송
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <TabletSmartphone className="h-9 w-9" />
          </div>
        </div>
      </section>

      {step === "intro" ? (
        <div className="space-y-5">
          <div className="rounded-xl bg-white px-4 shadow-sm">
            <InfoRow label="전송 방식" value="QR 스캔 후 블루투스" />
            <InfoRow label="걸음수" value="최근 기록 포함" />
            <InfoRow
              label="문의사항"
              value={`미전송 ${pendingInquiries.length}건`}
            />
          </div>

          <Button
            type="button"
            className="h-12 w-full gap-2 rounded-xl text-sm font-bold shadow-md"
            onClick={() => void handleScanQr()}
          >
            <QrCode size={18} />
            QR 코드 스캔
          </Button>

          {!inApp ? (
            <p className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
              <Bluetooth size={14} />
              브라우저에서는 QR·BLE 전송이 지원되지 않습니다.
            </p>
          ) : null}
        </div>
      ) : null}

      {step === "scanned" && qrPayload ? (
        <div className="space-y-5">
          <div className="rounded-xl bg-white px-4 shadow-sm">
            <InfoRow label="연결 대상" value={qrPayload.deviceName} />
            <InfoRow
              label="오늘 걸음수"
              value={
                healthPreview?.steps != null
                  ? `${healthPreview.steps.toLocaleString()} 걸음`
                  : "-"
              }
            />
            <InfoRow
              label="문의사항"
              value={`미전송 ${healthPreview?.inquiries?.length ?? 0}건`}
            />
          </div>

          <Button
            type="button"
            className="h-12 w-full gap-2 rounded-xl text-sm font-bold shadow-md"
            onClick={() => void handleSend()}
          >
            <Send size={18} />
            태블릿으로 전송
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 rounded-xl"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            다시 스캔
          </Button>
        </div>
      ) : null}

      {step === "sending" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-gray-800">전송 중입니다</p>
          <p className="text-xs font-medium text-gray-500">
            태블릿 QR 화면을 켜 두세요.
          </p>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-primary" />
          <div>
            <p className="font-bold text-gray-900">전송 완료</p>
            <p className="mt-1 text-sm text-gray-600">
              태블릿에서 자료를 확인해 주세요.
            </p>
            {errorMessage ? (
              <p className="mt-2 text-xs text-orange-700">{errorMessage}</p>
            ) : null}
          </div>
          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl"
              onClick={handleReset}
            >
              다시 전송
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-xl"
              onClick={onClose}
            >
              닫기
            </Button>
          </div>
        </div>
      ) : null}

      {step === "error" ? (
        <div
          className={cn(
            "rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700",
          )}
        >
          {errorMessage}
          <Button
            type="button"
            variant="outline"
            className="mt-4 h-11 w-full rounded-xl border-red-200"
            onClick={handleReset}
          >
            다시 시도
          </Button>
        </div>
      ) : null}
    </div>
  );
}
