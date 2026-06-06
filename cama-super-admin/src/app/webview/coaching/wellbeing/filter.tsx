import useCodeApi from "@/app/main/api/useCodeApi";
import { wellbeingSearchInfoAtom, wellbeingSearchText } from "./wellbeingAtom";
import { useAtom, useSetAtom } from "jotai";
import { FcSearch } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { useResetAtom } from "jotai/utils";
import { ChangeEvent, useState } from "react";

import { MdOutlineClear } from "react-icons/md";

export default function Filter() {
  // 코드정보
  const { getCodeList } = useCodeApi("WELLBEING_CATEGORY_CD");
  const { data: codes } = getCodeList();

  const [filter, setFilter] = useAtom(wellbeingSearchInfoAtom);

  const [visible, setVisible] = useState(false);

  const [text, setText] = useState("");
  const setSearchText = useSetAtom(wellbeingSearchText);

  const reset = useResetAtom(wellbeingSearchInfoAtom);

  const onClick = (code: string) => {
    setFilter(code);
  };

  const onSearch = () => {
    setSearchText(text);
  };

  const onClear = () => {
    setSearchText("");
    setText("");
  };

  return (
    <>
      <div className="flex justify-between">
        <ul className="flex gap-1.5 items-center text-[17px]  font-semibold ">
          <li>
            <motion.button
              whileTap={{ scale: 1.1 }}
              className={`border px-[11px] py-1 rounded-xl border-camaColor1 text-camaColor1
              ${filter === "" ? "bg-camaColor1 text-white" : ""}
              `}
              onClick={reset}
            >
              전체
            </motion.button>
          </li>
          {codes.map((item: any, idx: number) => (
            <li key={idx}>
              <motion.button
                whileTap={{ scale: 1.1 }}
                className={`border px-[11px] py-1 rounded-xl border-camaColor1 text-camaColor1
                ${filter === item.cd ? "bg-camaColor1 text-white" : ""}
              `}
                onClick={() => onClick(item.cd)}
              >
                {item.val}
              </motion.button>
            </li>
          ))}
        </ul>
        <motion.button
          className="p-1"
          whileTap={{ scale: 1.3 }}
          onClick={() => {
            setVisible(!visible);
            setSearchText("");
            setText("");
          }}
        >
          <FcSearch className="text-[24px]" />
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.6 }} // 초기 상태
            animate={{ height: "auto", opacity: 1, scale: 1 }} // 애니메이션 상태
            exit={{ height: 0, opacity: 0, scale: 0.6 }} // 사라질 때 애니메이션
            transition={{ duration: 0.3 }} // 애니메이션 지속 시간
            className="overflow-hidden mt-4 flex items-center gap-1"
          >
            <div className="flex item-center bg-white w-full border rounded-md px-1.5 pr-2  ">
              <motion.input
                className=" px-2 py-1 text-md w-full focus:outline-none "
                placeholder="검색어를 입력해 주세요."
                initial={{ scale: 0.6 }} // 초기 스케일
                animate={{ scale: 1 }} // 애니메이션 스케일
                transition={{ duration: 0.2 }} // 애니메이션 지속 시간
                value={text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setText(e.target.value)
                }
              />
              <button onClick={onClear}>
                <MdOutlineClear />
              </button>
            </div>
            <motion.button
              className="border bg-camaColor1  rounded-lg p-1 w-1/5 text-md text-gray-200 font-bold"
              whileTap={{ scale: 1.07 }}
              onClick={onSearch}
            >
              검색
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
