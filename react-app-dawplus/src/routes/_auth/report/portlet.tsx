import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowBigLeft } from "lucide-react";
import type { ReactNode } from "react";
import "@/assets/fonts/jalnan-gothic.css";
import { cn } from "@/lib/utils";
import Header from "./-components/Header";
import Section1 from "./-components/Section1";
import Section2Sub from "./-components/Section2Sub";
import Section3 from "./-components/Section3";
import Section4 from "./-components/Section4";
import Section5 from "./-components/Section5";
import Section6 from "./-components/Section6";
import Section7 from "./-components/Section7";

export const Route = createFileRoute("/_auth/report/portlet")({
  component: RouteComponent,
});

function RouteComponent() {
  const [parent, tapes] = useDragAndDrop<
    HTMLDivElement,
    { id: string; content: ReactNode; className?: string }
  >(
    [
      { id: "section1", content: <Section1 />, className: "" },
      { id: "section2", content: <Section2Sub />, className: " " },
      { id: "section3", content: <Section3 />, className: "" },
      { id: "section4", content: <Section4 />, className: "" },
      { id: "section5", content: <Section5 />, className: "" },
      { id: "section6", content: <Section6 />, className: " row-span-2" },
      { id: "section7", content: <Section7 />, className: " " },
    ],
    {
      plugins: [animations()],
    },
  );

  return (
    <div className="sm:max-w-[1240px] sm:mx-auto">
      <div className="flex flex-col min-h-screen gap-4 sm:p-10 p-8">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className=" font-bold whitespace-nowrap overflow-hidden  hidden sm:block text-2xl font-jalnanGothic">
              중앙대학교의료원 행정직(계약집)모집_AI 역량검사
            </div>
            <Link
              to={"/report"}
              className="hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <ArrowBigLeft stroke="#0066CC" fill="#fff" size={30} />
            </Link>
          </div>
          <Header />
        </div>

        <div ref={parent} className="grid gap-5 md:grid-cols-2">
          {tapes.map((tape) => (
            <div
              className={cn(
                "min-h-[200px]",
                tape.id !== "section2"
                  ? "rounded-lg border border-primary bg-white"
                  : "",
                tape?.className,
              )}
              data-label={tape}
              key={tape.id}
            >
              {tape.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
