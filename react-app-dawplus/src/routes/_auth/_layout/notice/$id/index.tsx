import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/notice/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.id,
    };
  },
});

function RouteComponent() {
  const { id } = Route.useLoaderData();

  return <div>{`Hellow -> ${id}`}</div>;
}
