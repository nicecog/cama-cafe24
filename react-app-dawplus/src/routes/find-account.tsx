import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { z } from "zod";
import { KeyRound, Search, ShieldAlert } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import SplitText from "@/components/SplitText";
import {
  findPatientLoginId,
  resetPatientPassword,
} from "@/apis/api/patientAuth";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useAlert from "@/hooks/useAlert";
import { useToast } from "@/hooks/use-toast";
import {
  normalizePhone,
  validateLoginId,
  validateName,
  validatePhone,
} from "@/utils/patientAuthValidation";

export const Route = createFileRoute("/find-account")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: FindAccountPage,
});

type TabValue = "id" | "password";

function FindAccountPage() {
  const { toast } = useToast();
  const { alert } = useAlert();
  const [tab, setTab] = React.useState<TabValue>("id");
  const [loading, setLoading] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState("");
  const [form, setForm] = React.useState({
    loginId: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<{
    loginId?: string | null;
    name?: string | null;
    phone?: string | null;
  }>({});
  const inputClass =
    "bg-slate-50/60 border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] h-14 rounded-2xl px-5 text-lg text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all md:text-lg backdrop-blur-sm";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
  };

  const validateCommon = () => {
    const nextErrors = {
      loginId:
        tab === "password" ? validateLoginId(form.loginId) : (null as string | null),
      name: validateName(form.name),
      phone: validatePhone(form.phone),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const onFindId = async () => {
    if (!validateCommon()) return;

    setLoading(true);
    try {
      const response = await findPatientLoginId({
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
      });
      const message = response.found && response.loginId
        ? `회원 아이디: ${response.loginId}`
        : response.message;
      setResultMessage(message);
      toast({
        title: "아이디 찾기",
        description: message,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "요청에 실패했습니다.";
      toast({
        variant: "destructive",
        title: "아이디 찾기 실패",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!validateCommon()) return;

    setLoading(true);
    try {
      const response = await resetPatientPassword({
        loginId: form.loginId.trim(),
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
      });

      // 임시 비밀번호는 항상 alert로 표시.
      // emailSent=true 일 때만 서버 message에 메일 발송 완료 문구가 포함된다.
      const message =
        response.reset && response.temporaryPassword
          ? `${response.message}\n\n임시 비밀번호: ${response.temporaryPassword}\n\n※ 새로 발급된 임시 비밀번호만 사용할 수 있습니다. 이전에 받은 임시 비밀번호는 더 이상 사용할 수 없습니다.`
          : response.message;

      setResultMessage(message);
      await alert(message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "요청에 실패했습니다.";
      toast({
        variant: "destructive",
        title: "비밀번호 초기화 실패",
        description: message,
      });
      await alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] text-slate-900 pb-12 relative overflow-x-hidden">
      <div className="fixed -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="fixed -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

      <motion.div
        className="mx-auto w-full max-w-md px-6 pt-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-10 pl-2">
          <SplitText
            text="계정 정보 찾기"
            tag="h1"
            textAlign="left"
            className="text-4xl font-black tracking-tight text-primary drop-shadow-sm"
            delay={30}
          />
          <SplitText
            text={
              tab === "id"
                ? "가입 시 등록한 이름과 전화번호로 아이디를 찾습니다."
                : "아이디, 이름, 전화번호가 일치하면 임시 비밀번호를 발급합니다. 등록된 이메일이 있으면 메일로도 함께 안내합니다."
            }
            tag="p"
            textAlign="left"
            className="mt-3 text-sm font-medium text-slate-500"
            delay={15}
            to={{ opacity: 1, y: 0, delay: 0.25 }}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-white bg-gradient-to-br from-white to-white/70 p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        >
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as TabValue);
              setResultMessage("");
              setErrors({});
            }}
            className="space-y-6"
          >
            <TabsList className="grid h-14 w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger
                value="id"
                className="rounded-[1rem] text-base font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <Search className="mr-2 size-4" />
                ID 찾기
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="rounded-[1rem] text-base font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <KeyRound className="mr-2 size-4" />
                PW 초기화
              </TabsTrigger>
            </TabsList>

            <TabsContent value="id" className="space-y-5">
              <div className="mb-2 flex items-center gap-2.5">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Search className="size-5 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">아이디 찾기</h3>
              </div>
              <AuthField
                label="이름"
                value={form.name}
                placeholder="이름 입력"
                error={errors.name}
                className={inputClass}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              <AuthField
                label="전화번호"
                value={form.phone}
                placeholder="01012345678"
                error={errors.phone}
                className={inputClass}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, phone: e.target.value }));
                  setErrors((prev) => ({ ...prev, phone: null }));
                }}
              />
              <Button
                type="button"
                disabled={loading}
                onClick={onFindId}
                className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              >
                {loading ? "확인 중..." : "아이디 찾기"}
              </Button>
            </TabsContent>

            <TabsContent value="password" className="space-y-5">
              <div className="mb-2 flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-100 p-2">
                  <ShieldAlert
                    className="size-5 text-amber-600"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  비밀번호 초기화
                </h3>
              </div>
              <AuthField
                label="아이디"
                value={form.loginId}
                placeholder="아이디 입력"
                error={errors.loginId}
                className={inputClass}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, loginId: e.target.value }));
                  setErrors((prev) => ({ ...prev, loginId: null }));
                }}
              />
              <AuthField
                label="이름"
                value={form.name}
                placeholder="이름 입력"
                error={errors.name}
                className={inputClass}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              <AuthField
                label="전화번호"
                value={form.phone}
                placeholder="01012345678"
                error={errors.phone}
                className={inputClass}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, phone: e.target.value }));
                  setErrors((prev) => ({ ...prev, phone: null }));
                }}
              />
              <Button
                type="button"
                disabled={loading}
                onClick={onResetPassword}
                className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              >
                {loading ? "초기화 중..." : "비밀번호 초기화"}
              </Button>
            </TabsContent>
          </Tabs>
        </motion.div>

        {resultMessage ? (
          <motion.div
            variants={itemVariants}
            className="mt-6 whitespace-pre-line rounded-[2rem] border border-white bg-gradient-to-br from-white to-white/70 p-6 text-sm font-medium leading-7 text-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          >
            {resultMessage}
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}
