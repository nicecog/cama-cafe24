import type { InquiryItem, InquiryStatus } from "../types/healthData";

type Props = { items: InquiryItem[] };

const STATUS_LABEL: Record<InquiryStatus, string> = {
  pending: "답변 대기",
  answered: "답변 완료",
  closed: "종료",
};

const STATUS_CLASS: Record<InquiryStatus, string> = {
  pending: "inquiry-status--pending",
  answered: "inquiry-status--answered",
  closed: "inquiry-status--closed",
};

export default function InquiryBoard({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="chart-empty inquiry-empty">
        <span className="chart-empty-icon">💬</span>
        <p>등록된 문의사항이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="inquiry-board">
      <div className="inquiry-board-header">
        <span className="inquiry-col inquiry-col-no">번호</span>
        <span className="inquiry-col inquiry-col-title">제목</span>
        <span className="inquiry-col inquiry-col-date">등록일</span>
        <span className="inquiry-col inquiry-col-status">상태</span>
      </div>
      <ul className="inquiry-board-body">
        {items.map((item, index) => {
          const status = item.status ?? "pending";
          return (
            <li key={item.id ?? `${item.title}-${index}`} className="inquiry-row">
              <span className="inquiry-col inquiry-col-no">{items.length - index}</span>
              <div className="inquiry-col inquiry-col-title">
                <div className="inquiry-title">{item.title}</div>
                <div className="inquiry-preview">{item.preview}</div>
              </div>
              <span className="inquiry-col inquiry-col-date">{item.updatedAt}</span>
              <span className={`inquiry-col inquiry-col-status inquiry-status ${STATUS_CLASS[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
