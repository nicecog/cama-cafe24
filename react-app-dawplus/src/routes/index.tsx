import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: ({ location }) => {
    if (location.pathname !== import.meta.env.VITE_DEFAULT_PAGE) {
      throw redirect({ to: import.meta.env.VITE_DEFAULT_PAGE });
    }
  },
});
