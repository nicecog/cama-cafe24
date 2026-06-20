import { atom } from "jotai";
import type { WebviewAccount } from "@/apis/types";

const SESSION_KEY = "cama.auth.session";

export interface AuthSession {
  loginId: string;
  account: WebviewAccount;
}

export const WEBVIEW_SESSION_STORAGE_KEY = SESSION_KEY;

export function readStoredWebviewSession(): AuthSession | null {
  return readStoredSession();
}

function readStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export const authSessionAtom = atom<AuthSession | null>(readStoredSession());

export const setAuthSessionAtom = atom(
  null,
  (_get, set, session: AuthSession | null) => {
    writeStoredSession(session);
    set(authSessionAtom, session);
  },
);
