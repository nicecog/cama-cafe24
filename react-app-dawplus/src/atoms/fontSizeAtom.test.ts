import { createStore } from "jotai";
import { afterEach, describe, expect, it } from "vitest";
import {
  decreaseFontScaleAtom,
  fontScaleAtom,
  increaseFontScaleAtom,
  resetFontScaleAtom,
  updateCSSVariables,
  type FontScale,
} from "./fontSizeAtom";

const MEDIUM_BASE = "1rem";
const SMALL_BASE = "0.875rem";
const XXLARGE_BASE = "1.5rem";

describe("fontSizeAtom", () => {
  afterEach(() => {
    window.localStorage.clear();
    updateCSSVariables("medium");
  });

  it("defaults to medium scale", () => {
    const store = createStore();
    expect(store.get(fontScaleAtom)).toBe("medium");

    updateCSSVariables("medium");
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      MEDIUM_BASE,
    );
  });

  it("increases scale step by step up to xxlarge", () => {
    const store = createStore();
    const steps: FontScale[] = [
      "medium",
      "large",
      "xlarge",
      "xxlarge",
    ];

    for (let i = 1; i < steps.length; i++) {
      store.set(increaseFontScaleAtom);
      expect(store.get(fontScaleAtom)).toBe(steps[i]);
    }

    store.set(increaseFontScaleAtom);
    expect(store.get(fontScaleAtom)).toBe("xxlarge");
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      XXLARGE_BASE,
    );
  });

  it("decreases scale step by step down to small", () => {
    const store = createStore();
    store.set(fontScaleAtom, "large");

    store.set(decreaseFontScaleAtom);
    expect(store.get(fontScaleAtom)).toBe("medium");
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      MEDIUM_BASE,
    );

    store.set(decreaseFontScaleAtom);
    expect(store.get(fontScaleAtom)).toBe("small");
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      SMALL_BASE,
    );

    store.set(decreaseFontScaleAtom);
    expect(store.get(fontScaleAtom)).toBe("small");
  });

  it("resets to medium from any scale", () => {
    const store = createStore();
    store.set(fontScaleAtom, "xxlarge");

    store.set(resetFontScaleAtom);

    expect(store.get(fontScaleAtom)).toBe("medium");
    expect(document.documentElement.style.getPropertyValue("--font-base")).toBe(
      MEDIUM_BASE,
    );
  });

  it("persists scale in localStorage", () => {
    const store = createStore();
    store.set(increaseFontScaleAtom);

    expect(window.localStorage.getItem("fontScale")).toBe('"large"');
    expect(store.get(fontScaleAtom)).toBe("large");
  });
});
