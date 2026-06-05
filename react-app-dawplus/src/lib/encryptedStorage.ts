import SecureLS from "secure-ls";

// SecureLS 인스턴스 생성 (AES 암호화)
const secureStorage = new SecureLS({
  encodingType: "aes", // AES 암호화 사용
  isCompression: false, // 압축 비활성화 (선택사항)
  encryptionSecret:
    import.meta.env.VITE_ENCRYPTION_SECRET || "default-secret-key", // 환경변수에서 시크릿 키 가져오기
});

const ACCESS_TOKEN = "ACCESS_TOKEN";

/**
 * 암호화된 스토리지에서 토큰 가져오기
 */
export const getTokenEncryptedStorage = async (): Promise<string | null> => {
  try {
    const token = secureStorage.get(ACCESS_TOKEN);
    return token || null;
  } catch (error) {
    console.error("Failed to get token from encrypted storage:", error);
    return null;
  }
};

/**
 * 암호화된 스토리지에 토큰 저장
 */
export const setTokenEncryptedStorage = async (
  value: string,
): Promise<void> => {
  try {
    secureStorage.set(ACCESS_TOKEN, value);
  } catch (error) {
    console.error("Failed to set token to encrypted storage:", error);
    throw error;
  }
};

/**
 * 암호화된 스토리지에서 토큰 제거
 */
export const removeTokenEncryptedStorage = async (): Promise<void> => {
  try {
    secureStorage.remove(ACCESS_TOKEN);
  } catch (error) {
    console.error("Failed to remove token from encrypted storage:", error);
    throw error;
  }
};

/**
 * 암호화된 스토리지 전체 초기화
 */
export const clearEncryptedStorage = async (): Promise<void> => {
  try {
    secureStorage.clear();
  } catch (error) {
    console.error("Failed to clear encrypted storage:", error);
    throw error;
  }
};

/**
 * 범용 암호화 스토리지 유틸리티
 */
export const encryptedStorage = {
  /**
   * 값 가져오기
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = secureStorage.get(key);
      return value || null;
    } catch (error) {
      console.error(
        `Failed to get item '${key}' from encrypted storage:`,
        error,
      );
      return null;
    }
  },

  /**
   * 값 저장하기
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      secureStorage.set(key, value);
    } catch (error) {
      console.error(`Failed to set item '${key}' to encrypted storage:`, error);
      throw error;
    }
  },

  /**
   * 값 제거하기
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      secureStorage.remove(key);
    } catch (error) {
      console.error(
        `Failed to remove item '${key}' from encrypted storage:`,
        error,
      );
      throw error;
    }
  },

  /**
   * 전체 초기화
   */
  clear: async (): Promise<void> => {
    try {
      secureStorage.clear();
    } catch (error) {
      console.error("Failed to clear encrypted storage:", error);
      throw error;
    }
  },

  /**
   * 모든 키 가져오기
   */
  getAllKeys: async (): Promise<string[]> => {
    try {
      return secureStorage.getAllKeys();
    } catch (error) {
      console.error("Failed to get all keys from encrypted storage:", error);
      return [];
    }
  },
};
