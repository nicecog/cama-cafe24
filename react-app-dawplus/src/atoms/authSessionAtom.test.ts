import { createStore } from "jotai";
import { afterEach, describe, expect, it } from "vitest";
import {
  authSessionAtom,
  readStoredWebviewSession,
  setAuthSessionAtom,
} from "./authSessionAtom";

describe("authSessionAtom", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("persists the webview session in localStorage for app relaunches", () => {
    const store = createStore();
    const session = {
      loginId: "happycog",
      account: {
        seq: 121,
        loginId: "happycog",
        email: "happycog@gmail.com",
      },
    };

    store.set(setAuthSessionAtom, session as never);

    expect(JSON.parse(window.localStorage.getItem("cama.auth.session") || "null"))
      .toMatchObject({
        loginId: "happycog",
        account: {
          seq: 121,
          loginId: "happycog",
        },
      });
    expect(readStoredWebviewSession()).toMatchObject({
      loginId: "happycog",
    });
    expect(store.get(authSessionAtom)).toMatchObject({
      loginId: "happycog",
    });
  });
});
