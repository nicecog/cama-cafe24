import sleepMascot from "@/assets/images/coaching/main/type1.png";
import dietMascot from "@/assets/images/coaching/main/type2.png";
import mindMascot from "@/assets/images/coaching/main/type3.png";
import exerciseMascot from "@/assets/images/coaching/main/type4.png";

export type CoachingType = "sleep" | "meal" | "exercise" | "mind";

export const COACHING_DATA = {
  sleep: {
    dayStart: 0,
    title: "수면",
    headerDescription: (
      <>
        카마코치와 함께
        <br />
        건강한 수면 습관을 만들어 보세요.
      </>
    ),
    journeyTitle: "수면코칭 여정",
    progressLabel: "수면 코칭 진행도",
    mascot: sleepMascot,
    missions: [
      "수면 습관 가이드",
      "수면의 중요성",
      "수면 시간 확인하기",
      "규칙적인 수면 목표",
      "걱정과 생각들",
      "카페인",
      "TV 와 스마트폰",
      "불규칙한 수면 패턴",
      "1주일 회고",
      "불편한 수면 환경",
      "자기 전 음식섭취",
      "규칙적인 운동하기",
      "취침전 알콜섭취",
      "시간을 확인하기",
      "낮잠 자기",
      "저녁시간의 격한운동",
      "최종 회고",
    ],
  },
  meal: {
    dayStart: 0,
    title: "식습관",
    headerDescription: (
      <>
        카마코치와 함께
        <br />
        건강한 식습관을 만들어 보세요.
      </>
    ),
    journeyTitle: "식습관코칭 여정",
    progressLabel: "식습관 코칭 진행도",
    mascot: dietMascot,
    missions: [
      "식습관 시작하기",
      "건강한 식습관",
      "건강하게 먹는 방법",
      "식사 관련 어려움 살펴보기",
      "식사 부작용 대응하기",
      "규칙적인 식사 만들기",
      "단백질 챙기기",
      "당분 조절",
      "과일과 채소 챙기기",
      "식습관 변화 전략",
      "식재료 관리",
      "외식 전략",
      "식욕 조절",
      "음주 조절",
      "과식 조절",
      "야식 조절",
      "최종 회고",
    ],
  },
  exercise: {
    dayStart: 0,
    title: "신체활동",
    headerDescription: (
      <>
        카마코치와 함께
        <br />
        규칙적인 신체활동 습관을 만들어 보세요.
      </>
    ),
    journeyTitle: "신체활동 코칭 여정",
    progressLabel: "신체활동 코칭 진행도",
    mascot: exerciseMascot,
    missions: [
      "신체활동 가이드",
      "운동의 중요성",
      "운동습관 파악하기",
      "새로운 운동도전",
      "꾸준한 운동의 이점",
      "운동을 방해하는 요인",
      "운동 부족의 문제점",
      "꾸준한 운동 팁",
      "운동 부족의 영향",
      "운동 방해 요인 재점검",
      "근력 운동의 이점",
      "운동할 때의 주의사항1",
      "병행 운동의 이점",
      "운동 할 때의 주의사항",
      "일상 속 활동량 늘리기",
      "운동 지속 비결",
      "최종 회고",
    ],
  },
  mind: {
    dayStart: 0,
    title: "마음",
    headerDescription: (
      <>
        카마코치와 함께
        <br />
        건강한 마음 습관을 만들어 보세요.
      </>
    ),
    journeyTitle: "마음코칭 여정",
    progressLabel: "마음 코칭 진행도",
    mascot: mindMascot,
    missions: [
      "마음 코칭 시작",
      "현재 감정 들여다보기",
      "호흡 명상 기초",
      "스트레스 인지",
      "긍정 확언의 힘",
      "감사 일기 쓰기",
      "디지털 디톡스",
      "자기 자비 연습",
      "마음 챙김 식사",
      "수면과 심리",
      "불안 다스리기",
      "주말 휴식 전략",
      "감정 조절 연습",
      "집중력 향상",
      "대인 관계 심리",
      "최종 마음 습관 완성",
    ],
  },
};
