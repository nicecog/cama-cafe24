import { createFileRoute } from "@tanstack/react-router";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";

export const Route = createFileRoute("/_auth/_layout/form/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-center gap-10 ">
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="text-sm pl-1.5  font-semibold">대상자 이름</label>
          <Input className="my-1" placeholder="이름" />
          <p className=" text-gray-400 text-xs font-semibold  pl-1.5">
            * 최대 입력가능한 글자는 30글자 입니다.
          </p>
        </div>

        <div>
          <label className="text-sm pl-1 pb-2 font-semibold">검사수행일</label>
          <DatePicker />
        </div>
        <div>
          <label className="text-sm pl-1 pb-2 font-semibold">대상자 이름</label>
          <Input />
        </div>
      </div>
      <div className="w-full">
        <label className="text-sm ">대상자 이름</label>
        <Input />
      </div>
    </div>
  );
}
