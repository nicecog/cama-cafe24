import MissionTitle from "../../../component/Layout/MissionTitle";
import TextArea from "../../../component/Layout/TextArea";

import Footer from "../../component/Footer";
import { motion } from "framer-motion";
import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import useAlert from "@/hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
//  신체기능의 저하
export default function Card5(props: { onSave: () => void }) {
  const { alert } = useAlert();

  const navigate = useNavigate();

  const { loginId } = useParams();

  const onClick = (check: boolean) => () => {
    const html = `아직 운동 코칭을 원하지 않으시는군요. <br/>
    카마코치와 함께 운동 습관을 <br/>길러보고 싶으시면 
    언제든 건강코칭 <span style='color :#FE8825; font-weight:bold'>'16일의 도전'</span>을 클릭하세요.`;

    if (check) {
      alert("운동코칭으로 이동합니다 ", () => {
        props.onSave();
        navigate(`../E/${loginId}`);
      });
    } else {
      alert({ html }, () => {
        props.onSave();
      });
    }
  };

  return (
    <>
      <MissionTitle className="mt-5">
        암 치료 전보다 신체 기능이 <br />
        떨어졌다고 느끼시나요?
      </MissionTitle>
      <TextArea className="mt-5 text-justify">
        아마 폐기능이 저하되어 나타나는 모습일 수 있어요. 하지만, 조금씩 운동을
        하면 신체 기능도, 폐 기능도 좋아질 수있어요,
      </TextArea>

      <TextArea className="mt-16">
        <MissionTitle>
          "카마에서 제공하는 <br />
          운동코칭을 받아보시겠어요?"
        </MissionTitle>
        <div className="flex flex-col gap-3 mt-10">
          <div className="flex gap-3   w-full">
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick(true)}
            >
              <img src={mental} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">네</p>
            </motion.button>
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick(false)}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">아니요</p>
            </motion.button>
          </div>
        </div>
      </TextArea>
      <Footer />
    </>
  );
}
