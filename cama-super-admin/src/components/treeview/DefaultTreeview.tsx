import { Root } from "@/components/treeview/TreeRoot";
import { Node } from "./tree/TreeViewNode";
import { memo } from "react";
import clsx from "clsx";
import {
  TreeNodeType,
  ExtendedTreeNodeType,
} from "@/components/treeview/TreeviewType";

export type TreeviewType = {
  data: ExtendedTreeNodeType[];
  onClick: (node: TreeNodeType) => void;
  autoClose?: boolean;
};

// Treeview Component ㅜ
const Treeview = (props: TreeviewType) => {
  const { data, onClick, autoClose } = props;

  return (
    <>
      <Root
        onClick={onClick}
        className={clsx("py-5 px-3")}
        data={data}
        autoClose={autoClose}
      >
        {data.map((node: TreeNodeType) => (
          <Node node={node} key={node.id} />
        ))}
      </Root>
    </>
  );
};
export default memo(Treeview);
