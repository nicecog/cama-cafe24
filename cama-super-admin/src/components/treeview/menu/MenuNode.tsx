import { Link } from "react-router-dom";
import { NodeProps } from "../TreeviewType";
import { useContext } from "react";
import {
  TreeViewContext,
  animateEffect,
  exitEffect,
  getSameLevelIds,
} from "../TreeviewUtil";
import { useTabindex } from "../TreeTabIndex";
import clsx from "clsx";
import { BiCircle } from "react-icons/bi";
import ExpandIcons from "./ExpandIcons";
import { AnimatePresence, motion } from "framer-motion";

// Menu Node
export const MenuNode = ({ node, className }: NodeProps) => {
  // Props
  const { id, children, name, level, cnt } = node;

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

  const classs = clsx(
    "flex space-x-2 font-medium text-gray-900  items-center hover:font-bold",
    isFocusable && "group-focus:border-red-500 ",
    selectedId === id ? "text-gray-900 !font-bold" : "bg-transparent",
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

  const classNames = [
    "w-full",
    "p-3",
    "flex",
    "items-center",
    level === 1 && "level1",
    level === 2 && "!p-1 !pr-3 !pl-0 border-0   hover:font-bold text-xs",
    level === 3 && "!p-1 border-0 text-gray-900/50   hover:font-bold text-xs",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      {...getProps<"li">(params)}
      className={clsx(
        "border-b",
        "border-white/20",
        { "text-gray-900/50": isOpen },

        {
          "!border-0 text-xs  ": level === 2,
        },
        { "!border-0 ! !text-gray-900": level === 3 }
      )}
    >
      <div className={classs}>
        {level === 1 && <></>}
        {level === 2 && (
          <>
            <BiCircle className="text-[10px] " />
          </>
        )}
        {level === 3 && <></>}
        <Link to={"#"} onClick={onClickHandler} className={clsx(classNames)}>
          <span className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            {`${name} `}
            {!!cnt && `(${cnt})`}
          </span>
          {children?.length ? (
            <ExpandIcons
              className="flex justify-end items-center text-[8px] m-auto"
              open={isOpen}
              level={level}
            />
          ) : (
            <span className="h-4 w-4" />
          )}
        </Link>
      </div>
      <AnimatePresence initial={false}>
        {children?.length && isOpen && (
          <motion.div
            initial={initial}
            animate={animateEffect}
            exit={exitEffect}
            key="container"
            role="group"
            className="pl-4 relative  overflow-hidden"
          >
            {/* level2 이상이면 py-4 그외는 */}
            <motion.ul className={`${level === 2 ? "py-4" : "py-2"}`}>
              {children.map((node) => (
                <MenuNode node={node} key={node.id} className={className} />
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
