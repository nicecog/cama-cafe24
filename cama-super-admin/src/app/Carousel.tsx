import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide = ({ title, date, data }: any) => (
  <div className="w-full h-full">
    <div className="flex flex-col w-[200px] justify-center mx-auto">
      <div className="flex justify-center items-center text-white">
        <motion.div
          className="relative cursor-pointer"
          whileHover="hover"
          initial="initial"
        >
          <span className="text-[30px] font-semibold hover:text-yellow-300">
            {title}
          </span>
          <motion.div
            className="absolute bottom-0 left-1/2 h-[2px] bg-yellow-300"
            variants={{
              initial: { width: 0, x: "-50%" },
              hover: { width: "100%", x: "-50%" },
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
      <div className="border-t border-b text-center py-1 text-sm text-gray-400 mt-5">
        {date}
      </div>
    </div>
    <div className="flex items-center w-full mt-14 text-[28px]">
      {data.map((item: any, index: any) => (
        <div
          key={index}
          className="w-full border-r border-dashed p-2 last:border-r-0"
        >
          <p className="text-[18px]">{item.label}</p>
          <p className="font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const CustomSlideShow = ({ slides }: any) => {
  const [state, setState] = useState({
    currentIndex: 0,
    direction: 0,
    isAnimating: false, // 애니메이션 중인지 추적하는 상태
  });

  const nextSlide = useCallback(() => {
    if (state.isAnimating) return; // 애니메이션 중이면 클릭 무시

    setState((prevState) => ({
      direction: 1,
      currentIndex:
        prevState.currentIndex === slides.length - 1
          ? 0
          : prevState.currentIndex + 1,
      isAnimating: true, // 애니메이션 시작
    }));
  }, [state.isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (state.isAnimating) return; // 애니메이션 중이면 클릭 무시

    setState((prevState) => ({
      direction: -1,
      currentIndex:
        prevState.currentIndex === 0
          ? slides.length - 1
          : prevState.currentIndex - 1,
      isAnimating: true, // 애니메이션 시작
    }));
  }, [state.isAnimating, slides.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden h-full">
      <AnimatePresence
        initial={false}
        custom={state.direction}
        onExitComplete={() =>
          setState((prevState) => ({ ...prevState, isAnimating: false }))
        } // 애니메이션 완료 시
      >
        <motion.div
          key={state.currentIndex}
          custom={state.direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="w-full p-6 absolute"
        >
          <Slide {...slides[state.currentIndex]} />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2  p-2 "
      >
        우
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2  p-2 "
      >
        좌
      </button>
    </div>
  );
};

export default CustomSlideShow;
