import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { readStoredWebviewSession } from "@/atoms/authSessionAtom";
import { useAuth } from "@/auth";
import SplitText from "@/components/SplitText";
import { Input } from "@/components/ui/Input";
import { usePatientSession } from "@/hooks/auth/usePatientSession";
import { useToast } from "@/hooks/use-toast";
import { getDevAuthBypassLoginId, isDevAuthBypassEnabled } from "@/lib/devAuth";
import { bootstrapWebviewSession } from "@/lib/webview/bootstrapSession";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

export const Route = createFileRoute("/login/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ context, search }) => {
    const devBypassLoginId = getDevAuthBypassLoginId();
    if (devBypassLoginId) {
      await bootstrapWebviewSession(devBypassLoginId);
      throw redirect({
        to: search.redirect || import.meta.env.VITE_DEFAULT_PAGE,
      });
    }
    if (isDevAuthBypassEnabled()) {
      throw redirect({
        to: search.redirect || import.meta.env.VITE_DEFAULT_PAGE,
      });
    }
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || import.meta.env.VITE_DEFAULT_PAGE,
      });
    }
    if (isReactNativeWebView()) {
      const stored = readStoredWebviewSession();
      if (stored?.loginId) {
        const target = search.redirect?.trim();
        if (target) {
          throw redirect({ href: target });
        }
        throw redirect({
          to: "/coaching",
          search: { wvLoginId: stored.loginId },
        });
      }
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { toast } = useToast();
  const { completePatientLogin, handleLoginError } = usePatientSession();
  const [submitting, setSubmitting] = React.useState(false);
  const [pwShow, setPwShow] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({ id: "", password: "" });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;

    const loginId = userInfo.id.trim();
    if (!loginId) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "아이디를 입력해 주세요.",
      });
      return;
    }
    if (!userInfo.password) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "비밀번호를 입력해 주세요.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const route = await completePatientLogin(loginId, userInfo.password);
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
      <section className="flex h-screen items-center justify-center bg-black text-white">
        로딩 중…
      </section>
    );
  }

  return (
    <section className="relative flex justify-center items-center h-screen bg-black overflow-hidden">
      <div className=" relative z-10 w-full max-w-sm sm:max-w-xs md:max-w-lg lg:max-w-xl bg-transparent p-6 sm:p-8 md:p-10 ">
        <div className="flex items-center justify-center text-5xl font-jalnan text-white flex-col ">
          <SplitText
            text="Hello, CAMA"
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white font-jalnan"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
        <form
          className="flex flex-col space-y-5 sm:space-y-5 mt-8"
          onSubmit={onFormSubmit}
        >
          <div className="relative">
            <Input
              autoComplete="username"
              placeholder="아이디"
              value={userInfo.id}
              name="id"
              className="w-full p-5 border-2 text-lg bg-primary-thin focus:border-primary-thin rounded-lg focus:bg-white"
              onChange={onChangeHandler}
            />
          </div>
          <div className="relative">
            <Input
              type={pwShow ? "text" : "password"}
              value={userInfo.password}
              placeholder="비밀번호"
              name="password"
              autoComplete="current-password"
              className="w-full p-5 border-2 text-lg bg-primary-thin focus:border-primary-thin rounded-lg pr-16 focus:bg-white"
              onChange={onChangeHandler}
            />
            <button
              type="button"
              onClick={() => setPwShow((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
              aria-label={pwShow ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {pwShow ? (
                <Eye className="text-gray-400" />
              ) : (
                <EyeClosed className="text-gray-400" />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-transparent border-white border-2 font-bold font-jalnan text-xl text-white py-3 rounded-lg transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
          >
            {submitting ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
}
