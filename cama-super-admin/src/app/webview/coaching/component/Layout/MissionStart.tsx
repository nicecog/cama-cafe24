import Lottie from "lottie-react";
import { motion } from "framer-motion";

import animationData from "@/assets/lotties/mission.json";
import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { MissionStartAtom } from "../../CoachingAtom";
import { useResetAtom } from "jotai/utils";
import { useNavigate, useParams } from "react-router-dom";

// 저장 완료 후 축하 모달창
export default function MissionStart() {
  const isOpen = useAtomValue(MissionStartAtom);

  const reset = useResetAtom(MissionStartAtom);

  const navigate = useNavigate();

  const { loginId } = useParams();
  // ✅ 랜덤한 메시지를 JSX 형식으로 저장
  const messages = [
    <>
      도전 시작!
      <br /> 작은 시작이 큰 변화를 만듭니다.
    </>,
    <>
      첫걸음 내딛기!
      <br /> 꾸준히 나아가면 멋진 결과가 기다려요.
    </>,
    <>
      이제 시작!
      <br /> 하나하나가 큰 변화를 만들어갑니다.
    </>,
    <>매일 성장하는 자신을 응원해요!</>,
  ];

  const onCloseHandler = () => {
    reset();
    navigate(`/webview/coaching/${loginId}`, { state: { reload: true } });
  };

  const randomMessage = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    [isOpen]
  );

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
            className="w-full h-full object-contain -mt-8"
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
          className="w-full pb-3 px-4 flex items-end flex-col -mt-14"
        >
          {/* 💬 말풍선 */}
          <div className="relative bg-white   w-full   py-5 px-3 rounded-lg   ">
            <p className="text-[16px] font-scDream">{randomMessage}</p>
          </div>

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
            className="mt-1 px-4 py-2 bg-camaColor1 text-white rounded w-full"
            onClick={onCloseHandler}
          >
            미션시작하기
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
