import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import loginImage from "@/assets/images/character/login.png";
import { useAuth } from "@/auth";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePatientSession } from "@/hooks/auth/usePatientSession";
import { useToast } from "@/hooks/use-toast";
import { validateLoginId } from "@/utils/patientAuthValidation";

export const Route = createFileRoute("/login/credentials")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: LoginCredentialsPage,
});

function LoginCredentialsPage() {
  const auth = useAuth();
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { toast } = useToast();
  const { completePatientLogin, handleLoginError } = usePatientSession();
  const [submitting, setSubmitting] = React.useState(false);
  const [pwVisible, setPwVisible] = React.useState(false);
  const [loginId, setLoginId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{
    loginId?: string | null;
    password?: string | null;
  }>({});

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;

    const nextErrors = {
      loginId: validateLoginId(loginId),
      password: password.trim() ? null : "비밀번호를 입력해 주세요.",
    };
    setErrors(nextErrors);
    if (nextErrors.loginId || nextErrors.password) {
      return;
    }

    setSubmitting(true);
    try {
      const route = await completePatientLogin(loginId, password);
      await router.invalidate();
      const target =
        search.redirect ||
        (route === "selectInfo"
          ? "/hospital/select"
          : import.meta.env.VITE_DEFAULT_PAGE);
      if (route === "selectInfo" && search.redirect) {
        await navigate({
          to: "/hospital/select",
          search: { redirect: search.redirect },
        });
        return;
      }
      await navigate({ to: target });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: handleLoginError(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.isAuthReady) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f2f7f5] text-slate-900">
        로딩 중...
      </section>
    );
  }

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#eef6f1_0%,#f7fbf8_40%,#fbfaf6_100%)] text-slate-900">
      <div className="absolute inset-x-0 top-0 h-[44vh] bg-[radial-gradient(circle_at_top_right,rgba(67,160,111,0.16),transparent_48%),radial-gradient(circle_at_top_left,rgba(255,181,71,0.14),transparent_40%)]" />
      <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-white/55 blur-3xl" />

      <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col  px-4 pb-24 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mt-auto rounded-2xl border border-[#d9e4dd] bg-white px-4 py-4 shadow-[0_18px_38px_rgba(58,78,66,0.08)]">
          <div className="relative overflow-hidden rounded-[1rem] border border-[#e3ebe6] bg-[linear-gradient(180deg,#f8fbf9_0%,#f3f8f5_100%)] px-3 py-3 flex flex-col items-center">
            <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(96,165,126,0.10),transparent)]" />
            <div className="relative flex items-center justify-between w-full border-b border-dashed border-[#d8e2dc] pb-1">
              <span className="text-[11px] font-bold tracking-[0.18em] text-primary/70 uppercase">
                Cama+
              </span>
              <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-slate-400">
                Login
              </span>
            </div>

            <div className="relative mt-2">
              <div className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-primary/10 blur-xl" />
              <img
                src={loginImage}
                alt="Login Character"
                className="relative h-full w-auto max-w-[170px] object-contain drop-shadow-[0_18px_32px_rgba(69,101,84,0.14)] animate-float"
              />
            </div>

            <div className="mt-3 flex flex-col items-center gap-2 text-center">
              <div className="h-px w-12 bg-[linear-gradient(90deg,transparent,rgba(96,165,126,0.45),transparent)]" />
              <p className="text-[15px] font-semibold tracking-[-0.03em] text-slate-700">
                계정 정보를 입력해 로그인해 주세요
              </p>
            </div>
          </div>

          <form className="mt-5 flex w-full flex-col gap-3" onSubmit={onSubmit}>
            <div className="space-y-3">
              <AuthField
                label="아이디"
                value={loginId}
                name="loginId"
                autoComplete="username"
                placeholder="아이디 입력"
                error={errors.loginId}
                className="rounded-[0.95rem] border border-[#dfe7e1] bg-[#fbfdfc] px-5 shadow-none transition focus-within:border-primary/35"
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setErrors((prev) => ({ ...prev, loginId: null }));
                }}
              />

              <label className="block space-y-1.5">
                <span className="ml-1 text-sm font-semibold text-slate-500">
                  비밀번호
                </span>
                <div className="relative">
                  <Input
                    value={password}
                    type={pwVisible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    className="h-14 w-full rounded-[0.95rem] border border-[#dfe7e1] bg-[#fbfdfc] px-5 pr-12 text-lg text-slate-900 placeholder:text-slate-400 shadow-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 md:text-lg"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: null }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPwVisible((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={pwVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {pwVisible ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="ml-1 text-sm font-medium text-red-500">
                    {errors.password}
                  </p>
                ) : null}
              </label>
            </div>
          </form>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-[0.95rem] border-[#d9e4dd] bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() =>
                navigate({
                  to: "/signup",
                  search: search.redirect ? { redirect: search.redirect } : {},
                })
              }
            >
              회원가입
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-[0.95rem] border-[#d9e4dd] bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() =>
                navigate({
                  to: "/find-account",
                  search: search.redirect ? { redirect: search.redirect } : {},
                })
              }
            >
              ID/PW 찾기
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            disabled={submitting}
            onClick={() => void onSubmit()}
            className="h-12 w-full rounded-[0.95rem] text-base font-bold shadow-[0_14px_28px_rgba(92,148,111,0.22)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </Button>
        </div>
      </div>
    </section>
  );
}
