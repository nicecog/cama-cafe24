import Lottie from "lottie-react";
import { motion } from "framer-motion";

import animationData from "@/assets/lotties/fail.json";
import image from "@/assets/images/character/type1.png";
import { useEffect, useMemo, useRef } from "react";

// 저장 완료 후 축하 모달창
export default function Complete(props: any) {
  const { isOpen, onClose } = props;

  // ✅ 랜덤한 메시지를 JSX 형식으로 저장
  const messages = [
    <>
      아쉽지만 괜찮아요!
      <br />
      다시 도전하면 더 좋은 결과가 기다려요.
    </>,
    <>
      실패는 성공의 발판!
      <br />
      다음번엔 더 멋진 도전을 기대할게요.
    </>,
    <>
      오늘은 아쉬웠지만,
      <br />
      내일은 더 잘할 수 있어요!
    </>,
    <>
      모든 도전이 성공할 순 없어요.
      <br />
      포기하지 않으면 분명 성장해요!
    </>,
    <>
      조금만 더 힘내볼까요?
      <br />
      실패도 소중한 경험이에요.
    </>,
  ];
  const randomMessage = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    [isOpen]
  );

  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // 0.5배 느리게 설정
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity z-[11] 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      {/* 다이얼로그 전체 */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: isOpen ? 0 : "100%", opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative bg-white w-full max-w-md mx-4 flex flex-col items-center rounded-xl overflow-hidden z-[99]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🎉 Lottie 애니메이션 (먼저 올라옴) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 0.2,
          }}
          className="w-full"
        >
          <Lottie
            animationData={animationData}
            loop
            lottieRef={lottieRef} // ref 연결
            className="w-[320px] h-full p-4 "
          />
        </motion.div>

        {/* 🖼️ 말풍선 + 이미지 + 버튼 (딜레이 후 올라옴) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 0.4,
          }}
          className="w-full pb-3 px-4 flex items-end flex-col absolute bottom-1"
        >
          {/* 💬 말풍선 */}
          <div className="relative bg-white border border-camaColor1  py-5 px-3 rounded-lg shadow-lg mb-2">
            <p className="text-[15px] font-scDream">{randomMessage}</p>
            <div className="absolute bottom-0 right-16 translate-x-1/2 translate-y-full border-[8px] border-transparent border-t-camaColor1"></div>
          </div>

          {/* 🎭 이미지 */}
          <motion.img
            src={image}
            alt="Foreground Image"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: isOpen ? 0 : 25, opacity: isOpen ? 1 : 0 }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 12,
              delay: 0.5,
            }}
            className="w-[85px] mr-5"
          />

          {/* ✅ 버튼 */}
          <motion.button
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: isOpen ? 0 : 25, opacity: isOpen ? 1 : 0 }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 12,
              delay: 0.6,
            }}
            className="mt-3 px-4 py-2 bg-camaColor1 text-white rounded w-full"
            onClick={onClose}
          >
            미션다시도전
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
