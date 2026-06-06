import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import TransitionChild from "@/components/modal/TransitionChild";
import { MdInfo } from "react-icons/md";
import { FaMars, FaVenus, FaWalking } from "react-icons/fa";
import AnimatedProgressItem from "./AnimatedProgressItem";
type DetailType = {
  visible: boolean;
  onClose: () => void;
  info: {
    seq: string;
    name: string;
    birth: string;
    gender: string;
    diseaseName: string;
    diseaseTreatment: string;
    userTypeNm: string;
    categoryAa: string;
    categoryBb: string;
    categoryCc: string;
    categoryDd: string;
    categoryEe: string;
    cancerProgressRate: string;
    avgStep: string;
  };
};

export default function Detail(props: DetailType) {
  const { visible, onClose, info } = props;

  const handlerOnClose = () => {
    onClose();
  };

  const rows = [
    {
      label: "이름",
      value: info.name + ` [${info.gender === "MALE" ? "남성" : "여성"}]`,
      icon:
        info.gender === "MALE" ? (
          <FaMars className="text-blue-500" />
        ) : (
          <FaVenus className="text-pink-500" />
        ),
    },
    { label: "생년월일", value: info.birth },

    {
      label: "질환/ 시기 ",
      value: info.diseaseName
        ? info.diseaseName
        : "N/A" + " / " + info.diseaseTreatment
        ? info.diseaseTreatment
        : "N/A",
      icon: <MdInfo className="text-red-400" />,
    },
    { label: "사용자유형", value: info.userTypeNm },
  ];

  const progressItems = [
    { label: "수면", value: info.categoryAa },
    { label: "식습관", value: info.categoryBb },
    { label: "신체활동", value: info.categoryCc },
    { label: "심리", value: info.categoryDd },
    { label: "운동", value: info.categoryEe },
    { label: "건강 뉴스레터 진도율", value: `${info.cancerProgressRate}%` },
    {
      label: "걸음수 평균",
      value: info.avgStep,
      icon: <FaWalking className="text-green-600" />,
      max: 10000, // 기준 걸음수
    },
  ];

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
                    <span className="text-main mr-1">{info.name}</span>님의
                    건강코칭 진행률
                  </h1>
                  <div className="overflow-auto h-[600px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {rows.map((row, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex items-center text-gray-600 text-xs font-medium gap-1 mb-1">
                            {row.icon && (
                              <span className="text-sm">{row.icon}</span>
                            )}
                            <span>{row.label}</span>
                          </div>
                          <div className="text-sm text-gray-800 font-semibold truncate">
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-5">
                      {progressItems.map((item, index) => (
                        <AnimatedProgressItem
                          key={index}
                          item={item}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end py-2.5 px-3 space-x-0 bg-gray-50 border-t">
                  <button
                    className="mt-3 px-4 py-2 bg-[#39906a] text-white rounded w-full 
                                    transition-all duration-200 active:scale-[1.015]   "
                    onClick={handlerOnClose}
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
