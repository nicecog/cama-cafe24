import { describe, expect, it } from "vitest";
import { isValidWebviewAccount } from "./validateWebviewAccount";

describe("isValidWebviewAccount", () => {
  it("returns false when the account name is missing", () => {
    expect(
      isValidWebviewAccount({
        seq: 121,
        loginId: "happycog",
        email: "happycog@gmail.com",
        nickName: null,
        name: "",
        phone: "01032984763",
        birth: "1973-11-28",
        gender: "MALE",
        signType: "DEFAULT",
        profileImage: null,
        impUid: "imp_1",
        roles: ["USER"],
        droppedOutDate: null,
        dropReason: null,
        userTypeCd: "20",
        createdAt: "2024-02-16 12:16:13",
        updatedAt: "2024-02-16 12:16:13",
      }),
    ).toBe(false);
  });

  it("returns true when the required account fields are present", () => {
    expect(
      isValidWebviewAccount({
        seq: 121,
        loginId: "happycog",
        email: "happycog@gmail.com",
        nickName: null,
        name: "최완규",
        phone: "01032984763",
        birth: "1973-11-28",
        gender: "MALE",
        signType: "DEFAULT",
        profileImage: null,
        impUid: "imp_1",
        roles: ["USER"],
        droppedOutDate: null,
        dropReason: null,
        userTypeCd: "20",
        createdAt: "2024-02-16 12:16:13",
        updatedAt: "2024-02-16 12:16:13",
      }),
    ).toBe(true);
  });
});
