import Detail1 from "@/components/layout/header/details/Detail1";
import Detail2 from "@/components/layout/header/details/Detail2";
import Detail3 from "@/components/layout/header/details/Detail3";
import Detail4 from "@/components/layout/header/details/Detail4";
import Detail5 from "@/components/layout/header/details/Detail5";
import Detail6 from "@/components/layout/header/details/Detail6";
import { helpMenuItems } from "./helpMenuItems";

const detailMap: Record<number, React.ReactNode> = {
  1: <Detail1 />,
  2: <Detail2 />,
  3: <Detail3 />,
  4: <Detail4 />,
  5: <Detail5 />,
  6: <Detail6 />,
};

export function getHelpDetailContent(id: number) {
  return detailMap[id] ?? <Detail1 />;
}

export function getHelpDetailTitle(id: number) {
  return helpMenuItems.find((item) => item.id === id)?.title ?? "도움말";
}

export function isValidHelpDetailId(id: number) {
  return id >= 1 && id <= 6;
}
