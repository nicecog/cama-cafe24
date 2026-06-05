import { atom } from "jotai";
// 내 계정 정보 Atom (TanStack Query + Jotai)

// 사이드바 Open 여부
export const SidebarOpenAtom = atom<boolean>(true);

// 도움말
export const HelpPopupAtom = atom<boolean>(false);

// 내정보
export const MyPageAtom = atom<boolean>(false);

// DockBar 보임여부
export const ShowDockBarAtom = atom<boolean>(true);

// Loading 바 보임여부
export const isLoadingCountAtom = atom<number>(0);
export const isLoadingAtom = atom((get) => get(isLoadingCountAtom) > 0);
