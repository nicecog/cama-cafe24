import { ReactNode, useMemo, memo } from "react";

export type Prettify<T> = {
  [K in keyof T]: T[K];
};
export type CButtonType = {
  children: ReactNode;
  onClick: () => void;
  type: "update" | "create" | "delete";
  disabled?: boolean;
  className?: string;
};

const CButtonComponent = (props: CButtonType) => {
  // Props
  const { onClick, children, disabled, type, className } = props;
  // Path Name
  // const pathname = "/";
  // MenuList
  // const menuList= useCommonStore(s=>s.menuList);
  // 현재 Page URL
  // const currentPage = useMemo(() => menuList.find(i => "/" + i.pgmId === pathname), [menuList, pathname]) ;
  // 각 권한확인필요
  // const {
  //     cauth,  // Create(?)
  //     dauth,  // Delete(?)
  //     // eauth, // ?
  //     // rauth,  // ??
  //     uauth,  // Update(?)
  // }   = currentPage || {}
  // TODO 수정 필요
  const [cauth, dauth, uauth] = ["Y", "Y", "Y"];
  // Type 별 Color
  const typeColor = useMemo(
    () => (type === "update" ? "green" : type === "delete" ? "red" : "default"),
    [type]
  );
  //  비활성 여부
  const isDisabled = useMemo(
    () =>
      disabled ||
      (type === "update" && uauth !== "Y") ||
      (type === "delete" && dauth !== "Y") ||
      (type === "create" && cauth !== "N"),
    [disabled, cauth, dauth, uauth, type]
  );

  // Renderer
  return (
    <>
      <button
        type="button"
        className={`buttons ${typeColor} ${
          isDisabled && "disabled"
        } ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
export default memo(CButtonComponent);
