import type React from "react";

export function highlightQuotedText(text: string): React.ReactNode {
  const regex = /(['‘"“][^'’”"”]*['’”"”])/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <span
          key={`${part}-${index}`}
          className="mx-0.5 inline-block whitespace-nowrap font-extrabold text-primary"
        >
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}
