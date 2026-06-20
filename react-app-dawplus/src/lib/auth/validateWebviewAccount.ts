import type { WebviewAccount } from "@/apis/types";

export function isValidWebviewAccount(
  account: WebviewAccount | null | undefined,
): account is WebviewAccount {
  return !!(
    account &&
    account.seq != null &&
    account.seq > 0 &&
    account.loginId?.trim() &&
    account.name?.trim()
  );
}
