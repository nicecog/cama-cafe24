import RotatingText from "@/components/common/RotatingText";
import RotatingTextAdvanced from "@/components/common/RotatingTextAdvanced";

/**
 * Rotating Text 사용 예시 모음
 *
 * 메인 화면의 다양한 위치에서 사용할 수 있습니다.
 */

// 1. 간단한 격려 메시지
export function SimpleMotivation() {
  const messages = [
    "오늘도 화이팅! 💪",
    "건강한 하루 되세요! 🌟",
    "꾸준함이 힘입니다! ✨",
  ];

  return (
    <div className="text-center py-3">
      <RotatingText
        texts={messages}
        interval={3000}
        className="text-lg font-bold text-white"
      />
    </div>
  );
}

// 2. 헤더 서브타이틀 (슬라이드 업 효과)
export function HeaderSubtitle() {
  const subtitles = [
    "당신의 건강 여정을 응원합니다",
    "함께 이겨내는 하루하루",
    "희망을 잃지 마세요",
    "우리는 당신 곁에 있습니다",
  ];

  return (
    <RotatingTextAdvanced
      texts={subtitles}
      interval={4000}
      animationType="slide-up"
      className="text-sm text-white/80"
    />
  );
}

// 3. 통계 강조 (스케일 효과)
export function StatHighlight() {
  const stats = [
    "완료율 85% 달성! 🎉",
    "연속 7일 기록 중! 🔥",
    "목표까지 3일 남았어요! 🎯",
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-center">
      <RotatingTextAdvanced
        texts={stats}
        interval={3500}
        animationType="scale"
        className="text-base font-semibold text-gray-800"
      />
    </div>
  );
}

// 4. 팁 & 조언 (페이드 효과)
export function DailyTip() {
  const tips = [
    "💡 팁: 매일 같은 시간에 기록하면 습관이 됩니다",
    "💡 팁: 작은 목표부터 시작하세요",
    "💡 팁: 진행 상황을 주기적으로 확인하세요",
    "💡 팁: 가족과 함께 공유하면 더 힘이 됩니다",
  ];

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
      <RotatingTextAdvanced
        texts={tips}
        interval={5000}
        animationType="fade"
        className="text-sm text-yellow-800"
      />
    </div>
  );
}

// 5. 인용구 (회전 효과)
export function InspirationalQuote() {
  const quotes = [
    "작은 진전도 진전입니다",
    "오늘의 노력이 내일의 희망입니다",
    "포기하지 않는 것이 가장 큰 용기입니다",
    "당신은 생각보다 강합니다",
  ];

  return (
    <div className="text-center italic">
      <RotatingTextAdvanced
        texts={quotes}
        interval={4500}
        animationType="rotate"
        className="text-base text-gray-600"
      />
    </div>
  );
}

// 6. 메인 화면 통합 예시
export default function RotatingTextShowcase() {
  return (
    <div className="space-y-6 p-4">
      <SimpleMotivation />
      <StatHighlight />
      <DailyTip />
      <InspirationalQuote />
    </div>
  );
}
