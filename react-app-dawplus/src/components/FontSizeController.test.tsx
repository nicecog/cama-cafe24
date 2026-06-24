import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { updateCSSVariables } from "@/atoms/fontSizeAtom";
import { FontSizeController } from "./FontSizeController";

describe("FontSizeController", () => {
  afterEach(() => {
    window.localStorage.clear();
    updateCSSVariables("medium");
  });

  it("increases and decreases --font-base via header buttons", () => {
    updateCSSVariables("medium");
    render(<FontSizeController />);

    const increase = screen.getByRole("button", { name: "글자 크기 키우기" });
    const decrease = screen.getByRole("button", { name: "글자 크기 줄이기" });
    const reset = screen.getByRole("button", { name: "기본 크기로 되돌리기" });

    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1rem",
    );

    fireEvent.click(increase);
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1.125rem",
    );

    fireEvent.click(increase);
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1.25rem",
    );

    fireEvent.click(decrease);
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1.125rem",
    );

    fireEvent.click(reset);
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1rem",
    );
  });

  it("disables decrease at minimum and increase at maximum", () => {
    updateCSSVariables("medium");
    render(<FontSizeController />);

    const increase = screen.getByRole("button", { name: "글자 크기 키우기" });
    const decrease = screen.getByRole("button", { name: "글자 크기 줄이기" });

    expect(decrease).not.toBeDisabled();
    expect(increase).not.toBeDisabled();

    fireEvent.click(decrease);
    expect(decrease).toBeDisabled();

    for (let i = 0; i < 4; i++) {
      fireEvent.click(increase);
    }

    expect(increase).toBeDisabled();
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      "1.5rem",
    );
  });
});
