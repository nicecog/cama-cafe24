import QuillEditer from "@/components/edit/QuillEditer";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import TransitionChild from "@/components/modal/TransitionChild";
type DetailType = {
  visible: boolean;
  onClose: () => void;
  info: {
    cnt: number | string;
    contents?: string;
    contentsSeq?: string | number;
    title: string;
  };
};

export default function Detail(props: DetailType) {
  const { visible, onClose, info } = props;

  const handlerOnClose = () => {
    onClose();
  };

  //   const _title = useMemo(() => {
  //     return info.title
  //       .split(/([.?!])/g) // `.`, `?`, `!` 포함해서 분리
  //       .filter(Boolean) // 빈 문자열 제거
  //       .reduce<(string | JSX.Element)[]>((acc, part, index, array) => {
  //         if (index % 2 === 0) {
  //           return [...acc, part + (array[index + 1] || ""), <br key={index} />];
  //         }
  //         return acc;
  //       }, []);
  //   }, [info.title]);

  //   console.log(_title);

  return (
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
              max-w-screen-lg
                  transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
              >
                <div className="space-y-6 p-5">
                  <h1 className="border-b border-green-600 text-3xl font-semibold pb-2">
                    {info.title}
                  </h1>
                  <div className="overflow-auto h-[700px]">
                    <QuillEditer value={info.contents} readOnly />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end py-2.5 px-3 space-x-0 bg-gray-50 border-t">
                  <button
                    className="mt-3 px-4 py-2 bg-[#39906a] text-white rounded w-full 
                                    transition-all duration-200 active:scale-[1.015]   "
                    onClick={handlerOnClose}
                    // whileTap={{ scale: 1.01 }} // 클릭 시 버튼 크기 살짝 커짐
                  >
                    닫기
                  </button>
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
