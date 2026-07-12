import { useEffect, useState } from "react";
import type { InquiryItem } from "../types/healthData";

type Props = { items: InquiryItem[] };

function formatWrittenDate(item: InquiryItem) {
  const raw = item.createdAt || item.updatedAt || "";
  return raw.split(" ")[0] || "-";
}

export default function InquiryBoard({ items }: Props) {
  const [selected, setSelected] = useState<InquiryItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  if (items.length === 0) {
    return (
      <div className="chart-empty inquiry-empty">
        <span className="chart-empty-icon">💬</span>
        <p>등록된 문의사항이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="inquiry-board">
        <div className="inquiry-board-header">
          <span className="inquiry-col inquiry-col-no">번호</span>
          <span className="inquiry-col inquiry-col-title">제목</span>
          <span className="inquiry-col inquiry-col-date">작성일</span>
          <span className="inquiry-col inquiry-col-action">확인</span>
        </div>
        <ul className="inquiry-board-body">
          {items.map((item, index) => (
            <li
              key={item.id ?? `${item.title}-${index}`}
              className="inquiry-row"
            >
              <span className="inquiry-col inquiry-col-no">
                {items.length - index}
              </span>
              <div className="inquiry-col inquiry-col-title">
                <div className="inquiry-title">{item.title}</div>
              </div>
              <span className="inquiry-col inquiry-col-date">
                {formatWrittenDate(item)}
              </span>
              <span className="inquiry-col inquiry-col-action">
                <button
                  type="button"
                  className="inquiry-view-btn"
                  onClick={() => setSelected(item)}
                >
                  내용확인
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <div
          className="inquiry-modal-backdrop"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            className="inquiry-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="inquiry-modal-header">
              <div>
                <p className="inquiry-modal-eyebrow">문의사항 상세</p>
                <h2 id="inquiry-modal-title" className="inquiry-modal-title">
                  {selected.title}
                </h2>
                <p className="inquiry-modal-meta">
                  작성일 {formatWrittenDate(selected)}
                </p>
              </div>
              <button
                type="button"
                className="inquiry-modal-close"
                onClick={() => setSelected(null)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="inquiry-modal-body">
              <p className="inquiry-modal-content">
                {selected.preview || "내용이 없습니다."}
              </p>
            </div>
            <div className="inquiry-modal-footer">
              <button
                type="button"
                className="inquiry-modal-confirm"
                onClick={() => setSelected(null)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
