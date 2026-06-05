import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/chart/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello? </div>;
}
