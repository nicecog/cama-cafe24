import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MouseEvent, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import useProgress from "@/hooks/useProgress";
import MotionButton from "../MotionButton";
import useAlert from "@/hooks/useAlert";

type CalendarType = {
  onSelect: (e: string) => void;
  stepDayCd: string;
  type: "A" | "B" | "C" | "D" | "E";
};

export default function Calendar(props: CalendarType) {
  const { onSelect, stepDayCd, type } = props;

  const { loginId } = useParams();
  const navigate = useNavigate();

  const { confirm } = useAlert();

  const [selectedDay, setSelectedDay] = useState(stepDayCd);

  useEffect(() => {
    setSelectedDay(stepDayCd);
  }, [stepDayCd]);

  const onSelectDay = (day: number) => () => {
    setSelectedDay(String(day).padStart(2, "0"));
  };

  const onBack = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    confirm("건강코칭 화면으로 돌아가시겠습니까? ", () => {
      navigate(`../${loginId}`, { state: { reload: true } });
    });
  };

  const onSelectHandler = () => {
    onSelect(selectedDay);
  };

  const [sleep, dietaryHabits, exercise, mental, activity] = useProgress([
    "A",
    "B",
    "C",
    "D",
    "E",
  ]);

  const typeMap = {
    A: { max: 16, progress: sleep },
    B: { max: 16, progress: dietaryHabits },
    C: { max: 16, progress: exercise }, // 운동
    D: { max: 16, progress: mental },
    E: { max: 16, progress: activity },
  };
  const types = typeMap[type] || { max: 0, progress: 0 };

  return (
    <>
      <div className="bg-white h-dvh">
        <div className="fixed top-0 w-full bg-white z-10">
          <div className=" h-[50px] flex justify-center items-center px-3 border-b">
            <a href="#" onClick={onBack} className="absolute top-3.5 left-2 ">
              <MdClose className="text-[#BBBBBB] font-extrabold text-[23px]" />
            </a>
            <span className="text-base  text-text">지난 응답 보기</span>
          </div>
          <div className="h-[40px] shadow-md flex justify-start items-center font-bold text-[14px]">
            <div className="text-sm font-bold ml-[20px] text-[#777777]">
              일자를 선택해 주세요
            </div>
          </div>
        </div>
        <section className="pt-[100px] pb-[60px] overflow-y-auto h-full text-lg">
          <div className="block px-[30px]  py-[20px]">
            <div className="flex  justify-start mb-1 items-center text-f5 font-bold">
              <span className="  text-camaColorLight mr-1">
                {types.progress}%
              </span>
              완료했어요!
            </div>
            <div className="w-full rounded-full h-4 border-[#EEEEEE] border">
              <motion.div
                className="bg-gradient-to-r  from-[#FEBA00] to-[#FE8825] h-3.5 rounded-full "
                initial={{ width: "0%" }}
                animate={{ width: `${types.progress}%` }}
                transition={{ duration: 2 }}
              />
            </div>

            {/* 달력시작 */}
            <div className="pt-5 bg-white grid grid-cols-4 gap-2">
              {Array(types.max + 1)
                .fill(null)
                .map((_, idx: number) => (
                  <MotionButton
                    onClick={onSelectDay(idx)}
                    active={+selectedDay === idx}
                    key={idx}
                    disabled={idx > +stepDayCd}
                    day={idx}
                    isComplete={idx < +stepDayCd}
                  />
                ))}
            </div>
          </div>
          <div className="fixed bottom-0 w-full h-[60px]    border-t">
            <button
              className={`w-full h-full bg-camaColor1 text-white font-bold text-xl`}
              onClick={onSelectHandler}
            >
              시작하기
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
