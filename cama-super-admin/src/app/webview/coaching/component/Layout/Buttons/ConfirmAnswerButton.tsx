// 예 아니오 버튼

export default function ConfrimAnswerButton(props: {
  onChange: (checked: string) => void;
  value: string;
}) {
  const { onChange, value } = props;

  const onClickHandler = (type: string) => () => {
    onChange(type);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-8 sh">
        <button
          className={` rounded-full font-oneMobile text-[24px]  shadow-md w-[100px] h-[100px] 
          ${
            value === "예"
              ? "bg-camaColor1 text-white"
              : "bg-white text-camaColor1"
          }
          `}
          onClick={onClickHandler("예")}
        >
          예
        </button>
        <button
          className={`rounded-full font-oneMobile text-[24px]   shadow-md w-[100px] h-[100px]
          ${
            value === "아니오"
              ? "bg-camaColor1 text-white"
              : "bg-white text-camaColor1"
          }
          `}
          onClick={onClickHandler("아니오")}
        >
          <span>아니오</span>
        </button>
      </div>
    </>
  );
}
