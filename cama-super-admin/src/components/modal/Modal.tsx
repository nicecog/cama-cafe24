import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import TransitionChild from "./TransitionChild";
import { Button } from "@/components/button";
import close from "@/assets/images/icon-close.png";

export type ModalType = {
  size?: "md" | "sm" | "lg" | "xl";
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  autoClose: boolean; // 자동 닫기 여부
 
};

export default function Modal(props: any) {
  // Props
  const {
    size,
    visible,
    onClose,
    title,
    children,
    onOk,
    onCancel,
    okText = "확인",
    cancelText = "취소",
    autoClose = true,
    buttons
  } = props;
  //  size 처리
  const modalSize = useMemo(() => {
    const sizeMap: Record<string, string> = {
      md: "max-w-screen-md",
      sm: "max-w-screen-sm",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
    };
    return sizeMap[size] || sizeMap.sm;
  }, [size]);

  const closeModal = () => {
    onClose && onClose();
  };

  const onOkClick = () => {
    onOk && onOk();
    autoClose && onClose();
  };

  const onCancelClick = () => {
    onCancel && onCancel();
    autoClose && onClose();
  };

  return (
    <>
      <Transition show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {}}
          static={true}
        >
          <TransitionChild effect={"fadeInOut"}>
            {/* <div className="fixed inset-0 bg-black/50" aria-hidden="false" /> */}
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <TransitionChild effect={"scale"}>
                <Dialog.Panel
                  className={`w-full
                  ${modalSize}
                      transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
                >
                  {/* Modal Title */}
                  <div className="grid grid-cols-2 w-full border-b p-5">
                    <Dialog.Title
                      as="h3"
                      className="flex text-lg font-bold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {/* 닫기버튼  */}
                    <div className="text-right">
                      <button onClick={closeModal}>
                        <img
                          alt="close"
                          src={close}
                          className="w-[20px] opacity-30 hover:opacity-100"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6 p-5">{children}</div>

                  {/* Footer */}
                  <div className="flex justify-end py-2.5 px-3 space-x-0 bg-gray-50 border-t">
                    {buttons? buttons : (
                      <> 
                        {onOk && (
                          <Button
                            onClick={onOkClick}
                            className="!rounded-full !px-6"
                          >
                            {okText}
                          </Button>
                        )}
                        <Button
                          className="gray !rounded-full !px-6"
                          onClick={onCancelClick}
                        >
                          {cancelText}
                        </Button>  
                      </>
                    
                    )}

                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
