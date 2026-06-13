import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth/_coaching/coaching/mind/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: "/coaching/mental",
      replace: true,
    });
  }, [navigate]);

  return null;
}
