import { motion } from "framer-motion";
import infoTitle from "@/assets/images/character/infoTitle.png";
import ImageBox from "../../component/ImageBox";

export default function CompleteCard() {
  return (
    <>
      <motion.div
        className="border bg-white rounded-xl shadow-xl pt-5 pb-7 px-2 text-f6 text-center font-oneMobile text-camaColor1"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div>
          <ImageBox
            imgSrc={infoTitle}
            className="w-[60px]"
            containerClassName="!mb-2"
          />
          설문을 모두 마쳤습니다. <br />
          결과확인을 눌러 주세요
        </div>
      </motion.div>
    </>
  );
}
