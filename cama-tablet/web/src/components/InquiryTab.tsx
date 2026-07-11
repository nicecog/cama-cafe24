import InquiryBoard from "../components/InquiryBoard";
import type { InquiryItem } from "../types/healthData";

type Props = { items: InquiryItem[] };

export default function InquiryTab({ items }: Props) {
  const pending = items.filter((i) => (i.status ?? "pending") === "pending").length;
  const answered = items.filter((i) => i.status === "answered").length;

  return (
    <div className="inquiry-tab">
      <div className="inquiry-summary">
        <div className="inquiry-summary-item">
          <span className="inquiry-summary-count">{items.length}</span>
          <span className="inquiry-summary-label">전체</span>
        </div>
        <div className="inquiry-summary-item inquiry-summary-item--pending">
          <span className="inquiry-summary-count">{pending}</span>
          <span className="inquiry-summary-label">답변 대기</span>
        </div>
        <div className="inquiry-summary-item inquiry-summary-item--answered">
          <span className="inquiry-summary-count">{answered}</span>
          <span className="inquiry-summary-label">답변 완료</span>
        </div>
      </div>
      <InquiryBoard items={items} />
    </div>
  );
}
