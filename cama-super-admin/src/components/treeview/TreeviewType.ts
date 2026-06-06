import {
  ReactNode,
  Dispatch,
  MutableRefObject,
  ElementType,
  ComponentPropsWithoutRef,
} from "react";

// Treeview state
export type TreeViewState = Map<string, boolean>;

// 해당 Id 열기
export type TreeViewActions = {
  type: "OPEN" | "CLOSE" | "CLOSE_ALL";
  id: string;
};

// Context Type
export type TreeViewContextType = {
  open: TreeViewState;
  dispatch: Dispatch<TreeViewActions>;
  selectedId: string | null;
  selectId: (id: ExtendedTreeNodeType) => void;
  data: ExtendedTreeNodeType[];
  autoClose: boolean;
};

// ROOT Component
export type RootProps = {
  data: ExtendedTreeNodeType[];
  autoClose?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  onClick: (id: ExtendedTreeNodeType) => void;
};
// 노드 Props 타입
export type NodeProps = {
  node: ExtendedTreeNodeType;
  className?: string;
};

// 기본 노드 속성
export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  icon?: ReactNode;
  level?: number;
};
// 추가될지 모르는 노드 속성
export interface ExtendedTreeNodeType extends TreeNodeType {
  [key: string]: any;
}
//Flatmap
export type NodeWithParent = ExtendedTreeNodeType & {
  parentId?: string;
  level: number;
};

// TabItem
export type TabindexItemType = {
  id: string;
  element: HTMLElement;
};

// Tab ContextApi 타입
export type TabindexContextType = {
  focusableId: string | null;
  setFocusableId: (id: string) => void;
  onShiftTab: () => void;
  getOrderedItems: () => TabindexItemType[];
  elements: MutableRefObject<Map<string, HTMLElement>>;
};

// Tab Root
export type TabindexRootProps<T extends ElementType> = {
  children: ReactNode;
  as?: T;
  valueId?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "as" | "valueId">;

// TAb Root
export type TabindexRootBaseProps<T> = {
  children: ReactNode | ReactNode[];
  as?: T;
  valueId?: string;
};
