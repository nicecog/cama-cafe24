import { createFileRoute, Link } from "@tanstack/react-router";
import { TabletSmartphone } from "lucide-react";
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
        CNT Report Test Page
      </h1>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p>1. Default 페이지 - 기본</p>

          <Link
            to="/reporting"
            className="flex items-center bg-primary p-3 rounded-lg text-white"
          >
            <TabletSmartphone /> 레포트페이지 이동
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <p>2. Portlet 페이지 - D&D 로 위치변경가능</p>

          <Link
            to="/reporting"
            className="flex items-center bg-primary p-3 rounded-lg text-white"
          >
            <TabletSmartphone /> 레포트(Portlet)페이지 이동
          </Link>
        </div>
      </div>

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
