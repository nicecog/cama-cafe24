import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import excercise from "@/assets/images/character/mission.png";
import question from "@/assets/images/character/question.png";
import mental from "@/assets/images/character/mental.png";
export default function MessageModal(props: any) {
  const { visible, title, onClose, onOk, type = "Defalut" } = props;

  const closeModal = () => {
    onOk && onOk();
    onClose();
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
                    className="text-camaBlue  flex flex-col items-center text-[21px] gap-2 font-light justify-center pt-5 pb-3 border-b"
                  >
                    {type == "excercise" && (
                      <img src={excercise} alt="운동이" className="w-16" />
                    )}
                    {type == "mental" && (
                      <img src={mental} alt="심리" className="w-16" />
                    )}
                    {type == "question" && (
                      <img src={question} alt="마음이" className="w-16" />
                    )}

                    {title && (
                      <p className="font-oneMobile  ml-0.5 font-[13px]">
                        {title}
                      </p>
                    )}
                  </Dialog.Title>

                  <div className="mt-4 px-6 h-[50dvh] overflow-y-scroll text-xl">
                    {props.children}
                  </div>

                  <button
                    type="button"
                    className="inline-flex 
                      justify-center 
                      border 
                      w-full
                      text-lg
                      border-transparent  p-3
                    bg-camaBlueLight
                    text-white
                      focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    확인
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
