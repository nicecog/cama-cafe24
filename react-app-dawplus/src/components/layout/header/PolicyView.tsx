import { PolicyPageContent } from "@/components/mypage/PolicyPageContent";
import Popup from "@/components/ui/Popup";

type PolicyViewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: "terms" | "privacy" | "";
};

export default function PolicyView(props: PolicyViewProps) {
  const { open, setOpen, type } = props;
  const title =
    type === "terms"
      ? "서비스 이용약관"
      : type === "privacy"
        ? "개인정보 처리방침"
        : "정책";

  if (type !== "terms" && type !== "privacy") return null;

  return (
    <Popup open={open} setOpen={setOpen} title={title}>
      <PolicyPageContent type={type} />
    </Popup>
  );
}
