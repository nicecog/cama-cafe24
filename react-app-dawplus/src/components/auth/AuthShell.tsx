import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  backTo?: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  backTo,
}: AuthShellProps) {
  return (
    <section className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
        {backTo ? (
          <Link
            to={backTo}
            className="mb-8 inline-flex w-fit text-sm text-white/70 transition hover:text-white"
          >
            이전
          </Link>
        ) : (
          <div className="mb-12" />
        )}

        {(title || subtitle) && (
          <header className={cn("mb-8 space-y-2", !title && "mb-6")}>
            {title ? (
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            ) : null}
            {subtitle ? (
              <p className="text-base leading-6 text-white/65">{subtitle}</p>
            ) : null}
          </header>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
