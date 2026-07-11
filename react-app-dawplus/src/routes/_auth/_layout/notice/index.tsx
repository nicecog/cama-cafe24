import { createFileRoute } from "@tanstack/react-router";
import "@/assets/fonts/jalnan-gothic.css";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const Route = createFileRoute("/_auth/_layout/notice/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="border-b-2 border-primary-light text-xl pb-2 font-jalnanGothic">
        Notice Test Page
      </h1>

      <h2 className="border-b-2 border-primary-light text-xl pb-2 font-jalnanGothic mt-10">
        Input Test
      </h2>
      <div className="flex gap-2 p-2">
        <Input placeholder="테스트" />
        <Button>제출</Button>
      </div>
    </div>
  );
}
