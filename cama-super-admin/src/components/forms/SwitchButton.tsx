import {ChangeEvent, memo} from "react";


export type SwitchButtonType = {

  onChange : (e : ChangeEvent<HTMLInputElement> )=>void;
  name : string; 
  checked : boolean;
  label? : string[];
}


// Switch Button 
const SwitchButton = (props  : SwitchButtonType)=>{
  // Props
  const {onChange, checked, label  } = props;
  
  // Redner
  return(<>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" 
              value="" 
              name=""
              className="sr-only peer" 
              checked={checked} 
              onChange={onChange}
        />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        {
          label?.length === 2 ? 
            <span className="ms-3 text-sm font-medium text-gray-900 ">
              {checked ? label[0] : label[1]}      
            </span> 
          : null
        }
    </label>
  
  </>);

}
export default memo(SwitchButton)