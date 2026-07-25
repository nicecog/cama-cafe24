import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  Building2,
  Calendar,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  User2,
  X,
} from "lucide-react";
import * as React from "react";
import HeadType5 from "@/assets/images/character/head/type5.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useAuth } from "@/auth";
import { DatePickerDrawer } from "@/components/ui/DatePickerDrawer";
import {
  useChangeAccountPassword,
  useLogout,
  useUpdateAccountProfile,
  useWithdrawAccount,
} from "@/hooks/mutations";
import { useDialog } from "@/hooks/useDialog";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import {
  normalizePhone,
  validateName,
  validateOptionalEmail,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from "@/utils/patientAuthValidation";

type MyInfosContentProps = {
  onClose?: () => void;
};

type ProfileForm = {
  name: string;
  phone: string;
  email: string;
  birth: string;
  gender: "MALE" | "FEMALE" | "";
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

type FormErrors = Partial<Record<keyof ProfileForm, string | null>>;
type PasswordErrors = Partial<Record<keyof PasswordForm, string | null>>;

/** cama-billive UserInfoScreen 본문 + 개인정보 수정 */
export function MyInfosContent({ onClose }: MyInfosContentProps) {
  const { confirm, alert } = useDialog();
  const { data: accountData } = useAtomValue(accountMeAtom);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const { mutate } = useWithdrawAccount();
  const updateProfileMutation = useUpdateAccountProfile();
  const changePasswordMutation = useChangeAccountPassword();

  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState<ProfileForm>({
    name: "",
    phone: "",
    email: "",
    birth: "",
    gender: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [passwordForm, setPasswordForm] = React.useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [passwordErrors, setPasswordErrors] = React.useState<PasswordErrors>(
    {},
  );

  React.useEffect(() => {
    if (!accountData || editing) return;
    setForm({
      name: accountData.name || "",
      phone: accountData.phone || "",
      email: accountData.email || "",
      birth: accountData.birth || "",
      gender: accountData.gender || "",
    });
  }, [accountData, editing]);

  const genderText =
    accountData?.gender === "MALE"
      ? "남성"
      : accountData?.gender === "FEMALE"
        ? "여성"
        : accountData?.gender;

  const infoItems = [
    {
      icon: User2,
      label: "이름",
      value: accountData?.name || "-",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      label: "전화번호",
      value: accountData?.phone || "-",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      label: "이메일",
      value: accountData?.email || "미등록",
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      icon: User2,
      label: "성별",
      value: genderText || "-",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "생년월일",
      value: accountData?.birth || "-",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    });
    setPasswordErrors({});
  };

  const startEdit = () => {
    if (!accountData) return;
    setForm({
      name: accountData.name || "",
      phone: accountData.phone || "",
      email: accountData.email || "",
      birth: accountData.birth || "",
      gender: accountData.gender || "",
    });
    setErrors({});
    resetPasswordForm();
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
    resetPasswordForm();
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {
      name: validateName(form.name),
      phone: validatePhone(form.phone),
      email: validateOptionalEmail(form.email),
      birth: null,
      gender: null,
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const validatePasswordForm = () => {
    const nextErrors: PasswordErrors = {
      currentPassword: passwordForm.currentPassword
        ? null
        : "현재 비밀번호를 입력해 주세요.",
      newPassword: validatePassword(passwordForm.newPassword),
      newPasswordConfirm: validatePasswordConfirm(
        passwordForm.newPassword,
        passwordForm.newPasswordConfirm,
      ),
    };
    if (
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.currentPassword === passwordForm.newPassword
    ) {
      nextErrors.newPassword = "새 비밀번호는 현재 비밀번호와 달라야 합니다.";
    }
    setPasswordErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSave = async () => {
    if (!accountData?.loginId) return;
    if (!validateForm()) return;

    try {
      const response = await updateProfileMutation.mutateAsync({
        loginId: accountData.loginId,
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim(),
        birth: form.birth.trim() || undefined,
        gender: form.gender || undefined,
      });
      setEditing(false);
      resetPasswordForm();
      await alert(response.message || "개인정보가 수정되었습니다.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "수정에 실패했습니다.";
      await alert(message);
    }
  };

  const handleChangePassword = async () => {
    if (!accountData?.loginId) return;
    if (!validatePasswordForm()) return;

    try {
      const response = await changePasswordMutation.mutateAsync({
        loginId: accountData.loginId,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        newPasswordConfirm: passwordForm.newPasswordConfirm,
      });
      resetPasswordForm();
      await alert(response.message || "비밀번호가 변경되었습니다.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "비밀번호 변경에 실패했습니다.";
      await alert(message);
    }
  };

  const handleLogout = () => {
    confirm(
      {
        title: "로그아웃",
        body: "로그아웃 하시겠습니까?",
        actionButton: "로그아웃",
      },
      () => {
        logoutMutation.mutate(undefined, {
          onSuccess: () => {
            onClose?.();
          },
        });
      },
    );
  };

  const handleWithdrawal = () => {
    if (!accountData?.loginId) return;

    confirm(
      {
        title: "회원 탈퇴",
        body: (
          <div className="space-y-2.5 text-left px-1">
            <p className="text-sm text-gray-700 leading-snug">
              탈퇴 시 아래 정보가{" "}
              <span className="font-semibold text-destructive">
                영구 삭제됩니다.
              </span>
            </p>
            <ul className="space-y-1.5 pl-3 text-sm">
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>계정 정보 및 개인 설정</span>
              </li>
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>진행 중인 암정보 가이드 여정</span>
              </li>
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>저장된 즐겨찾기 및 활동 기록</span>
              </li>
            </ul>
            <p className="text-center font-semibold text-gray-900 pt-1 text-sm">
              정말 탈퇴하시겠습니까?
            </p>
          </div>
        ),
      },
      () => {
        mutate(accountData.loginId, {
          onSuccess: async () => {
            await logout();
            queryClient.clear();
            onClose?.();
            navigate({ to: "/webview", replace: true });
          },
        });
      },
    );
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="relative p-4 text-white overflow-hidden flex-shrink-0">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex-center border-2 border-white/40 shadow-lg overflow-hidden bg-white flex-shrink-0">
              <img
                src={HeadType5}
                alt="프로필"
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-xs mb-0.5">안녕하세요</p>
              <h1 className="text-white text-xl font-bold mb-0.5">
                {accountData?.name || "사용자"} 님
              </h1>
              <p className="text-white/90 text-sm">
                {accountData?.loginId
                  ? `아이디 ${accountData.loginId}`
                  : "오늘도 건강한 하루 되세요"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-sm font-bold text-gray-900">개인 정보</h2>
            </div>
            {!editing ? (
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700"
              >
                <Pencil size={14} />
                수정
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700"
              >
                <X size={14} />
                취소
              </button>
            )}
          </div>

          {!editing ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {infoItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.bgColor}`}
                    >
                      <item.icon className={item.color} size={16} />
                    </div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 text-right max-w-[60%] break-all">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
              <Field
                label="이름"
                value={form.name}
                error={errors.name}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, name: value }));
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              <Field
                label="전화번호"
                value={form.phone}
                placeholder="01012345678"
                error={errors.phone}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, phone: value }));
                  setErrors((prev) => ({ ...prev, phone: null }));
                }}
              />
              <Field
                label="이메일"
                value={form.email}
                placeholder="example@email.com (선택)"
                error={errors.email}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, email: value }));
                  setErrors((prev) => ({ ...prev, email: null }));
                }}
              />
              <div className="space-y-1.5">
                <span className="text-sm text-gray-600">성별</span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "MALE", label: "남성" },
                      { value: "FEMALE", label: "여성" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, gender: option.value }))
                      }
                      className={cn(
                        "h-11 rounded-xl border text-sm font-semibold",
                        form.gender === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-600",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-sm text-gray-600">생년월일</span>
                <DatePickerDrawer
                  format="yyyy-MM-dd"
                  value={form.birth}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm"
                  disabled={{ after: new Date() }}
                  onChange={(date) => {
                    if (!date) {
                      setForm((prev) => ({ ...prev, birth: "" }));
                      return;
                    }
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    setForm((prev) => ({
                      ...prev,
                      birth: `${year}-${month}-${day}`,
                    }));
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 leading-5">
                이메일을 등록하면 비밀번호 초기화·변경 시 안내 메일을 받을 수
                있습니다. 로그인 아이디는 변경할 수 없습니다.
              </p>
              <button
                type="button"
                disabled={updateProfileMutation.isPending}
                onClick={() => void handleSave()}
                className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-white disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "저장 중..." : "저장"}
              </button>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900">
                    비밀번호 변경
                  </h3>
                </div>
                <Field
                  label="현재 비밀번호"
                  value={passwordForm.currentPassword}
                  type="password"
                  autoComplete="current-password"
                  placeholder="현재 비밀번호"
                  error={passwordErrors.currentPassword}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: value,
                    }));
                    setPasswordErrors((prev) => ({
                      ...prev,
                      currentPassword: null,
                    }));
                  }}
                />
                <Field
                  label="새 비밀번호"
                  value={passwordForm.newPassword}
                  type="password"
                  autoComplete="new-password"
                  placeholder="영문/숫자/특수문자 포함 8~20자"
                  error={passwordErrors.newPassword}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: value,
                    }));
                    setPasswordErrors((prev) => ({
                      ...prev,
                      newPassword: null,
                    }));
                  }}
                />
                <Field
                  label="새 비밀번호 확인"
                  value={passwordForm.newPasswordConfirm}
                  type="password"
                  autoComplete="new-password"
                  placeholder="새 비밀번호 다시 입력"
                  error={passwordErrors.newPasswordConfirm}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPasswordConfirm: value,
                    }));
                    setPasswordErrors((prev) => ({
                      ...prev,
                      newPasswordConfirm: null,
                    }));
                  }}
                />
                <p className="text-xs text-gray-500 leading-5">
                  {accountData?.email
                    ? "변경 완료 시 등록된 이메일로 안내 메일을 보냅니다."
                    : "이메일이 등록되어 있지 않아 변경 안내 메일은 발송되지 않습니다."}
                </p>
                <button
                  type="button"
                  disabled={changePasswordMutation.isPending}
                  onClick={() => void handleChangePassword()}
                  className="h-12 w-full rounded-xl border border-primary bg-white text-sm font-bold text-primary disabled:opacity-50"
                >
                  {changePasswordMutation.isPending
                    ? "변경 중..."
                    : "비밀번호 변경"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pb-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending || editing}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-left disabled:opacity-50"
          >
            <span className="text-lg text-[#696969]">로그아웃</span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-4 py-4 text-center underline font-bold text-base-fixed">
          <button type="button" onClick={handleWithdrawal} disabled={editing}>
            회원탈퇴
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 px-4 py-4 border-t-2 border-gray-200 font-semibold">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="text-gray-600" size={18} />
            <h2 className="text-sm font-bold text-gray-800">회사 정보</h2>
          </div>
          <div className="space-y-2.5">
            <h3 className="text-base font-bold text-gray-900">(주) 휴딧</h3>
            <div className="border-t border-gray-300" />
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <span className="text-gray-500">대표</span> 한덕현 ·{" "}
                <span className="text-gray-500">사업자</span> 368-86-03038
              </p>
              <p>
                <span className="text-gray-500">주소</span> 서울특별시 동작구
                흑석로 109. 3층
              </p>
              <p>
                <span className="text-gray-500">대표전화</span> 02-6299-3877
              </p>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <p className="text-[10px] text-gray-400 text-center">
                © 2026 HUDIT. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  error,
  type = "text",
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  type?: "text" | "password";
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-primary focus:bg-white"
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
