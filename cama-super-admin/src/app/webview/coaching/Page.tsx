import activityChar from "@/assets/images/character/activity.png";
import sleepImg from "@/assets/images/character/sleep.png";
import dietaryImg from "@/assets/images/character/dietary.png";
import excerImg from "@/assets/images/character/excercise.png";
import mentalImg from "@/assets/images/character/mental.png";
import { useNavigate, useParams } from "react-router-dom";

import Items from "./component/Items";

import { useSelector } from "react-redux";
import { getState } from "./lib/coachingSlice";
import { RootState } from "@/store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import useActivityApi from "./activity/useActivity";
import useAlert from "@/hooks/useAlert";

import { FcSettings, FcBiomass } from "react-icons/fc";

import { motion } from "framer-motion";
import MentalSchedule from "./MentalSchedule";
import { useAtom } from "jotai";
import { testPageAtom } from "./CoachingAtom";

export default function HealthCoaching() {
  // loginID

  const { loginId } = useParams();

  // alert
  const { alert } = useAlert();

  useEffect(() => {
    // 메뉴 보임
    if (window?.ReactNativeWebView) {
      window?.ReactNativeWebView.postMessage(
        JSON.stringify({ data: "", type: "BS" })
      );
    }

    //  BS : 보임 BP : 안보임
  }, []);

  const { getExerciseUserClassInfo } = useActivityApi(loginId);
  const { data: excerciseInfo } = getExerciseUserClassInfo();

  // Nav
  const navigate = useNavigate();
  // Progress
  const progress = useSelector((s: RootState) => getState(s).progress);

  // onClick
  const onClick = (type: string) => () => {
    // 546R89F827SD8 만 사용가능

    if (getProgress(progress, type) === 100) {
      alert("해당 프로그램은 100% 달성 되었습니다.");
      return;
    }

    if (type === "A") {
      navigate(`/webview/coaching/A/${loginId}`);
      return;
    }

    if (type === "C") {
      navigate(`/webview/coaching/C/${loginId}`);
      return;
    }
    if (type === "B") {
      navigate(`/webview/coaching/B/${loginId}`);
      return;
    }

    if (type === "mental") {
      navigate(`/webview/coaching/D/${loginId}`);
      return;
    }
    if (type === "activity") {
      if (!excerciseInfo) {
        alert("운동평가를 시작합니다.", () => {
          navigate(`/webview/coaching/E/eval/${loginId}`);
        });
      } else {
        navigate(`/webview/coaching/E/content/${loginId}`);
      }
    }
  };

  const getProgress = (datas: any[], type: string) =>
    datas.find((r: any) => r.categoryCd === type)?.progress || 0;

  //  심리 수정 팝업여부
  const check = useMemo(() => {
    return progress.find((r: any) => r.categoryCd === "D")?.progress || 0;
  }, [progress]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null); // useRef에 타입 지정

  const [testPage, setTestPage] = useAtom(testPageAtom);

  const handlePressStart = () => {
    longPressTimer.current = setTimeout(() => {
      alert(
        {
          html: testPage
            ? "실험실 기능을 비활성화합니다."
            : "실험실 기능을 활성화합니다.",
          icon: "warning",
        },
        () => {
          setTestPage((prev) => !prev);
        }
      );
    }, 3000); // 1초 이상 누르면 실행
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <>
      <MentalSchedule isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="py-4 px-[17px] bg-[#F7F8FA] h-dvh overflow-y-auto scrollbar">
        <div className="mt-[15px] flex items-center justify-between">
          <div>
            <h1
              className="text-[26px] font-bold
           text-[#444444]"
            >
              건강코칭
            </h1>
            <p className="text-lg text-title tracking-tighter">
              맞춤 코칭으로 관리해 보세요!
            </p>
          </div>
          <div className="flex items-center  gap-1">
            {+check > 0 ? (
              <motion.button
                className=""
                whileTap={{ scale: 1.15 }}
                onClick={() => setIsOpen(true)}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
              >
                <FcSettings className="text-[24px]" />
              </motion.button>
            ) : null}
            {testPage ? (
              <motion.button
                className=""
                whileTap={{ scale: 1.15 }}
                onClick={() => {
                  navigate(`/webview/coaching/laboratory/${loginId}`);
                }}
              >
                <FcBiomass className="text-[24px]" />
              </motion.button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 gap-y-2.5 mt-8">
          <Items
            title="수면"
            ment="카마코치와 함께 건강한 수면 습관을 만들어 보세요."
            icon={<img src={sleepImg} alt="sleep" className=" w-12 h-[60px]" />}
            progress={getProgress(progress, "A")}
            onClick={onClick("A")}
          />

          <Items
            title="식습관"
            ment="나에게 맞는 영양과 식습관 변화로 더 건강해져요."
            icon={
              <img src={dietaryImg} alt="sleep" className=" w-11 h-[60px]" />
            }
            progress={getProgress(progress, "B")}
            onClick={onClick("B")}
          />

          <Items
            title="신체 활동"
            ment="꾸준한 운동과 신체 활동으로 활기찬 하루를 시작하세요."
            icon={
              <img
                src={activityChar}
                alt="activity"
                className=" w-12 h-[60px]"
              />
            }
            progress={getProgress(progress, "C")}
            onClick={onClick("C")}
          />

          <Items
            title="심리"
            ment="나의 대처 유형에 맞게 마음을 다스려보아요."
            icon={
              <img src={mentalImg} alt="mental" className=" w-11 h-[60px]" />
            }
            progress={getProgress(progress, "D")}
            onClick={onClick("mental")}
          />
        </div>
        {/* 운동 */}
        <div className="mt-5 pb-5">
          <div
            className=" rounded-2xl  py-[16px] px-[25px] bg-white shadow-xl flex flex-col gap-2 w-full"
            onClick={onClick("activity")}
          >
            <div className="flex items-center gap-1">
              <div>
                <img src={excerImg} alt="char" className="w-[58px] h-[58px] " />
              </div>
              <div className="pl-2 w-full flex items-end justify-between">
                <div>
                  <h1 className="text-xl font-bold text-camaColor">운동하기</h1>
                  <p className="text-sm text-title tracking-tighter">
                    나에게 맞는 운동을 찾고 <br />
                    따라해보세요!
                  </p>
                </div>
                <div className="text-[24px] font-bold text-[#FE8825] mr-1">
                  {`${getProgress(progress, "E")}%`}
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-3xl  border border-[#CCCCCC] ">
              <div
                className=" h-1.5 rounded-full bg-gradient-to-r  from-[#FEBA00] to-[#FE8825]"
                style={{ width: `${getProgress(progress, "E")}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
