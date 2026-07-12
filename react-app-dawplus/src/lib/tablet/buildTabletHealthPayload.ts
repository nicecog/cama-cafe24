import { format } from "date-fns";
import type {
  WebviewConsultationInquiry,
  WebviewStepInfo,
} from "@/apis/types";
import type { TabletHealthDataPayload } from "./tabletTransfer.types";

type BuildPayloadInput = {
  patientName?: string;
  patientId?: string | number;
  todaySteps?: number | null;
  stepHistory?: WebviewStepInfo[];
  /** 미전송(transmitted=false) 진찰시 문의사항만 전달 */
  inquiries?: WebviewConsultationInquiry[];
};

function formatInquiryDate(value?: string) {
  if (!value) return "";
  const datePart = value.split(" ")[0];
  try {
    return format(new Date(datePart), "yyyy-MM-dd");
  } catch {
    return datePart;
  }
}

export function buildTabletHealthPayload(
  input: BuildPayloadInput,
): TabletHealthDataPayload {
  const sortedSteps = [...(input.stepHistory ?? [])].sort(
    (a, b) =>
      new Date(a.executionDate).getTime() -
      new Date(b.executionDate).getTime(),
  );

  const stepsHistory = sortedSteps.slice(-7).map((row) => ({
    date: format(new Date(row.executionDate), "MM-dd"),
    steps: row.stepNum,
  }));

  const pendingInquiries = (input.inquiries ?? []).filter(
    (item) => !item.transmitted,
  );

  const inquiries = pendingInquiries.map((item) => {
    const createdAt = formatInquiryDate(item.createdAt);
    return {
      id: String(item.seq),
      title: item.title,
      preview: item.content,
      createdAt,
      updatedAt: createdAt,
      status: "pending" as const,
    };
  });

  const periodFrom = sortedSteps[0]?.executionDate?.split(" ")[0];
  const periodTo = sortedSteps[sortedSteps.length - 1]?.executionDate?.split(
    " ",
  )[0];

  return {
    patientName: input.patientName,
    patientId: input.patientId != null ? String(input.patientId) : undefined,
    steps: input.todaySteps ?? sortedSteps[sortedSteps.length - 1]?.stepNum,
    stepsHistory,
    inquiries,
    periodFrom,
    periodTo,
  };
}
