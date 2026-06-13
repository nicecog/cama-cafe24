import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DayStepFlow } from "./DayStepFlow";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({
      children,
      animate: _animate,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
    img: ({
      animate: _animate,
      transition: _transition,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement> & Record<string, unknown>) => (
      <img {...props} />
    ),
    footer: ({
      children,
      animate: _animate,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>) => (
      <footer {...props}>{children}</footer>
    ),
    button: ({
      children,
      animate: _animate,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & Record<string, unknown>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({
    pathname: "/coaching/meal/day2",
  }),
}));

vi.mock("@/hooks/usePageTranslation", () => ({
  usePageTranslation: () => ({
    pt: (key: string) => key,
  }),
}));

describe("DayStepFlow", () => {
  it("resets to step 1 when the page is mounted again", () => {
    const onSave = vi.fn();
    const firstRender = render(
      <DayStepFlow title="Meal Day 2" onSave={onSave}>
        <div>step-1-content</div>
        <div>step-2-content</div>
        <div>step-3-content</div>
      </DayStepFlow>,
    );

    fireEvent.click(screen.getByRole("button", { name: /step_flow.next/i }));
    expect(screen.getByText("step-2-content")).toBeInTheDocument();

    firstRender.unmount();

    render(
      <DayStepFlow title="Meal Day 2" onSave={onSave}>
        <div>step-1-content</div>
        <div>step-2-content</div>
        <div>step-3-content</div>
      </DayStepFlow>,
    );

    expect(screen.getByText("step-1-content")).toBeInTheDocument();
    expect(screen.queryByText("step-2-content")).not.toBeInTheDocument();
  });
});
