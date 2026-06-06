import { createContext } from "react";
import {
  ExtendedTreeNodeType,
  NodeWithParent,
  TabindexContextType,
  TabindexItemType,
  TreeViewActions,
  TreeViewContextType,
  TreeViewState,
} from "@components/treeview/TreeviewType";

// 동일 레벨 ID 만 골라 뽀ㅃ아줌
export const getSameLevelIds = (
  tree: ExtendedTreeNodeType[],
  targetId: string
): string[] => {
  // Flat 형태로 변경 , level 을 임의 추가함
  const flattenTree = (
    nodes: ExtendedTreeNodeType[],
    parentId?: string,
    level: number = 0
  ): NodeWithParent[] =>
    nodes.reduce(
      (result, node) => [
        ...result,
        { ...node, parentId, level },
        ...(node.children
          ? flattenTree(node.children, node.id, level + 1)
          : []), // 각레벨별로 ...
      ],
      [] as NodeWithParent[]
    );
  const flatTree = flattenTree(tree);

  const targetNode = flatTree.find((node) => node.id === targetId);
  // 각 레벨별로 하위 항목을 리턴해줌 ... ㅜ
  return targetNode
    ? flatTree
        .filter(
          ({ parentId, children, level }) =>
            (parentId === targetNode.parentId &&
              children &&
              level === targetNode.level) ||
            (level > targetNode.level && children)
        )
        .map(({ id }) => id)
    : [];
};

//  Animation 효과
export const generateAnimationEffect = (type: "start" | "exit") => ({
  height: type === "start" ? "auto" : 0,
  opacity: type === "start" ? 1 : 0,
  transition: {
    height: { duration: 0.25 },
    opacity: { duration: 0.2, ...(type === "exit" && { delay: 0.05 }) },
  },
});

// Animation Start
export const animateEffect = {
  height: "auto",
  opacity: 1,
  transition: {
    height: {
      duration: 0.25,
    },
    opacity: {
      duration: 0.2,
      delay: 0.05,
    },
  },
};
// End
export const exitEffect = {
  height: 0,
  opacity: 0,
  transition: {
    height: {
      duration: 0.25,
    },
    opacity: {
      duration: 0.2,
    },
  },
};

//TreeView Context 생성함
export const TreeViewContext = createContext<TreeViewContextType>({
  open: new Map<string, boolean>(),
  selectedId: null,
  dispatch: () => {},
  selectId: () => {},
  data: [],
  autoClose: false,
});

//  열기 닫기  Reducer
export const treeReducer = (
  state: TreeViewState,
  action: TreeViewActions
): TreeViewState => {
  switch (action.type) {
    case "OPEN": {
      // 열기
      const newState = new Map(state);
      newState.set(action.id, true);
      return newState;
    }
    case "CLOSE": {
      // 닫기
      const newState = new Map(state);
      newState.set(action.id, false);
      return newState;
    }
    default:
      return state;
  }
};

// 탭 Context
export const TabindexContext = createContext<TabindexContextType>({
  focusableId: null,
  setFocusableId: () => {},
  onShiftTab: () => {},
  getOrderedItems: () => [],
  elements: { current: new Map<string, HTMLElement>() },
});

// Next Focus
export const getNextFocusableId = (
  orderedItems: TabindexItemType[],
  id: string
): TabindexItemType | undefined => {
  const currIndex = orderedItems.findIndex((item) => item.id === id);
  return orderedItems[(currIndex + 1) % orderedItems.length];
};

// 이전 Focus
export const getPrevFocusableId = (
  orderedItems: TabindexItemType[],
  id: string
): TabindexItemType | undefined => {
  const currIndex = orderedItems.findIndex((item) => item.id === id);
  return orderedItems.at(currIndex === 0 ? -1 : currIndex - 1);
};

// 부모
export const getParentFocusableId = (
  orderedItems: TabindexItemType[],
  id: string
): TabindexItemType | undefined => {
  const currentElement = orderedItems.find((item) => item.id === id)?.element;

  if (currentElement == null) return;

  let possibleParent = currentElement.parentElement;

  while (
    possibleParent !== null &&
    possibleParent.getAttribute("data-item") === null &&
    possibleParent.getAttribute("data-root") === null
  ) {
    possibleParent = possibleParent?.parentElement ?? null;
  }

  return orderedItems.find((item) => item.element === possibleParent);
};
