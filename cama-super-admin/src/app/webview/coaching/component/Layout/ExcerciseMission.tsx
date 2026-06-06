import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useState } from "react";
import excercise from "@/assets/images/character/mission.png";
import CoachingInput from "./CoachingInput";
import axios from "@/utils/axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import { motion } from "framer-motion";
import activityImg from "@/assets/images/character/activity.png";
export default function ExcerciseMission(props: any) {
  const { loginId } = useParams();

  // const { visible, onSave, title, okText = "확인" } = props;
  const { visible, onSave, onClose } = props;

  const { alert } = useAlert();

  const [stepNum, setStepNum] = useState("");

  const closeModal = () => {
    if (stepNum === "") {
      alert("걸음수를 입력해 주세요.");
      return;
    }

    axios
      .put("/api/coaching/service/step", {
        loginId,
        executionDate: dayjs().format("YYYY-MM-DD"),
        stepNum,
      })
      .then(({ data }) => {
        if (data.success) {
          onSave();
          onClose();
        } else {
          alert("관리자에게 문의하세요 ");
        }
      });
  };

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {}}
          static={true}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white bg-gradient-to-b from-blue-200" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-4 px-5">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white  align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-camaColorLight  flex items-center text-[19px] gap-2 font-light justify-center pt-[25px] px-5 "
                  >
                    <img
                      src={excercise}
                      alt="운동이"
                      className="w-[45px] h-[45px]"
                    />
                    <div className="font-oneMobile  ml-0.5 font-[13px] flex flex-col justify-center items-center">
                      잠깐, 건강을 위한 발걸음!
                    </div>
                  </Dialog.Title>
                  <div
                    className={`mt-4 px-[30px] h-[220px] overflow-y-auto text-[19px] text-[#444444] text-center pb-5 `}
                  >
                    <div className="text-center font-oneMobile ">
                      어제의 걸음수를 체크해 볼까요?
                    </div>
                    <div className="mt-5 text-center">
                      오늘은 어제보다 몇 걸음만이라도 더 걸어 볼까요!
                    </div>
                    <div className="mt-4 text-center flex items-center">
                      <div className="w-full">어제의 걸음수</div>
                      <CoachingInput
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setStepNum(e.target.value)
                        }
                        value={stepNum}
                        placeholder=""
                        type="number"
                      />
                    </div>
                  </div>

                  <motion.button
                    className="inline-flex 
                      justify-center 
                      border 
                      w-full
                      text-xl
                      border-transparent  py-1.5
                    bg-camaColor1
                    text-white
                    items-center 
                    font-oneMobile gap-2
                      focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    <img src={activityImg} className="w-[55px]" />
                    어제의 걸음수 <br />
                    기록하기
                  </motion.button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
