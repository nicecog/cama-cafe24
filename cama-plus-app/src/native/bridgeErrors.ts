import { NATIVE_BRIDGE_ERRORS, type NativeBridgeErrorCode } from '@/constants/nativeBridge.types';

export class NativeBridgeError extends Error {
  readonly code: NativeBridgeErrorCode;

  constructor(code: NativeBridgeErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'NativeBridgeError';
    this.code = code;
  }
}

export function toNativeBridgeError(error: unknown): NativeBridgeError {
  if (error instanceof NativeBridgeError) {
    return error;
  }
  if (error && typeof error === 'object') {
    const maybeCode = (error as { code?: string; message?: string }).code;
    if (
      maybeCode &&
      Object.values(NATIVE_BRIDGE_ERRORS).includes(
        maybeCode as NativeBridgeErrorCode,
      )
    ) {
      return new NativeBridgeError(maybeCode as NativeBridgeErrorCode);
    }
  }
  if (error instanceof Error) {
    const code = error.message as NativeBridgeErrorCode;
    if (Object.values(NATIVE_BRIDGE_ERRORS).includes(code)) {
      return new NativeBridgeError(code, error.message);
    }
  }
  return new NativeBridgeError(NATIVE_BRIDGE_ERRORS.UNAVAILABLE);
}
