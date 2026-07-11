import { format } from "date-fns";
import type { WebviewNotification, WebviewStepInfo } from "@/apis/types";
import type { TabletHealthDataPayload } from "./tabletTransfer.types";

type BuildPayloadInput = {
  patientName?: string;
  patientId?: string | number;
  todaySteps?: number | null;
  stepHistory?: WebviewStepInfo[];
  notifications?: WebviewNotification[];
};

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

  const inquiries = (input.notifications ?? []).slice(0, 10).map((n) => ({
    id: String(n.seq),
    title: n.message.slice(0, 40),
    preview: n.message,
    updatedAt: n.createdAt.split(" ")[0],
    status: "pending" as const,
  }));

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
