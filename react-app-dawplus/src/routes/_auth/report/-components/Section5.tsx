import { BadgeCheck } from "lucide-react";
import Separator from "@/components/ui/Separator";

export default function Section5() {
  return (
    <div className=" flex flex-col h-full">
      <div className="px-12 py-2 text-md sm:text-md md:text-lg lg:text-lg font-semibold font-jalnanGothic ">
        중요가치관
      </div>
      <Separator />
      <div className="w-full h-full flex items-center px-4 py-4 ">
        <ul className="gap-2 flex flex-col items-center w-full  ">
          <li className="bg-primary-thin/50 w-full py-1.5 px-3 rounded-lg text-primary font-bold flex items-center gap-2.5">
            <BadgeCheck /> 새로운 일에 도전하는것1
          </li>
          <li className="bg-primary-thin/50 w-full py-1.5 px-3 rounded-lg text-primary font-bold flex items-center gap-2.5">
            <BadgeCheck /> 새로운 일에 도전하는것2
          </li>
          <li className="bg-primary-thin/50 w-full py-1.5 px-3 rounded-lg text-primary font-bold flex items-center gap-2.5">
            <BadgeCheck />
            새로운 일에 도전하는것3
          </li>
        </ul>
      </div>
    </div>
  );
}
