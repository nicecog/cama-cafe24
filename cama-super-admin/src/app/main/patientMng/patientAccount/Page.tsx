import { ChangeEvent, useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";
import Button from "@/components/button/DefaultButton";
import { FaArrowLeft } from "react-icons/fa";

type PatientAccountDetail = {
  seq: number;
  loginId?: string;
  email?: string;
  name?: string;
  phone?: string;
  birth?: string;
  gender?: string;
  signType?: string;
  signTypeNm?: string;
  userTypeCd?: string;
  userTypeNm?: string;
  createdAt?: string;
  updatedAt?: string;
  passwordResetSupported?: boolean;
};

type PasswordMode = "RANDOM" | "MANUAL";

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
        {value || "-"}
      </div>
    </div>
  );
}

export default function PatientAccountPage() {
  const { t } = useTranslation();
  const { alert, confirm } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const seq = searchParams.get("seq") || "";
  const name = searchParams.get("name") || "";

  const [email, setEmail] = useState("");
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("RANDOM");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const { data: account, isFetching, isError } = useQuery({
    queryKey: ["patientAccount", seq],
    queryFn: async () => {
      const { data } = await axios.get(`/api/monitoring/account/${seq}`);
      return data.response as PatientAccountDetail;
    },
    enabled: seq !== "" && seq !== "0",
  });

  useEffect(() => {
    if (account?.email != null) {
      setEmail(account.email);
    }
  }, [account?.email]);

  const emailMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put("/api/monitoring/account/updateEmail", {
        acSeq: Number(seq),
        email: email.trim(),
      });
      return data.response as boolean;
    },
    onSuccess: (ok) => {
      if (ok) {
        alert(t("patientAccount.emailUpdated"), () => {
          queryClient.invalidateQueries({ queryKey: ["patientAccount", seq] });
        });
      }
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || t("patientAccount.emailUpdateFailed"));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        acSeq: Number(seq),
        mode: passwordMode,
      };
      if (passwordMode === "MANUAL") {
        payload.password = password;
        payload.passwordConfirm = passwordConfirm;
      }
      const { data } = await axios.put("/api/monitoring/account/updatePassword", payload);
      return data.response as { updated: boolean; generatedPassword?: string; message?: string };
    },
    onSuccess: (result) => {
      if (result?.updated) {
        if (result.generatedPassword) {
          setGeneratedPassword(result.generatedPassword);
        }
        setPassword("");
        setPasswordConfirm("");
        alert(result.message || t("patientAccount.passwordUpdated"));
      }
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || t("patientAccount.passwordUpdateFailed"));
    },
  });

  const onEmailSave = () => {
    if (!email.trim()) {
      alert(t("patientAccount.emailRequired"));
      return;
    }
    confirm(
      {
        title: t("patientAccount.emailSaveTitle"),
        text: t("patientAccount.emailSaveConfirm"),
        icon: "question",
      },
      () => emailMutation.mutate(),
    );
  };

  const onPasswordSave = () => {
    if (passwordMode === "MANUAL") {
      if (!password || !passwordConfirm) {
        alert(t("patientAccount.passwordRequired"));
        return;
      }
      if (password !== passwordConfirm) {
        alert(t("patientAccount.passwordMismatch"));
        return;
      }
    }
    confirm(
      {
        title: t("patientAccount.passwordSaveTitle"),
        text:
          passwordMode === "RANDOM"
            ? t("patientAccount.passwordRandomConfirm")
            : t("patientAccount.passwordManualConfirm"),
        icon: "question",
      },
      () => passwordMutation.mutate(),
    );
  };

  const onBack = () => {
    navigate(`/main/patientMng/coachingMonitoring?seq=${seq}&name=${encodeURIComponent(name)}`);
  };

  if (!seq || seq === "0") {
    return (
      <div className="p-6 text-sm text-gray-600">{t("patientAccount.invalidPatient")}</div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col gap-4 overflow-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaArrowLeft />
            {t("patientAccount.back")}
          </button>
          <h1 className="text-sm font-bold">
            <span className="underline">{name || account?.name}</span>
            {t("patientAccount.title")}
          </h1>
        </div>
      </div>

      {isFetching && (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-solid border-t-transparent" />
        </div>
      )}

      {isError && !isFetching && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t("patientAccount.loadFailed")}
        </div>
      )}

      {account && !isFetching && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 border-b pb-2 text-sm font-bold text-gray-800">
              {t("patientAccount.basicInfo")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReadOnlyField label={t("patientAccount.loginId")} value={account.loginId} />
              <ReadOnlyField label={t("patientAccount.name")} value={account.name} />
              <ReadOnlyField label={t("patientAccount.phone")} value={account.phone} />
              <ReadOnlyField label={t("patientAccount.birth")} value={account.birth} />
              <ReadOnlyField
                label={t("patientAccount.gender")}
                value={
                  !account.gender
                    ? "-"
                    : account.gender === "MALE"
                      ? t("patientAccount.genderMale")
                      : account.gender === "FEMALE"
                        ? t("patientAccount.genderFemale")
                        : account.gender
                }
              />
              <ReadOnlyField label={t("patientAccount.userType")} value={account.userTypeNm} />
              <ReadOnlyField label={t("patientAccount.signType")} value={account.signTypeNm} />
              <ReadOnlyField label={t("patientAccount.createdAt")} value={account.createdAt} />
              <ReadOnlyField label={t("patientAccount.updatedAt")} value={account.updatedAt} />
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 border-b pb-2 text-sm font-bold text-gray-800">
                {t("patientAccount.emailSection")}
              </h2>
              <div className="relative mt-3 w-full">
                <input
                  type="email"
                  id="patientEmail"
                  name="patientEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer block w-full appearance-none rounded-sm border border-gray-400 bg-transparent p-2 pt-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0"
                  autoComplete="off"
                />
                <label
                  htmlFor="patientEmail"
                  className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-xs text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
                >
                  {t("patientAccount.email")}
                </label>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={onEmailSave}>{t("patientAccount.saveEmail")}</Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 border-b pb-2 text-sm font-bold text-gray-800">
                {t("patientAccount.passwordSection")}
              </h2>

              {!account.passwordResetSupported ? (
                <p className="text-sm text-amber-700">{t("patientAccount.socialAccountNotice")}</p>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="passwordMode"
                        checked={passwordMode === "RANDOM"}
                        onChange={() => {
                          setPasswordMode("RANDOM");
                          setGeneratedPassword(null);
                        }}
                      />
                      {t("patientAccount.passwordRandom")}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="passwordMode"
                        checked={passwordMode === "MANUAL"}
                        onChange={() => setPasswordMode("MANUAL")}
                      />
                      {t("patientAccount.passwordManual")}
                    </label>
                  </div>

                  {passwordMode === "MANUAL" && (
                    <div className="mb-4 grid grid-cols-1 gap-3">
                      <div className="relative w-full">
                        <input
                          type="password"
                          id="newPassword"
                          value={password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                          className="peer block w-full appearance-none rounded-sm border border-gray-400 bg-transparent p-2 pt-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0"
                          autoComplete="new-password"
                        />
                        <label
                          htmlFor="newPassword"
                          className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-xs text-gray-500"
                        >
                          {t("patientAccount.newPassword")}
                        </label>
                      </div>
                      <div className="relative w-full">
                        <input
                          type="password"
                          id="newPasswordConfirm"
                          value={passwordConfirm}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPasswordConfirm(e.target.value)
                          }
                          className="peer block w-full appearance-none rounded-sm border border-gray-400 bg-transparent p-2 pt-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0"
                          autoComplete="new-password"
                        />
                        <label
                          htmlFor="newPasswordConfirm"
                          className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-xs text-gray-500"
                        >
                          {t("patientAccount.newPasswordConfirm")}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{t("patientAccount.passwordRule")}</p>
                    </div>
                  )}

                  {generatedPassword && (
                    <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm">
                      <p className="font-medium text-blue-900">{t("patientAccount.generatedPassword")}</p>
                      <p className="mt-1 font-mono text-base text-blue-800">{generatedPassword}</p>
                      <p className="mt-1 text-xs text-blue-700">{t("patientAccount.generatedPasswordHint")}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={onPasswordSave}>{t("patientAccount.savePassword")}</Button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
