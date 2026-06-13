import * as React from "react";
import { useDialog } from "./useDialog";

type AlertArg = string | { html?: string; title?: string; body?: string };

function normalizeMessage(input: AlertArg) {
  if (typeof input === "string") {
    return input;
  }

  if (input.body) {
    return {
      title: input.title,
      body: input.body,
    };
  }

  if (input.html) {
    const lines = input.html.split(/<br\s*\/?>/i);
    return {
      title: input.title,
      body: React.createElement(
        React.Fragment,
        null,
        ...lines.flatMap((line, index) =>
          index === 0
            ? [line]
            : [React.createElement("br", { key: `br-${index}` }), line],
        ),
      ),
    };
  }

  return input.title ?? "";
}

export default function useAlert() {
  const { alert, confirm } = useDialog();

  return {
    alert: async (input: AlertArg, onClose?: () => void | Promise<void>) => {
      await alert(normalizeMessage(input));
      await onClose?.();
    },
    confirm: async (input: AlertArg, onConfirm?: () => void | Promise<void>) => {
      await confirm(normalizeMessage(input), async () => {
        await onConfirm?.();
      });
    },
  };
}
