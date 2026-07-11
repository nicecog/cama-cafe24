import { useMemo } from "react";
import HeartRateChart from "../components/HeartRateChart";
import StepChart from "../components/StepChart";
import {
  computeHeartRateStats,
  computeStepStats,
  getPeriodLabel,
  sortByDate,
} from "../lib/healthStats";
import type { HealthDataPayload } from "../types/healthData";

type Props = { data: HealthDataPayload };

export default function HealthTab({ data }: Props) {
  const steps = useMemo(
    () => sortByDate(data.stepsHistory ?? []),
    [data.stepsHistory],
  );
  const heart = useMemo(
    () => [...(data.heartRateHistory ?? [])].sort((a, b) => {
      const la = a.date ?? a.time ?? "";
      const lb = b.date ?? b.time ?? "";
      return la.localeCompare(lb);
    }),
    [data.heartRateHistory],
  );

  const stepStats = useMemo(() => computeStepStats(steps), [steps]);
  const heartStats = useMemo(
    () => computeHeartRateStats(heart, data.heartRate),
    [heart, data.heartRate],
  );
  const periodLabel = getPeriodLabel(steps, heart, data.periodFrom, data.periodTo);

  return (
    <div className="health-tab">
      <div className="period-banner">
        <span className="period-banner-label">조회 기간</span>
        <span className="period-banner-value">{periodLabel}</span>
        <span className="period-banner-meta">
          {stepStats.days > 0 && `${stepStats.days}일`}
          {stepStats.days >= 60 && " · 약 2~3개월"}
        </span>
      </div>

      <div className="stat-grid">
        <StatCard label="오늘 걸음" value={stepStats.today.toLocaleString()} unit="걸음" accent="green" />
        <StatCard label="기간 평균" value={stepStats.avg.toLocaleString()} unit="걸음/일" accent="green" />
        <StatCard label="최고 기록" value={stepStats.max.toLocaleString()} unit="걸음" accent="green" />
        <StatCard label="목표 달성" value={`${stepStats.goalDays}`} unit={`/ ${stepStats.days}일`} accent="amber" />
        <StatCard label="현재 심박" value={`${heartStats.current}`} unit="bpm" accent="pink" />
        <StatCard label="평균 심박" value={`${heartStats.avg}`} unit="bpm" accent="pink" />
        <StatCard label="최저" value={`${heartStats.min}`} unit="bpm" accent="pink" />
        <StatCard label="최고" value={`${heartStats.max}`} unit="bpm" accent="pink" />
      </div>

      <section className="chart-panel">
        <div className="chart-panel-head">
          <h2>걸음수 추이</h2>
          <p>일별 걸음수 · 목표 8,000걸음 기준선</p>
        </div>
        <StepChart steps={steps} height={300} />
      </section>

      <section className="chart-panel">
        <div className="chart-panel-head">
          <h2>심박수 추이</h2>
          <p>기간 내 심박 변화 · 녹색 영역은 정상 범위(60~100 bpm)</p>
        </div>
        <HeartRateChart latestBpm={data.heartRate} history={heart} height={280} />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: "green" | "pink" | "amber";
}) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">
        {value}
        <span className="stat-card-unit">{unit}</span>
      </div>
    </div>
  );
}
