export default function Inputs(props: any) {
  const { type = "text", placeholder = "내용을 입력하세요", className } = props;
  return (
    <>
      <input
        type={type}
        className={`w-full my-1 rounded-md py-3  text-center bg-white border-[#774F2D] border-2 text-camaColor1 ${className}`}
        name="value2"
        placeholder={placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </>
  );
}
