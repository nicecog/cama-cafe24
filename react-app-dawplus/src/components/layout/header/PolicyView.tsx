import Popup from "@/components/ui/Popup";
import PrivacyContent from "./policy/PrivacyContent";
import TermsContent from "./policy/TermsContent";

type PolicyViewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: "terms" | "privacy" | "";
};

export default function PolicyView(props: PolicyViewProps) {
  // props
  const { open, setOpen, type } = props;

  // 타이틀 설정
  const title =
    type === "terms"
      ? "서비스 이용약관"
      : type === "privacy"
        ? "개인정보 처리방침"
        : "정책";

  // 콘텐츠 렌더링
  const renderContent = () => {
    switch (type) {
      case "terms":
        return <TermsContent />;
      case "privacy":
        return <PrivacyContent />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">정책을 불러올 수 없습니다.</p>
          </div>
        );
    }
  };

  return (
    <Popup open={open} setOpen={setOpen} title={title}>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        {renderContent()}
      </div>
    </Popup>
  );
}
