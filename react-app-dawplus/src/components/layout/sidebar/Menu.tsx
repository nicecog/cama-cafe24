import { Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { Dog } from "lucide-react";
import React, { useState } from "react";
import { Each } from "@/components/common/Each";

const loadFeatures = domAnimation; // DOM 전용 기능 (가장 가벼움)
const MotionLink = m(Link);

export default function Menus({ menu }: { menu: any }) {
  const { children = [], menuNm, url } = menu;

  // Depth1
  const [isOpen, setIsOpen] = useState(false);

  const onClickHandler = () => {
    if (children.length === 0 && url) {
      console.log("doSomthing");
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <LazyMotion features={loadFeatures}>
      <li className=" h-11 flex items-center   hover:cursor-pointer pl-[25px] hover:bg-primary-light/25  hover:rounded-md hover:bg-opacity-15 list-none ">
        <button
          type="button"
          onClick={onClickHandler}
          className="flex items-center w-full h-full "
        >
          <div className="text-[20px] w-6 ">
            <Dog />
          </div>
          <span className="ml-4 text-sm font-semibold flex items-center justify-between w-full pr-5 ">
            {menuNm}
            {children.length > 0 && (
              <m.span
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: "inline-block" }}
              >
                {isOpen ? "−" : "+"}
              </m.span>
            )}
          </span>
        </button>
      </li>
      {children.length > 0 && (
        <m.li
          className="overflow-hidden flex items-center  cursor-pointer pl-[25px] "
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "linear" }}
        >
          <div className="pl-2.5 py-2 w-full">
            <ul>
              <Each
                of={children}
                render={(subMenu: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <li className="flex items-start border-box border-l border-main cursor-pointer py-1.5  w-full  hover:bg-primary-thin  hover:bg-opacity-15 ">
                        <MotionLink
                          to={subMenu.url}
                          className="w-full px-[25px] text-[13px] hover:text-[#1e3932]"
                          whileHover={{
                            x: 3, // 오른쪽으로 2px 이동
                            fontWeight: 700, // 진하게
                            transition: {
                              duration: 0.3,
                              ease: "easeOut",
                            },
                          }}
                        >
                          {subMenu.menuNm}
                        </MotionLink>
                      </li>
                    </React.Fragment>
                  );
                }}
              />
            </ul>
          </div>
        </m.li>
      )}
    </LazyMotion>
  );
}
