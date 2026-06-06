import { motion } from "framer-motion";
import Activity1 from "@/assets/images/character/excercise.png";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { workOutAtom } from "./atoms/contentAtom";
import useActivityApi, { getCodeName } from "../useActivity";
import Images from "@/assets/images/character/complete.png";

export default function Workouts() {
  // Login Id
  const { loginId } = useParams();

  // confirm
  const { confirm } = useAlert();
  // navi
  const navigate = useNavigate();

  const { getExerciseContentList, getAnswerList } = useActivityApi(loginId);

  const setWorkout = useSetAtom(workOutAtom);

  // 운동선택
  const onWorkoutClick = (info: any) => () => {
    confirm(
      {
        html: `<span style="color : #774F2D;  font-weight: 700;">${info.korName}</span> <br/> 시작 하시겠습니까?`,
      },
      () => {
        setWorkout(info);
        navigate(`../E/content/workoutContent/${loginId}`);
      }
    );
  };

  const { data: contentList } = getExerciseContentList();

  const { data: answerList = [] } = getAnswerList();

  //  답변이 있는 항목들만 조회
  const contens = contentList
    .filter((r: any) =>
      answerList
        ?.map((item: any) => item.refVal1)
        .includes(r.indexNum + r.exerciseTypeCd + r.difficultyCd)
    )
    .sort(
      (a: any, b: any) =>
        a.exerciseTypeCd.localeCompare(b.exerciseTypeCd) ||
        a.indexNum - b.indexNum
    );

  return (
    <>
      <div className="flex flex-col gap-2 pb-5">
        {contens.map((item: any, itemKey: number) => (
          <div key={itemKey}>
            <motion.button
              className="flex border px-4 py-2 rounded-xl shadow-lg bg-white  w-full gap-3 justify-between items-center relative "
              whileTap={{ scale: 1.05 }}
              onClick={onWorkoutClick(item)}
            >
              {answerList
                .filter((r: any) => r.answerChoice === "Y")
                .map((it: any) => it.refVal1)
                .includes(
                  item.indexNum + item.exerciseTypeCd + item.difficultyCd
                ) && (
                <div className="absolute top-1.5 right-2 ">
                  <img src={Images} className="w-[25px]" />
                </div>
              )}

              <div className="flex flex-col items-center justify-center w-[120px] ">
                <div className="flex justify-center w-[40px]">
                  <img src={Activity1} className="w-[35px]" />
                </div>
                <div className="text-f2 font-oneMobile text-camaColor1 text-center w-full">
                  {`[${
                    ["폐암", "대장암", "유방암", "갑상선암"].includes(
                      getCodeName(item.exerciseTypeCd)
                    )
                      ? getCodeName(item.difficultyCd)
                      : getCodeName(item.exerciseTypeCd)
                  }]`}
                </div>
              </div>

              <div className="w-full inline-block tracking-tighter pr-6">
                {item.korName}
              </div>
            </motion.button>
          </div>
        ))}
      </div>
    </>
  );
}
