export default function Items(props: any) {
  const { title, ment, icon, onClick, progress } = props;

  return (
    <>
      <div
        className="p-[12px] rounded-2xl shadow-lg bg-white cursor-pointer h-[194px] "
        onClick={onClick}
      >
        <h3 className="font-bold text-xl text-camaColor mb-1 mt-1">{title}</h3>
        <p
          className="text-xs py-1  text-text"
          style={{ letterSpacing: "-1px" }}
        >
          {ment}
        </p>
        {/* 아이콘 */}

        <div className="flex justify-between items-end mt-2 mb-2">
          <div className="text-[24px] font-bold text-[#FE8825] ml-1">{`${progress}%`}</div>
          <div>{icon}</div>
        </div>
        {/* Bar */}
        <div className="w-full bg-white rounded-3xl mb-4 border border-[#CCCCCC] ">
          <div
            className=" h-1.5 rounded-full bg-gradient-to-r  from-[#FEBA00] to-[#FE8825]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
