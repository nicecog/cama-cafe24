import {
  getTokenEncryptedStorage,
  setTokenEncryptedStorage,
} from "@/lib/encryptedStorage";

/**
 * 개발 환경 테스트 토큰 설정 유틸리티
 */

/**
 * 테스트 토큰을 암호화 스토리지에 저장
 * 개발 환경에서만 사용하세요!
 */
export const setDevTestToken = async () => {
  if (!import.meta.env.DEV) {
    console.warn("⚠️ setDevTestToken은 개발 환경에서만 사용할 수 있습니다.");
    return;
  }

  const testToken = import.meta.env.VITE_DEV_TEST_TOKEN;

  if (!testToken) {
    console.error("❌ VITE_DEV_TEST_TOKEN이 .env 파일에 설정되지 않았습니다.");
    return;
  }

  try {
    await setTokenEncryptedStorage(testToken);
    console.log("✅ 테스트 토큰이 암호화 스토리지에 저장되었습니다.");
    console.log("🔑 Token:", `${testToken.substring(0, 20)}...`);
  } catch (error) {
    console.error("❌ 테스트 토큰 저장 실패:", error);
  }
};

/**
 * 현재 저장된 토큰 확인
 */
export const checkCurrentToken = async () => {
  try {
    const token = await getTokenEncryptedStorage();

    if (token) {
      console.log("✅ 저장된 토큰:", `${token.substring(0, 20)}...`);
      return token;
    } else {
      console.log("ℹ️ 저장된 토큰이 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("❌ 토큰 확인 실패:", error);
    return null;
  }
};

/**
 * 환경변수의 테스트 토큰 확인
 */
export const checkEnvTestToken = () => {
  const testToken = import.meta.env.VITE_DEV_TEST_TOKEN;

  if (testToken) {
    console.log("✅ 환경변수 테스트 토큰:", `${testToken.substring(0, 20)}...`);
    console.log("📝 전체 토큰:", testToken);
    return testToken;
  } else {
    console.log("ℹ️ 환경변수에 테스트 토큰이 없습니다.");
    return null;
  }
};

/**
 * 개발 환경 초기화
 * - 테스트 토큰 자동 설정
 */
export const initDevEnvironment = async () => {
  if (!import.meta.env.DEV) {
    return;
  }

  console.log("🚀 개발 환경 초기화 중...");

  // 환경변수 토큰 확인
  const envToken = checkEnvTestToken();

  if (envToken) {
    console.log("ℹ️ 개발 환경에서는 환경변수 토큰이 자동으로 사용됩니다.");
    console.log(
      "💡 필요시 setDevTestToken()을 호출하여 스토리지에 저장할 수 있습니다.",
    );
  }
};

// 브라우저 콘솔에서 사용할 수 있도록 window 객체에 추가
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as any).devTokenUtils = {
    setDevTestToken,
    checkCurrentToken,
    checkEnvTestToken,
    initDevEnvironment,
  };

  console.log("💡 개발 도구가 준비되었습니다. 콘솔에서 사용 가능:");
  console.log("  - window.devTokenUtils.setDevTestToken()");
  console.log("  - window.devTokenUtils.checkCurrentToken()");
  console.log("  - window.devTokenUtils.checkEnvTestToken()");
}
