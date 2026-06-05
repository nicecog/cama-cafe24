const GENERIC_UNAUTHORIZED =
  'Authentication error (cause: unauthorized)';

const GENERIC_NETWORK_PREFIX = 'Network Error.';

/** Map API / axios login errors to user-facing Korean messages. */
export function resolveLoginErrorMessage(err: unknown): string {
  const raw =
    typeof err === 'string'
      ? err
      : err instanceof Error
        ? err.message
        : '';

  if (!raw.trim()) {
    return '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.';
  }

  if (raw.includes(GENERIC_UNAUTHORIZED)) {
    return '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.';
  }

  if (raw.startsWith(GENERIC_NETWORK_PREFIX)) {
    return '네트워크 연결을 확인한 후 다시 시도해 주세요.';
  }

  if (raw.includes('존재하지 않는 아이디')) {
    return '존재하지 않는 아이디입니다. ID 찾기에서 등록된 아이디를 확인해 주세요.';
  }

  if (raw.includes('비밀번호가 일치하지 않습니다')) {
    return raw;
  }

  if (raw.includes('아이디 또는 비밀번호')) {
    return raw;
  }

  if (raw.includes('이 로그인 방식으로 접속할 수 없는')) {
    return raw;
  }

  if (raw.includes('credentials is required')) {
    return '비밀번호를 입력해 주세요.';
  }

  return raw;
}
