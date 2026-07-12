import type { HealthDataPayload } from "../types/healthData";

/** 2~3개월 분량 테스트 데이터 생성 */
function generateMockHealthData(): HealthDataPayload {
  const stepsHistory: { date: string; steps: number }[] = [];
  const heartRateHistory: { date: string; bpm: number }[] = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const label = `${mm}-${dd}`;

    const base = 5500 + Math.sin(i / 7) * 1200;
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 1800 : 0;
    stepsHistory.push({
      date: label,
      steps: Math.round(base + weekend + (i % 5) * 400),
    });

    heartRateHistory.push({
      date: label,
      bpm: Math.round(68 + Math.sin(i / 5) * 8 + (i % 3)),
    });
  }

  const lastStep = stepsHistory[stepsHistory.length - 1];
  const lastHeart = heartRateHistory[heartRateHistory.length - 1];

  return {
    patientName: "김환자 (테스트)",
    patientId: "test-001",
    steps: lastStep?.steps,
    heartRate: lastHeart?.bpm,
    periodFrom: stepsHistory[0]?.date,
    periodTo: lastStep?.date,
    stepsHistory,
    heartRateHistory,
    inquiries: [
      {
        id: "1",
        title: "혈압 관리 방법 문의",
        preview: "아침 혈압이 140 이상으로 측정됩니다. 약 복용 시간을 조절해야 할까요?",
        createdAt: "2026-07-05",
        updatedAt: "2026-07-05",
        status: "answered",
      },
      {
        id: "2",
        title: "식이요법 관련 질문",
        preview: "나트륨 섭취를 줄이려면 어떤 음식을 피해야 하나요?",
        createdAt: "2026-07-03",
        updatedAt: "2026-07-03",
        status: "pending",
      },
      {
        id: "3",
        title: "운동 강도 조절",
        preview: "걷기 운동 시 심박수가 120을 넘으면 쉬어야 하나요?",
        createdAt: "2026-06-28",
        updatedAt: "2026-06-28",
        status: "answered",
      },
      {
        id: "4",
        title: "수면 패턴 개선",
        preview: "밤에 자주 깨는데 수면 위생 관련 팁이 있을까요?",
        createdAt: "2026-06-20",
        updatedAt: "2026-06-20",
        status: "pending",
      },
      {
        id: "5",
        title: "정기 검진 일정",
        preview: "다음 달 검진 예약 가능한 날짜를 알려주세요.",
        createdAt: "2026-06-15",
        updatedAt: "2026-06-15",
        status: "closed",
      },
    ],
  };
}

export { generateMockHealthData };