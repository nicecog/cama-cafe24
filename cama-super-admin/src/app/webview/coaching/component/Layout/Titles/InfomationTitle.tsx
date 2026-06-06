import { ReactNode } from "react";
import InfoTitleImg from "@/assets/images/character/infoTitle.png";
import useFontSize from "@/hooks/useFontSize";

export default function InfomationTitle(props: {
  children: ReactNode;
  className?: string;
}) {
  const [fontSize] = useFontSize([12]);

  return (
    <>
      <h1
        className={`${props.className} flex justify-center items-center gap-1.5 px-2 leading-[34px]`}
        style={{ fontSize }}
      >
        <div className="w-[27px]">
          <img src={InfoTitleImg} alt="infoTitle" className="w-[27px]" />
        </div>
        <div className="w-full text-center">{props.children}</div>
      </h1>
    </>
  );
}
