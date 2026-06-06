import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import modal from "@/assets/images/character/modal.png";

export default function Message(props: any) {
  const { visible, onClose, title, okText = "확인", onOk, height } = props;

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
            <div className="flex min-h-full items-center justify-center py-4 px-[40px]">
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
                    className="text-camaColorLight  flex items-center text-[18px] gap-2 font-light justify-center pt-[40px] "
                  >
                    <img
                      src={modal}
                      alt="행운이"
                      className="w-[56px] h-[42px]"
                    />
                    <p className="font-oneMobile text-camaColorLight ">
                      행운이가 응원할게요!
                    </p>
                  </Dialog.Title>
                  <h1 className="text-[#774F2D] font-bold text-[25px] text-center mb-5 mt-10  px-4 ">
                    {title}
                  </h1>
                  <div
                    className={`mt-10 px-[30px] h-[40dvh] overflow-y-auto text-xl text-[#444444] text-center pb-5 ${height}`}
                  >
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
                    bg-camaColor1
                    text-white
                      focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    {okText}
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
