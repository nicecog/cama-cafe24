import type { ReactElement, ReactNode } from "react";
import IconTabs from "./IconTabs";
import { SmoothTab } from "./SmoothTabs";

export type TabInfosType = {
  title: string;
  id: string;
  icon: ReactElement;
  color: string;
  content: ReactNode;
};

export default function EffectTabs(props: {
  data: TabInfosType[];
  type: "smooth" | "icon";
}) {
  const { data, type } = props;
  return (
    <>
      {
        {
          smooth: <SmoothTab data={data} />,
          icon: <IconTabs tabs={data} />,
        }[type]
      }
    </>
  );
}
