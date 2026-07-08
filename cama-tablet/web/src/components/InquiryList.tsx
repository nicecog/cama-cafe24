import type { InquiryItem } from "../types/healthData";

type Props = { items: InquiryItem[] };

export default function InquiryList({ items }: Props) {
  if (items.length === 0) {
    return <p style={{ color: "#64748b", fontSize: 14 }}>등록된 문의사항이 없습니다.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((q, i) => (
        <li
          key={`${q.title}-${i}`}
          style={{
            padding: "14px 0",
            borderBottom: "1px solid #334155",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 15 }}>{q.title}</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
            {q.preview}
          </div>
          {q.updatedAt && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
              {q.updatedAt}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
