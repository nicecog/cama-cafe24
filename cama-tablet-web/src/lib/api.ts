import axios from "axios";
import type { ApiResult, DashboardData } from "../types/dashboard";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export async function scanQr(payload: string): Promise<DashboardData> {
  const { data } = await api.post<ApiResult<DashboardData>>("/api/tablet/scan", {
    payload,
  });
  if (!data.success || !data.response) {
    throw new Error(data.message ?? "스캔 처리 실패");
  }
  return data.response;
}

export async function fetchDashboard(accountSeq: number): Promise<DashboardData> {
  const { data } = await api.get<ApiResult<DashboardData>>(
    `/api/tablet/dashboard/${accountSeq}`,
  );
  if (!data.success || !data.response) {
    throw new Error(data.message ?? "대시보드 조회 실패");
  }
  return data.response;
}
