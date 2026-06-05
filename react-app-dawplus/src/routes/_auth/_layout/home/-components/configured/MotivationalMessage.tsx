import RotatingText from "@/components/common/RotatingText";

/**
 * 메인 화면에서 사용할 수 있는 Rotating Text 예시 컴포넌트
 *
 * 사용 예시:
 * <MotivationalMessage />
 */
export default function MotivationalMessage() {
  const messages = [
    "오늘도 화이팅! 💪",
    "건강한 하루 되세요! 🌟",
    "꾸준함이 힘입니다! ✨",
    "당신은 잘하고 있어요! 🎯",
    "함께 이겨내요! 💙",
    "희망을 잃지 마세요! 🌈",
  ];

  return (
    <div className="text-center py-4">
      <div className="text-lg font-semibold text-gray-700">
        <RotatingText
          texts={messages}
          interval={3000}
          className="text-primary font-bold"
        />
      </div>
    </div>
  );
}
