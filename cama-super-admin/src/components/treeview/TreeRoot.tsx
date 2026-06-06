import clsx from "clsx";
import { useReducer, useState } from "react";
import { TabindexRoot } from "@components/treeview/TreeTabIndex";
import {
  RootProps,
  ExtendedTreeNodeType,
} from "@components/treeview/TreeviewType";
import {
  treeReducer,
  TreeViewContext,
} from "@components/treeview/TreeviewUtil";

// 트리루트
export const Root = (props: RootProps) => {
  // Props
  const { children, className, onClick, data, autoClose = false } = props;
  // State
  const [selectedValue, setValue] = useState<string | null>(null);
  // Select
  const onSelect = (e: ExtendedTreeNodeType) => {
    // ID 필수
    setValue(e.id);
    // TODO 모두 실행해야할까말까 고민
    onClick && onClick(e);
  };

  // Open / Close
  const [open, dispatch] = useReducer(treeReducer, new Map<string, boolean>());

  // Provider Values
  const values = {
    open,
    dispatch,
    selectId: onSelect,
    selectedId: selectedValue,
    data,
    autoClose,
  };
  // ClassName 이 잇을경우 합쳐줌
  const classss = clsx("flex flex-col", className);
  // Render
  return (
    <TreeViewContext.Provider value={values}>
      <TabindexRoot
        as="ul"
        className={classss}
        aria-multiselectable="false"
        role="tree"
      >
        {children}
      </TabindexRoot>
    </TreeViewContext.Provider>
  );
};

export const Treeview = { Root, Node };
