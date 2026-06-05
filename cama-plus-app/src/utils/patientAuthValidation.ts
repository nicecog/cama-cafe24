const ID_REGEX = /^[a-zA-Z0-9]{4,20}$/;
const EMAIL_REGEX = /^[\w~\-+.]+@[\w~\-]+(\.[\w~\-]+)+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,12}$/;

export function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, '');
}

export function validateLoginId(loginId: string) {
  if (!loginId.trim()) {
    return '아이디를 입력해 주세요.';
  }
  if (!ID_REGEX.test(loginId.trim())) {
    return '아이디는 영문/숫자 4~20자만 사용할 수 있습니다.';
  }
  return null;
}

export function validateEmail(email: string) {
  if (!email.trim()) {
    return '이메일을 입력해 주세요.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return '이메일 형식이 올바르지 않습니다.';
  }
  return null;
}

/** 회원가입 — 이메일 미입력 허용 */
export function validateOptionalEmail(email: string) {
  if (!email.trim()) {
    return null;
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return '이메일 형식이 올바르지 않습니다.';
  }
  return null;
}

export function validatePhone(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return '전화번호를 입력해 주세요.';
  }
  if (normalized.length < 10 || normalized.length > 11) {
    return '전화번호 형식이 올바르지 않습니다.';
  }
  return null;
}

export function validatePassword(password: string) {
  if (!password) {
    return '비밀번호를 입력해 주세요.';
  }
  if (password.length < 8 || password.length > 20) {
    return '비밀번호는 8~20자여야 합니다.';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return '비밀번호는 영문, 숫자, 특수문자(~!@#$%^&*()+|=)를 각 1개 이상 포함해야 합니다.';
  }
  return null;
}

export function validatePasswordConfirm(password: string, confirm: string) {
  if (!confirm) {
    return '비밀번호 확인을 입력해 주세요.';
  }
  if (password !== confirm) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return null;
}

export function validateName(name: string) {
  if (!name.trim()) {
    return '이름을 입력해 주세요.';
  }
  return null;
}
