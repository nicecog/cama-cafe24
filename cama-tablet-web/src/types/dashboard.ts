export type PatientSummary = {
  seq: number;
  loginId: string;
  name: string;
  birth?: string;
  gender?: string;
  diseaseName?: string;
  userTypeNm?: string;
};

export type StepDaily = {
  executionDate: string;
  stepNum: number;
};

export type CoachingCategory = {
  categoryCd: string;
  categoryNm: string;
  progress: number;
};

export type Inquiry = {
  contentsSeq: number;
  title: string;
  preview: string;
  updatedAt: string;
};

export type HeartRate = {
  available: boolean;
  message: string;
  latestBpm?: number;
  measuredAt?: string;
};

export type DashboardData = {
  patient: PatientSummary;
  steps: StepDaily[];
  stepsToday: number;
  stepsAvg7d: number;
  coaching: CoachingCategory[];
  inquiries: Inquiry[];
  heartRate: HeartRate;
};

export type ApiResult<T> = {
  success: boolean;
  message?: string;
  response: T;
};
