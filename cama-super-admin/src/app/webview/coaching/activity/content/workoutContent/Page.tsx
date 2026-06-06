import ActivityLayout from "../../component/ActivityLayout";
import { useAtomValue, useSetAtom } from "jotai";
import { onCompleteAtom, workOutAtom } from "../atoms/contentAtom";
import ReactPlayer from "react-player/youtube";
import TextArea from "../../../component/Layout/TextArea";
import ClearPic from "@/assets/images/character/missionClear.png";

import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import useActivityApi, { getCodeName } from "../../useActivity";
import { FcHighPriority } from "react-icons/fc";
import { useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";

import contentsData from "../content.json";
import axios from "@/utils/axios";
import Complete from "./CompleteModal";

export default function WorkoutContentPage() {
  //  Info
  const info = useAtomValue(workOutAtom);

  const { alert, confirm } = useAlert();
  // Login Id
  const { loginId } = useParams();
  // Nav
  const navigate = useNavigate();

  const { getAnswerList } = useActivityApi(loginId);

  const onCompleteHandler = useSetAtom(onCompleteAtom);

  const { data: answerList } = getAnswerList();

  useEffect(() => {
    if (!info.url) {
      alert(
        { html: "운동정보가 초기화 되어 <br/>목록으로 이동합니다." },
        () => {
          navigate(`../E/content/${loginId}`);
        }
      );
      return;
    }
  }, [info]);

  // 완료 빵빠래
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onComplete = () => {
    const _alert = contentsData.find((r) => r.korName === info.korName);

    //  타입별 문구 변경
    const alertHtml = ["E7", "E8", "E9"].includes(info.exerciseTypeCd)
      ? `운동을 완료 하셨나요?`
      : _alert
      ? `운동을<br/> <span class='text-camaColor1 font-bold'>[${_alert?.exe}]</span> <br/>완료 하셨나요?`
      : `운동을 완료 하셨나요?`;

    confirm(
      {
        html: alertHtml,
        confirmButtonText: "네, 완료했어요",
        cancelButtonText: "아니오, 더 해볼게요",
      },
      () => {
        // 기존에는 완료 화면으로 보냈음 - 2025-03-22 요청으로 결과 페이지를 삭제 하고 바로 빵빠레
        // navigate(`../E/content/result/${loginId}`);
        //  운동완료 저장
        const params = answerList.map((item: any) => ({
          ...item,
          loginId,
          answerChoice:
            item.refVal1 ===
            info.indexNum + info.exerciseTypeCd + info.difficultyCd
              ? "Y"
              : item.answerChoice,
        }));

        axios
          .put("/api/coaching/service/answerList", params)
          .then((response) => {
            if (response.data.success) {
              setIsOpen(true);
            }
          });
      }
    );
  };

  const onClose = () => {
    setIsOpen(false);
    onCompleteHandler();
    navigate(`../E/content/${loginId}`);
  };
  return (
    <>
      <ActivityLayout title="운동콘텐츠" onNext={"../E/content/result"}>
        <div className="text-f5 text-center  bg-white shadow-xl rounded-2xl p-[16px] text-camaColor mb-5">
          <h1 className=" text-camaColor1 font-bold">
            [{getCodeName(info.difficultyCd)}]
          </h1>
          오늘 진행할 운동은 <br />
          <p className=" mt-1 text-camaColor1  font-bold">{info.korName}</p>
          입니다.
        </div>
        <TextArea className="mt-5 px-[12px]  text-center !text-f2 leading-snug border-2 rounded-md  py-2 border-camaColor1 font-semibold">
          <p className="flex items-center justify-center font-semibold gap-1 text-f3 mb-1">
            <FcHighPriority />
            주의
          </p>
          자가운동 시행 시에는 그날의 신체상황에 따라 <br />
          무리하지 않고 가능한 범위 내에서 <br />
          실시하는 것이 가장 중요합니다. <br />
          언제나 낙상에 유의하시어 진행하시기 바랍니다.
          {info.difficultyCd === "A3" && (
            <>
              <p className="text-camaColor1  text-center">
                고급 운동은 체육 및 재활 전문가와 함께 하시길 권고드립니다.
              </p>
            </>
          )}
        </TextArea>
        <div className="text-f5 text-center   text-camaColor font-bold mt-5">
          영상을 보면서 따라해 보세요
        </div>

        <div className="bg-white h-[550px] w-full p-2 rounded-xl shadow-xl mt-2">
          <ReactPlayer
            url={info.url}
            width="100%"
            height={
              ["E7", "E8", "E9"].includes(info.exerciseTypeCd)
                ? "300px"
                : "490px"
            }
          />
        </div>

        <div className={`flex justify-center  items-center mt-5 pb-10  `}>
          <motion.button
            className=" border-[3px] px-[30px] py-[5px] flex  rounded-xl items-center gap-3  border-camaColor1 "
            whileTap={{ scale: 1.15 }}
            onClick={onComplete}
          >
            <img src={ClearPic} alt="clear" className="w-[55px]" />
            <div className=" text-[25px] text-camaColor1 leading-[32px] flex font-oneMobile justify-start items-start">
              <span>운동완료</span>
            </div>
          </motion.button>
        </div>
        <Complete isOpen={isOpen} onClose={onClose} />
      </ActivityLayout>
    </>
  );
}
