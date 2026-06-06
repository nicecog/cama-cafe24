import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import {
  FcPortraitMode,
  FcInspection,
  FcPlus,
  FcSurvey,
  FcStart,
  FcComboChart,
  FcSportsMode,
  FcNook,
  FcViewDetails,
  FcSmartphoneTablet,
  FcStatistics,
  FcLineChart,
  FcAndroidOs,
} from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function Menus({ menu }: { menu: any }) {
  const { children = [], menuNm, url, id } = menu;
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Depth1
  const [isOpen, setIsOpen] = useState(false);

  const onClickHandler = () => {
    if (children.length === 0 && url) {
      navigate(url);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const iconMap: { [key: string]: JSX.Element } = {
    1: <FcInspection />, // 환자관리
    2: <FcPortraitMode />, // 환자모니터링
    3: <FcSmartphoneTablet />, // 컨텐츠관리
    4: <FcPlus />, // 치료정보
    5: <FcSurvey />, //작성중인치료정보
    6: <FcStart />, // 비디오관리
    7: <FcSportsMode />, // 웰빙자원관리
    8: <FcViewDetails />, // 모니터링
    9: <FcComboChart />, // 월평가지표
    10: <FcNook />, // 사용자별 검색어 로그
    11: <FcStatistics />, // 통계카테고리
    12: <FcLineChart />, // 건강코칭진행률
    13: <FcAndroidOs />, // 실험실
  };

  return (
    <>
      <li
        className="flex items-center h-11   hov cursor-pointer pl-[25px] hover:bg-[#39906a]  hover:rounded-md hover:bg-opacity-15"
        onClick={onClickHandler}
      >
        <div className="text-[20px] w-6">
          {iconMap[id] || <FcPortraitMode />}
        </div>
        <span className="ml-4 text-sm font-semibold flex items-center justify-between w-full pr-5">
          {t(menuNm)}
          {children.length > 0 && (
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              {isOpen ? "−" : "+"}
            </motion.span>
          )}
        </span>
      </li>
      {children.length > 0 && (
        <motion.li
          className="overflow-hidden flex items-center  cursor-pointer pl-[25px] "
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "linear" }}
        >
          <div className="pl-2.5 py-2 w-full">
            <ul>
              {children.map((subMenu: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <li className="flex items-start border-box border-l border-[#39906a] cursor-pointer py-1.5  w-full  hover:bg-[#39906a]  hover:bg-opacity-15 ">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (subMenu.url) {
                            navigate(subMenu.url);
                          }
                        }}
                        className=" w-full px-[25px] text-[13px]  hover:font-bold   hover:text-[#1e3932] flex items-center gap-2 "
                      >
                        {iconMap[subMenu.id] || <FcPortraitMode />}
                        {t(subMenu.menuNm)}
                      </a>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </motion.li>
      )}
    </>
  );
}
