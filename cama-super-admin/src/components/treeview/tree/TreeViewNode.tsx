import { useContext } from "react";
import { NodeProps } from "../TreeviewType";
import {
  getSameLevelIds,
  animateEffect,
  exitEffect,
  TreeViewContext,
} from "@components/treeview/TreeviewUtil";
import clsx from "clsx";
import { useTabindex } from "../TreeTabIndex";
import ExpandIcons from "./ExpandIcons";
import { AnimatePresence, motion } from "framer-motion";

// Node
export const Node = ({ node, className }: NodeProps) => {
  // Props
  const { id, children, name } = node;
  // Context
  const { open, dispatch, selectId, selectedId, data, autoClose } =
    useContext(TreeViewContext);
  const { isFocusable, getProps } = useTabindex(id);
  // 열림여부
  const isOpen = open.get(id);
  // li Param
  const params = {
    className:
      "flex flex-col cursor-pointer select-none focus:outline-none group",
    ["aria-expanded"]: children?.length ? Boolean(isOpen) : undefined,
    ["aria-selected"]: selectedId === id,
    role: "treeitem",
  };
  // 일부러 이런겁니다 clssss
  const classs = clsx(
    "relative flex items-center text-xs font-medium text-[#999] px-1 hover:text-black hover:font-bold w-full",
    isFocusable && "group-focus:border-red-500 ",
    selectedId === id ? "text-black !font-bold" : "bg-transparent",
    className
  );

  //Node 컴포넌트의 onClickHandler 함수 수정
  const onClickHandler = (e: any) => {
    e.preventDefault();
    // autoClose 가 설정일시만 작동염
    if (autoClose) {
      const arr = getSameLevelIds(data, id);
      arr.forEach((r) => {
        dispatch({ id: r, type: "CLOSE" });
      });
    }
    dispatch({ id, type: isOpen ? "CLOSE" : "OPEN" });
    selectId(node);
  };
  // Init
  const initial = {
    height: 0,
    opacity: 0,
  };

  return (
    <li {...getProps<"li">(params)}>
      <div className={classs} onClick={onClickHandler}>
        {/* 화살표로 변경 ?  */}
        {children?.length ? (
          <div className="flex border border-[#ccc] bg-gray-100 justify-center w-[14px] h-[14px] items-center p-1.5 rounded-sm text-[#ccc] mr-2">
            <ExpandIcons className="" open={isOpen} />
          </div>
        ) : (
          <span className="" />
        )}
        {/*  하위 있으면 아이콘 추가  */}
        <span className="py-1.5 leading-[18px] w-full text-[14px] tracking-[-0.5px]">
          {name}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {children?.length && isOpen && (
          <motion.ul
            initial={initial}
            animate={animateEffect}
            exit={exitEffect}
            key="ul"
            role="group"
            className="pl-5 relative"
          >
            {children.map((node) => (
              <Node node={node} key={node.id} className={className} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};
