import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import MissionClear from "@/assets/images/character/missionClear.png";
import Complete from "./Complete";
import Fail from "./Fail";
export default function MissionComplete() {
  const [completeVisible, setCompleteVisible] = useState<boolean>(false);
  const [failVisible, setFailVisible] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(true);

  const onCompleteHandler = () => {
    setVisible(false);
    setCompleteVisible(true);
  };

  const onFailHandler = () => {
    setVisible(false);
    setFailVisible(true);
  };

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          // onClose={closeModal}
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
            <div className="fixed inset-0 bg-[#F7F8FA] opacity-[0.95]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-[262px] h-[371px] bg-white transform overflow-hidden rounded-2xl   p-2 text-left align-middle shadow-xl transition-all flex flex-col justify-start items-center  pt-[34px]  px-[50px]">
                  <div className="text-center font-bold text-[#774F2D] text-[19px] mb-4 leading-[26px]">
                    어제의 미션은 <br />잘 수행하셨나요 ?
                  </div>
                  <img src={MissionClear} className="w-[95px] h-[98px]" />

                  <div className="flex flex-col gap-4 mt-5">
                    <button
                      className="w-[200px] h-[50px] text-camaColor1 text-[18px] font-oneMobile bg-[#FCF8EF] rounded-lg"
                      onClick={onFailHandler}
                    >
                      오늘 다시도전!
                    </button>
                    <button
                      className="w-[200px] h-[50px] text-camaColor1 text-[18px] font-oneMobile bg-[#FCF8EF] rounded-lg"
                      onClick={onCompleteHandler}
                    >
                      미션을 완료했어요!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Complete
        isOpen={completeVisible}
        onClose={() => {
          setCompleteVisible(false);
        }}
      />

      <Fail
        isOpen={failVisible}
        onClose={() => {
          setFailVisible(false);
        }}
      />
    </>
  );
}
