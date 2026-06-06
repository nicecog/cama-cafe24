import { NodeProps } from "../TreeviewType";
import { useContext } from "react";
import {
  TreeViewContext,
  animateEffect,
  exitEffect,
  getSameLevelIds,
} from "../TreeviewUtil";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import RadioItem from "@/components/forms/RadioItem";
import RowExpandIcons from "./RowExpandIcons";

// Menu Node
export const RowNode = ({ node, className }: NodeProps) => {
  // Props
  const {
    id,
    children,
    name,
    level,
    pgmId,
    menuType,
    sortNo,
    chk,
    iconClass,
    useYn,
  } = node;

  // Context
  const { open, dispatch, selectId, data, autoClose } =
    useContext(TreeViewContext);

  // 열림여부
  const isOpen = open.get(id);

  const classs = clsx(
    "flex space-x-2 font-medium text-black  items-center  p-1",
    className
  );

  const onSelectRow = () => {
    selectId(node);
  };
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
  };
  // Init
  const initial = {
    height: 0,
    opacity: 0,
  };

  const classNames = [
    "w-full",
    "p-1",
    "pb-2",
    "flex",
    "items-center",
    "cursor-pointer",
    "border-b border-gray-300",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <div className={classs}>
        <div className={clsx(classNames)} onClick={onSelectRow}>
          <div className="w-full pl-2 sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12 text-xs">
            <RadioItem checked={chk} readOnly />
          </div>
          <div
            className={`w-full sm:w-2/12 md:w-2/12 lg:w-2/12 xl:w-2/12 text-xs
                ${level === 1 ? "" : level === 2 ? "pl-4" : "pl-9"}
              `}
          >
            <RowExpandIcons
              className="inline-block pr-1"
              open={isOpen}
              menuType={menuType}
              onClick={onClickHandler}
            />
            {name}
          </div>
          <div className="w-full pl-2 sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12 text-xs">
            {menuType}
          </div>
          <div className="w-full pl-2 sm:w-4/12 md:w-4/12 lg:w-4/12 xl:w-4/12 text-xs">
            {pgmId}
          </div>
          <div className="w-full pl-2 sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12 text-xs">
            {sortNo}
          </div>
          <div className="w-full pl-2 sm:w-2/12 md:w-2/12 lg:w-2/12 xl:w-2/12 text-xs">
            {iconClass}
          </div>
          <div className="w-full pl-2 sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12 text-xs">
            {useYn}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {children?.length && isOpen && (
          <motion.div
            initial={initial}
            animate={animateEffect}
            exit={exitEffect}
            key="container"
            role="group"
            className="relative overflow-hidden"
          >
            <motion.div>
              {children.map((node) => (
                <RowNode node={node} key={node.id} className={className} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
