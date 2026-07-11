import PrivacyContent from "@/components/layout/header/policy/PrivacyContent";
import TermsContent from "@/components/layout/header/policy/TermsContent";

type PolicyPageContentProps = {
  type: "terms" | "privacy";
};

export function PolicyPageContent({ type }: PolicyPageContentProps) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white px-4 py-4">
      {type === "terms" ? <TermsContent /> : <PrivacyContent />}
    </div>
  );
}
