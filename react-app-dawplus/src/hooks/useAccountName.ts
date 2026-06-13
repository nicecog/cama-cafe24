import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";

export default function useAccountName() {
  const accountMe = useAtomValue(accountMeAtom);

  return accountMe.data?.name || accountMe.data?.nickName || "";
}
