import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { useAuth } from "@/auth";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePatientSession } from "@/hooks/auth/usePatientSession";
import { useToast } from "@/hooks/use-toast";
import { validateLoginId } from "@/utils/patientAuthValidation";
import loginImage from "@/assets/images/character/login.png";

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
        (route === "selectInfo" ? "/home" : import.meta.env.VITE_DEFAULT_PAGE);
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
    <section className="h-[100dvh] bg-[#f2f7f5] text-slate-900 overflow-hidden relative flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Decorative background blurs */}
        <div className="absolute -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

        {/* Flexible Image Wrapper (Shrinks if screen is small) */}
        <div className="flex justify-center items-center flex-1 min-h-[60px] px-6 py-2 z-10 relative">
          <img
            src={loginImage}
            alt="Login Character"
            className="w-full h-full max-w-[260px] object-contain drop-shadow-sm"
          />
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.03)] flex-none flex flex-col px-6 pt-6 pb-6 z-10 relative md:rounded-[2.5rem] md:mb-6 md:mx-4 md:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="h-1 w-12 bg-slate-200 rounded-full mb-5" />
            <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-700">
              <span className="text-primary font-black drop-shadow-sm">CAMA</span> 계정으로 로그인해 주세요
            </h2>
          </div>

          <form
            className="flex-none flex flex-col w-full"
            onSubmit={onSubmit}
          >
            <div className="space-y-3">
              <AuthField
                label="아이디"
                value={loginId}
                name="loginId"
                autoComplete="username"
                placeholder="아이디 입력"
                error={errors.loginId}
                className="bg-slate-50/50 border-transparent shadow-none"
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setErrors((prev) => ({ ...prev, loginId: null }));
                }}
              />

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-slate-500 ml-1">
                  비밀번호
                </span>
                <div className="relative">
                  <Input
                    value={password}
                    type={pwVisible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    className="h-14 w-full rounded-2xl border-transparent bg-slate-50/50 px-5 pr-12 text-lg text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 transition-all md:text-lg"
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
                  <p className="text-sm font-medium text-red-500 ml-1">
                    {errors.password}
                  </p>
                ) : null}
              </label>
            </div>

            <div className="mt-6 space-y-4">
              <Button
                type="submit"
                disabled={submitting}
                className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? "로그인 중..." : "로그인"}
              </Button>

              <div className="flex items-center justify-center gap-3 pt-1 text-sm font-medium text-slate-400">
                <button
                  type="button"
                  className="transition hover:text-slate-700"
                  onClick={() =>
                    navigate({
                      to: "/signup",
                      search: search.redirect ? { redirect: search.redirect } : {},
                    })
                  }
                >
                  회원가입
                </button>
                <span className="text-slate-200">|</span>
                <button
                  type="button"
                  className="transition hover:text-slate-700"
                  onClick={() =>
                    navigate({
                      to: "/find-account",
                      search: search.redirect ? { redirect: search.redirect } : {},
                    })
                  }
                >
                  ID/PW 찾기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
