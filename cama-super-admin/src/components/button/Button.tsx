
import {ReactNode, memo} from "react";


export type ButtonType = {
    children: ReactNode;
    onClick : ()=> void
    color? : 'green' | 'yelllo' | undefined
    disabled? : boolean;
    className? : string
}

const CButtonComponent = (props : ButtonType) =>{
    // Props
    const {onClick, children, disabled, className, color} = props;

    // Renderer
    return (<>
        <button type="button" className={`buttons ${color || 'default'} ${disabled && 'disabled'} ${className}`} onClick={onClick}>
            {children}
        </button>
    </>)
}
export default memo(CButtonComponent)