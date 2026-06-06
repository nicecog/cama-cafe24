import { ReactNode } from "react";

export type ButtonType = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
};

const DefaultButton = (props: ButtonType) => {
  // Props
  const { onClick, children, className } = props;

  // Renderer
  return (
    <>
      <button
        className={`py-1.5 px-3 text-sm text-white bg-[#619e83]  border border-[#619e83]   rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
export default DefaultButton;
