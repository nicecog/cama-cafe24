import { createFileRoute } from "@tanstack/react-router";
import { BadgeInfo, ShieldCheck } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import {
  checkPatientEmail,
  checkPatientLoginId,
  checkPatientNumber,
  checkPatientPhone,
  registerPatient,
} from "@/apis/api/patientAuth";
import type { PatientAvailabilityResponse } from "@/apis/types";
import { AuthField } from "@/components/auth/AuthField";
import SplitText from "@/components/SplitText";
import { Button } from "@/components/ui/Button";
import { DatePickerDrawer } from "@/components/ui/DatePickerDrawer";
import { usePatientSession } from "@/hooks/auth/usePatientSession";
import { useToast } from "@/hooks/use-toast";
import { createWebFirebaseInfo } from "@/utils/firebaseWeb";
import {
  normalizePhone,
  validateLoginId,
  validateName,
  validateOptionalEmail,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from "@/utils/patientAuthValidation";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: SignUpPage,
});

type FieldErrors = Partial<Record<keyof FormState, string | null>>;
type DuplicateCheckKey =
  | "loginId"
  | "email"
  | "phone"
  | "patientManagementNumber";
type DuplicateCheckState = Partial<Record<DuplicateCheckKey, string>>;

interface FormState {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
  phone: string;
  patientManagementNumber: string;
  birthday: string;
}

function SignUpPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { toast } = useToast();
  const { completePatientLogin } = usePatientSession();
  const [form, setForm] = React.useState<FormState>({
    loginId: "",
    password: "",
    passwordConfirm: "",
    email: "",
    name: "",
    phone: "",
    patientManagementNumber: "",
    birthday: "",
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [checking, setChecking] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [verified, setVerified] = React.useState<DuplicateCheckState>({});

  const getComparableValue = React.useCallback(
    (key: DuplicateCheckKey, source: FormState) => {
      if (key === "loginId") return source.loginId.trim();
      if (key === "email") return source.email.trim().toLowerCase();
      if (key === "phone") return normalizePhone(source.phone);
      return source.patientManagementNumber.trim();
    },
    [],
  );

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
    if (
      key === "loginId" ||
      key === "email" ||
      key === "phone" ||
      key === "patientManagementNumber"
    ) {
      setVerified((prev) => {
        const comparable = getComparableValue(key, { ...form, [key]: value });
        if (!prev[key] || prev[key] === comparable) {
          return prev;
        }

        return { ...prev, [key]: undefined };
      });
    }
  };

  const runDuplicateCheck = async (
    key: "loginId" | "email" | "phone" | "patientManagementNumber",
  ) => {
    setChecking(key);
    try {
      let result: PatientAvailabilityResponse;
      if (key === "loginId") {
        const err = validateLoginId(form.loginId);
        if (err) {
          setErrors((prev) => ({ ...prev, loginId: err }));
          return;
        }
        result = await checkPatientLoginId({ loginId: form.loginId.trim() });
      } else if (key === "email") {
        if (!form.email.trim()) {
          toast({
            variant: "destructive",
            title: "중복 확인",
            description: "중복 확인할 이메일을 입력해 주세요.",
          });
          return;
        }
        const err = validateOptionalEmail(form.email);
        if (err) {
          setErrors((prev) => ({ ...prev, email: err }));
          return;
        }
        result = await checkPatientEmail({ email: form.email.trim() });
      } else if (key === "phone") {
        const err = validatePhone(form.phone);
        if (err) {
          setErrors((prev) => ({ ...prev, phone: err }));
          return;
        }
        result = await checkPatientPhone({ phone: normalizePhone(form.phone) });
      } else {
        if (!form.patientManagementNumber.trim()) {
          toast({
            variant: "destructive",
            title: "중복 확인",
            description: "환자번호를 입력해 주세요.",
          });
          return;
        }
        result = await checkPatientNumber({
          patientManagementNumber: form.patientManagementNumber.trim(),
        });
      }

      toast({
        title: result.available ? "사용 가능" : "사용 불가",
        description: result.message,
        variant: result.available ? "default" : "destructive",
      });
      setErrors((prev) => ({
        ...prev,
        [key]: result.available ? null : result.message,
      }));
      setVerified((prev) => ({
        ...prev,
        [key]: result.available ? getComparableValue(key, form) : undefined,
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "중복 확인 실패",
        description:
          error instanceof Error ? error.message : "요청에 실패했습니다.",
      });
    } finally {
      setChecking(null);
    }
  };

  const validateAll = () => {
    const nextErrors: FieldErrors = {
      loginId: validateLoginId(form.loginId),
      password: validatePassword(form.password),
      passwordConfirm: validatePasswordConfirm(
        form.password,
        form.passwordConfirm,
      ),
      email: validateOptionalEmail(form.email),
      name: validateName(form.name),
      phone: validatePhone(form.phone),
    };

    if (
      !nextErrors.loginId &&
      verified.loginId !== getComparableValue("loginId", form)
    ) {
      nextErrors.loginId = "아이디 중복확인을 완료해 주세요.";
    }

    if (
      !nextErrors.phone &&
      verified.phone !== getComparableValue("phone", form)
    ) {
      nextErrors.phone = "전화번호 중복확인을 완료해 주세요.";
    }

    if (
      form.email.trim() &&
      !nextErrors.email &&
      verified.email !== getComparableValue("email", form)
    ) {
      nextErrors.email = "이메일 중복확인을 완료해 주세요.";
    }

    if (
      form.patientManagementNumber.trim() &&
      verified.patientManagementNumber !==
        getComparableValue("patientManagementNumber", form)
    ) {
      nextErrors.patientManagementNumber = "환자번호 중복확인을 완료해 주세요.";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    if (!validateAll()) {
      toast({
        variant: "destructive",
        title: "회원가입 확인 필요",
        description: "필수값과 중복확인 항목을 다시 확인해 주세요.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const firebase = await createWebFirebaseInfo();
      await registerPatient({
        loginId: form.loginId.trim(),
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        email: form.email.trim() || undefined,
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        patientManagementNumber:
          form.patientManagementNumber.trim() || undefined,
        birthday: form.birthday.trim() || undefined,
        firebase,
        lang: "KO",
      });

      toast({
        title: "회원가입 완료",
        description: "가입이 완료되었습니다. 로그인합니다.",
      });

      const route = await completePatientLogin(form.loginId, form.password);

      if (route === "selectInfo") {
        await navigate({
          to: "/hospital/select",
          search: search.redirect ? { redirect: search.redirect } : {},
        });
        return;
      }

      await navigate({
        to: search.redirect || import.meta.env.VITE_DEFAULT_PAGE,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description:
          error instanceof Error ? error.message : "요청에 실패했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 초고급스러운 입력창 디자인: 유리 효과 + 안쪽 그림자
  const inputClass =
    "bg-slate-50/60 border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] h-14 rounded-2xl px-5 text-lg text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all md:text-lg backdrop-blur-sm";

  // Framer Motion 애니메이션 프리셋
  return (
    <div className="min-h-screen bg-[#f2f7f5] text-slate-900 pb-12 relative overflow-x-hidden">
      {/* Decorative background blurs */}
      <div className="fixed -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="fixed -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="mx-auto w-full max-w-md px-6 pt-12">
        {/* Header Section */}
        <div className="mb-10 pl-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SplitText
            text="새로운 시작,"
            tag="h2"
            textAlign="left"
            className="text-2xl font-black tracking-tight text-slate-800 drop-shadow-sm"
            delay={30}
          />
          <SplitText
            text="CAMA 회원가입"
            tag="h1"
            textAlign="left"
            className="text-4xl font-black tracking-tight text-primary drop-shadow-sm mt-1"
            delay={30}
          />
          <SplitText
            text="모든 서비스를 이용하기 위해 계정을 만들어주세요."
            tag="p"
            textAlign="left"
            className="text-sm font-medium text-slate-500 mt-3"
            delay={15}
            to={{ opacity: 1, y: 0, delay: 0.3 }}
          />
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {/* 필수 정보 카드 */}
          <div
            className="bg-gradient-to-br from-white to-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-7 space-y-5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
            style={{ animationDelay: "150ms" }}
          >
            {/* 장식용 그라데이션 보더 (상단) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-emerald-300" />

            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ShieldCheck
                  className="text-primary size-5"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800">필수 정보</h3>
            </div>

            <AuthField
              label="아이디"
              value={form.loginId}
              autoComplete="username"
              placeholder="영문/숫자 4~20자"
              error={errors.loginId}
              actionLabel="중복확인"
              actionLoading={checking === "loginId"}
              className={inputClass}
              onPressAction={() => runDuplicateCheck("loginId")}
              onChange={(e) =>
                update("loginId", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
            />
            <AuthField
              label="비밀번호"
              value={form.password}
              type="password"
              autoComplete="new-password"
              placeholder="8~20자, 영문/숫자/특수문자"
              error={errors.password}
              className={inputClass}
              onChange={(e) => update("password", e.target.value)}
            />
            <AuthField
              label="비밀번호 확인"
              value={form.passwordConfirm}
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호 재입력"
              error={errors.passwordConfirm}
              className={inputClass}
              onChange={(e) => update("passwordConfirm", e.target.value)}
            />
            <AuthField
              label="이름"
              value={form.name}
              placeholder="이름 입력"
              error={errors.name}
              className={inputClass}
              onChange={(e) => update("name", e.target.value)}
            />
            <AuthField
              label="전화번호"
              value={form.phone}
              autoComplete="tel"
              placeholder="01012345678"
              error={errors.phone}
              actionLabel="중복확인"
              actionLoading={checking === "phone"}
              className={inputClass}
              onPressAction={() => runDuplicateCheck("phone")}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          {/* 선택 정보 카드 */}
          <div
            className="bg-gradient-to-br from-white to-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-7 space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-slate-100 rounded-xl">
                <BadgeInfo
                  className="text-slate-500 size-5"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800">선택 정보</h3>
            </div>

            <AuthField
              label="이메일"
              value={form.email}
              autoComplete="email"
              placeholder="example@email.com"
              error={errors.email}
              actionLabel="중복확인"
              actionLoading={checking === "email"}
              className={inputClass}
              onPressAction={() => runDuplicateCheck("email")}
              onChange={(e) => update("email", e.target.value)}
            />
            <AuthField
              label="환자번호"
              value={form.patientManagementNumber}
              placeholder="병원 환자번호"
              error={errors.patientManagementNumber}
              actionLabel="중복확인"
              actionLoading={checking === "patientManagementNumber"}
              className={inputClass}
              onPressAction={() => runDuplicateCheck("patientManagementNumber")}
              onChange={(e) =>
                update("patientManagementNumber", e.target.value)
              }
            />

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-500 ml-1">
                생년월일
              </span>
              <DatePickerDrawer
                format="yyyy-MM-dd"
                value={form.birthday}
                className={inputClass}
                disabled={{
                  after: new Date(),
                }}
                onChange={(date) => {
                  if (!date) {
                    update("birthday", "");
                    return;
                  }
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  update("birthday", `${year}-${month}-${day}`);
                }}
              />
              {errors.birthday ? (
                <p className="text-sm font-medium text-red-500 ml-1">
                  {errors.birthday}
                </p>
              ) : null}
            </label>
          </div>

          {/* Buttons */}
          <div
            className="pt-2 pb-6 flex gap-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
            style={{ animationDelay: "450ms" }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/login/credentials" })}
              className="h-14 flex-[0.35] rounded-2xl text-base font-bold border-slate-200 text-slate-500 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-slate-50 hover:text-slate-700 transition-all"
            >
              이전
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-14 flex-1 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {submitting ? "가입 처리 중..." : "가입 완료"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
