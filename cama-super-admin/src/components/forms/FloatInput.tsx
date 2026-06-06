import { HTMLInputTypeAttribute, cloneElement, ReactElement } from "react";

/** Type  : inputType  */
export type InputType = {
  name: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  icon?: ReactElement;
};

/** Icon Style */
const defaultStyle = "h-5.5 w-5.5 text-gray-500";

/**
 * Float Input
 * @param {string} name  
 * @param {string} type 
 * @param {string} placeholder 
 * @param {string} className 
 * @param {ReactElement} icon
 
 */
export default function FloatInput(props: InputType) {
  const { name, type, className, icon, placeholder } = props;

  return (
    <>
      <div className={`relative mt-3 ${className}`}>
        {icon && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
            {cloneElement(icon, { className: defaultStyle })}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          className="pe-10 block p-2 pt-3 w-full text-sm bg-transparent rounded-sm border  border-gray-400 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          autoComplete="off"
          placeholder=" "
        />
        <label
          htmlFor={name}
          className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {placeholder}
        </label>
      </div>
    </>
  );
}
