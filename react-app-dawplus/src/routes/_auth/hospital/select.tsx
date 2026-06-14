import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { CheckCircle2, MapPin } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import type { HospitalListItem } from "@/apis/types";
import hospitalImage from "@/assets/images/character/char1.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Button } from "@/components/ui/Button";
import { useApplyHospitalService } from "@/hooks/mutations";
import { useHospitalList } from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
import { queryClient, queryKeys } from "@/lib/queryClient";

export const Route = createFileRoute("/_auth/hospital/select")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: SelectHospitalPage,
});

function SelectHospitalPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { toast } = useToast();
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const { data, isLoading, isError } = useHospitalList();
  const applyHospitalService = useApplyHospitalService();
  const [selectedHospitalSeq, setSelectedHospitalSeq] = React.useState<
    number | null
  >(null);

  const hospitals = React.useMemo(() => data?.response ?? [], [data?.response]);
  const selectedHospital = React.useMemo(
    () =>
      hospitals.find((hospital) => hospital.seq === selectedHospitalSeq) ??
      null,
    [hospitals, selectedHospitalSeq],
  );

  const handleSubmit = async () => {
    if (!accountMe?.seq) {
      toast({
        variant: "destructive",
        title: "계정 정보 확인 필요",
        description: "로그인 정보를 다시 확인해 주세요.",
      });
      return;
    }

    if (!selectedHospital) {
      toast({
        variant: "destructive",
        title: "병원 선택 필요",
        description: "진료 중인 병원을 먼저 선택해 주세요.",
      });
      return;
    }

    applyHospitalService.mutate(
      {
        hospitalSeq: selectedHospital.seq,
        acSeq: accountMe.seq,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.webview.account.hospital(String(accountMe.seq)),
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.hospital.serviceCheck(accountMe.seq),
          });
          toast({
            title: "병원 연결 완료",
            description: `${selectedHospital.name} 선택이 저장되었습니다.`,
          });

          const target = search.redirect?.trim();
          if (target) {
            await navigate({ href: target });
            return;
          }

          await navigate({ to: import.meta.env.VITE_DEFAULT_PAGE });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "병원 연결 실패",
            description:
              error instanceof Error
                ? error.message
                : "병원 연결 처리 중 오류가 발생했습니다.",
          });
        },
      },
    );
  };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#edf6f1_0%,#f7fbf9_42%,#f8f6f1_100%)] px-5 pb-28 pt-6 text-slate-900">
      <div className="absolute inset-x-0 top-0 h-[42vh] bg-[radial-gradient(circle_at_top_right,rgba(67,160,111,0.16),transparent_48%),radial-gradient(circle_at_top_left,rgba(255,181,71,0.14),transparent_40%)]" />
      <div className="absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-white/45 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex flex-col items-center pt-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-800">
            CAMA+
          </h1>
        </div>

        <div className="relative flex h-[clamp(132px,21vh,190px)] items-end justify-center px-2 pt-2">
          <div className="absolute inset-x-12 bottom-3 h-12 rounded-full bg-primary/10 blur-2xl" />
          <img
            src={hospitalImage}
            alt="Hospital Character"
            className="relative h-full w-auto max-w-[200px] object-contain drop-shadow-[0_16px_32px_rgba(69,101,84,0.18)]"
          />
        </div>

        <div className="relative mt-10 rounded-lg border border-primary bg-white p-[1px] shadow-[0_16px_36px_rgba(58,78,66,0.10)]">
          <div className="absolute inset-x-6 -top-3 h-6 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-lg border border-white bg-white">
            <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(96,165,126,0.08),transparent)]" />
            <div className="relative flex flex-col gap-10 px-5 pb-5 pt-4">
              <div className="mb-4 flex flex-col items-center justify-center text-center">
                <div className="mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
                <h2 className="text-[1.2rem] font-bold tracking-tight text-slate-800">
                  병원을 선택해 주세요
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  병원 연결이 완료되면 바로 홈으로 이동합니다.
                </p>
              </div>

              {isLoading ? (
                <div className="rounded-md bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  병원 목록을 불러오는 중...
                </div>
              ) : isError ? (
                <div className="rounded-md bg-red-50 px-4 py-10 text-center text-sm text-red-500">
                  병원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
                </div>
              ) : hospitals.length === 0 ? (
                <div className="rounded-md bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  선택 가능한 병원 정보가 없습니다.
                </div>
              ) : (
                <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
                  {hospitals.map((hospital) => {
                    const selected = hospital.seq === selectedHospitalSeq;
                    return (
                      <HospitalRow
                        key={hospital.seq}
                        hospital={hospital}
                        selected={selected}
                        onSelect={() => setSelectedHospitalSeq(hospital.seq)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 px-5 pb-5 pt-3">
        <div className="mx-auto w-full max-w-md rounded-lg border border-white bg-white p-3 shadow-[0_18px_44px_rgba(58,78,66,0.14)]">
          <Button
            type="button"
            disabled={!selectedHospital || applyHospitalService.isPending}
            onClick={handleSubmit}
            className="h-14 w-full rounded-md text-base font-bold shadow-[0_14px_28px_rgba(92,148,111,0.24)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {applyHospitalService.isPending
              ? "연결 처리 중..."
              : selectedHospital
                ? `${selectedHospital.name} 선택 완료`
                : "병원을 선택해 주세요"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function HospitalRow({
  hospital,
  selected,
  onSelect,
}: {
  hospital: HospitalListItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-md border px-4 py-4 text-left transition ${
        selected
          ? "border-primary/40 bg-primary/8 shadow-[0_12px_30px_rgba(92,148,111,0.16)]"
          : "border-slate-200/80 bg-white hover:border-primary/25 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="truncate text-base font-bold text-slate-800">
            {hospital.name}
          </p>
          <div className="flex items-start gap-2 text-sm text-slate-500">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span className="line-clamp-2">
              {hospital.address?.trim() || "주소 정보 없음"}
            </span>
          </div>
        </div>
        <div
          className={`mt-0.5 shrink-0 rounded-full p-1 ${
            selected ? "text-primary" : "text-slate-300"
          }`}
        >
          <CheckCircle2 className="size-5" />
        </div>
      </div>
    </button>
  );
}
