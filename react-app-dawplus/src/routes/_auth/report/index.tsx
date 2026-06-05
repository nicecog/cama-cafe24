import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { House, Layers2, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/auth";
import "@/assets/fonts/jalnan-gothic.css";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/lib/utils";
import Header from "./-components/Header";
import Section1 from "./-components/Section1";
import Section2 from "./-components/Section2";
import Section2Sub from "./-components/Section2Sub";
import Section3 from "./-components/Section3";
import Section4 from "./-components/Section4";
import Section5 from "./-components/Section5";
import Section6 from "./-components/Section6";
import Section7 from "./-components/Section7";

export const Route = createFileRoute("/_auth/report/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { confirm } = useDialog();
  const auth = useAuth();

  const router = useRouter();
  const navigate = useNavigate();

  const onLogout = () => {
    confirm(
      {
        title: "로그아웃",
        body: "로그아웃 하시겠습니까?",
        actionButton: "로그아웃",
      },
      () => {
        auth.logout().then(() => {
          router.invalidate().finally(() => {
            navigate({ to: "/" });
          });
        });
      },
    );
  };

  return (
    <div className=" sm:max-w-[1240px] sm:mx-auto ">
      <div className="flex flex-col  min-h-screen gap-4 sm:p-10 p-8">
        <div className="flex flex-col gap-1 ">
          <div className="flex justify-between items-center">
            <div className=" font-bold whitespace-nowrap overflow-hidden  hidden sm:block text-xl md:text-2xl lg:text-2xl font-jalnanGothic ">
              중앙대학교의료원 행정직(계약집)모집_AI 역량검사
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={"/report/portlet"}
                className="hover:scale-105 transition-transform duration-300 ease-in-out bg-primary hover:bg-primary-hover p-1 rounded-lg"
              >
                <Layers2 stroke="#0066CC" fill="#fff" />
              </Link>
              <Link
                to={"/notice"}
                className="hover:scale-105 transition-transform duration-300 ease-in-out bg-primary hover:bg-primary-hover p-1 rounded-lg"
              >
                <House stroke="#0066CC" fill="#fff" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-primary-hover p-1 rounded-lg"
              >
                <LogOut stroke="#0066CC" fill="#fff" />
              </button>
            </div>
          </div>
          {/* 헤더 */}
          <Header />
        </div>
        {/* 그리드 영역 */}

        <div className="flex-1 grid grid-cols-1   sm:grid-cols-2 gap-5 auto-rows-[minmax(100px,_auto)] sm:auto-rows-[minmax(190px,_auto)]">
          <SectionWrapper className="row-span-2 sm:row-span-2 md:row-span-2 lg:row-span-2 ">
            <Section1 />
          </SectionWrapper>
          <SectionWrapper className="row-span-2 block sm:block md:block lg:hidden bg-transparent border-0 ">
            <Section2Sub />
          </SectionWrapper>
          <SectionWrapper className="row-span-2 hidden sm:hidden md:hidden lg:block bg-transparent border-0 hover:scale-100 ">
            <Section2 />
          </SectionWrapper>
          <SectionWrapper className="">
            <Section3 />
          </SectionWrapper>
          <SectionWrapper className="">
            <Section4 />
          </SectionWrapper>
          <SectionWrapper className="">
            <Section5 />
          </SectionWrapper>
          <SectionWrapper className="sm:row-span-2 ">
            <Section6 />
          </SectionWrapper>
          <SectionWrapper className="">
            <Section7 />
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
}

const SectionWrapper = (props: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary bg-white ",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
