import ImageBox from "../../../component/ImageBox";
import ActivityLayout from "../../component/ActivityLayout";
import Activity3 from "@/assets/images/character/activity.png";
import Answer from "../../../component/Layout/AnswerRadio";
import { useAtom, useAtomValue } from "jotai";
import { answerAtom, cancerAtom } from "../atoms/evalAtom";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import ClearPic from "@/assets/images/character/missionClear.png";

import { motion } from "framer-motion";
const cancerList = ["대장암", "폐암", "유방암", "갑상선암"];

export default function CheckCancer() {
  // Atom
  const [cancer, setCancer] = useAtom(cancerAtom);
  const answers = useAtomValue(answerAtom);
  // Login Id
  const { loginId } = useParams();
  // Nav
  const navigate = useNavigate();

  // Alert
  const { alert, confirm } = useAlert();

  const onRadioClick = (value: string) => (_: any) => {
    if (cancer !== "" && !answers.every((r) => r === "")) {
      confirm({ html: "암종을 변경하시면 설문이 <br/> 초기화 됩니다." }, () => {
        setCancer(value);
      });
    } else {
      setCancer(value);
    }
  };

  return (
    <>
      <ActivityLayout
        title="운동평가"
        // 암종을 선택했으면 Next 안햇으면 null
        onNext={cancer ? `../E/eval/question` : null}
      >
        <h1 className="text-center pb-5 text-f12 font-oneMobile text-camaColor1 ">
          암종확인
        </h1>
        <div className="text-f5 text-center mb-5 bg-white  shadow-xl rounded-2xl p-[16px] text-camaColor font-bold ">
          <ImageBox
            imgSrc={Activity3}
            className="w-[110px]"
            containerClassName="!mb-5"
          />
          귀하에게 해당하는 암종을 <br />
          선택하여 주십시오.
        </div>

        <div className="flex flex-col ">
          {cancerList.map((r, index: number) => (
            <Answer
              onChange={onRadioClick(r)}
              checked={cancer === r}
              key={index}
              readOnly
              className={"  border-camaText"}
            >
              {`${index + 1}. ${r}`}
            </Answer>
          ))}
        </div>

        <div className={`flex justify-center  items-center mt-5  `}>
          <motion.button
            className=" border-[3px] px-[30px] py-[5px] flex  rounded-xl items-center gap-3  border-camaColor1 "
            whileTap={{ scale: 1.15 }}
            onClick={() => {
              if (cancer === "") {
                alert("암종을 선택해 주세요.");
                return;
              }
              navigate(`../E/eval/question/${loginId}`);
            }}
          >
            <img src={ClearPic} alt="clear" className="w-[55px]" />
            <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px] flex justify-start items-start">
              <span>다음</span>
            </div>
          </motion.button>
        </div>
      </ActivityLayout>
    </>
  );
}
