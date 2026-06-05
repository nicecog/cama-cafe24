import { Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Separator from "@/components/ui/Separator";

export default function Section7() {
  return (
    <div className=" flex flex-col h-full">
      <div className="px-12 py-2 text-md sm:text-md md:text-lg lg:text-lg font-semibold font-jalnanGothic ">
        기업 선택시 우선순위
      </div>
      <Separator />
      <div className="flex flex-row gap-0 py-4 sm:py-0 h-full  justify-center items-center">
        <div className="w-full h-full py-3 sm:py-2 flex flex-col items-center justify-center gap-2 border-0 border-primary sm:border-r ">
          <div className="flex items-center gap-1">
            <Award size={23} fill="#fff" stroke="#0066CC" />
            <Badge className="text-md rounded-lg" variant="default">
              1st
            </Badge>
          </div>
          <p className="font-jalnanGothic text-md md:text-lg lg:text-lg text-primary">
            기업성장성
          </p>
        </div>
        <div className="w-full h-full py-3 sm:py-2 flex flex-col items-center justify-center gap-2 border-0 border-primary sm:border-r ">
          <Badge className="text-md rounded-lg" variant="secondary">
            2st
          </Badge>
          <p className="font-jalnanGothic text-md md:text-lg lg:text-lg text-secondary">
            기업성장성
          </p>
        </div>
        <div className="w-full h-full py-3 sm:py-2 flex flex-col items-center justify-center gap-2   border-primary  ">
          <Badge className="text-md rounded-lg" variant="destructive">
            3st
          </Badge>
          <p className="font-jalnanGothic text-md md:text-lg lg:text-lg text-destructive">
            기업성장성
          </p>
        </div>
      </div>
    </div>
  );
}
