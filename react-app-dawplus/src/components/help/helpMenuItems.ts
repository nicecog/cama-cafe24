import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  Heart,
  Search,
  Settings,
  Sparkles,
  UserPlus,
} from "lucide-react";

export type HelpMenuItem = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

/** cama-billive HelpPageMainScreen / HelpPopup 과 동일 6항목 */
export const helpMenuItems: HelpMenuItem[] = [
  {
    id: 1,
    title: "회원가입 · 로그인",
    description: "Cama+ 회원가입과 로그인",
    icon: UserPlus,
    color: "text-pink-400",
  },
  {
    id: 2,
    title: "암정보가이드 설정",
    description: "맞춤 암정보를 설정하고 관리",
    icon: Settings,
    color: "text-purple-400",
  },
  {
    id: 3,
    title: "암정보 검색방법",
    description: "원하는 암정보를 검색하고 알아보기",
    icon: Search,
    color: "text-blue-400",
  },
  {
    id: 4,
    title: "콘텐츠 즐겨찾기",
    description: "콘텐츠를 저장하고 쉽게 다시 찾아보기",
    icon: Heart,
    color: "text-rose-400",
  },
  {
    id: 5,
    title: "웰빙자원 안내",
    description: "건강한 삶을 위한 자원연결",
    icon: Sparkles,
    color: "text-amber-400",
  },
  {
    id: 6,
    title: "건강코칭 사용법",
    description: "생활 습관개선을 위한 맞춤형코칭",
    icon: Dumbbell,
    color: "text-emerald-400",
  },
];
