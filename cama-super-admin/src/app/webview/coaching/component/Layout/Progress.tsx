import useFontSize from "@/hooks/useFontSize";

export default function Progress(props: any) {
  const { value, onChange, className } = props;
  const [base] = useFontSize([-2]);

  return (
    <>
      <div
        className={`relative bg-white pt-3 pb-5 px-4 rounded-2xl ${className}`}
      >
        <p className="text-center font-title py-2" style={{ fontSize: base }}>
          바를 움직여서 중요도를 표시해 보세요
        </p>
        <input
          type="range"
          name="value1"
          value={value}
          min="0"
          onChange={onChange}
          max="100"
          className="range blue"
        />
        <p className="flex items-center justify-between text-[13px] font-bold -mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </p>
        <div className="flex items-center justify-between text-[13px] font-bold -mt-1">
          <div className="flex items-center leading-5 text-left">
            전혀
            <br />
            중요하지
            <br />
            않다
          </div>
          <span></span>
          <div className="flex items-center leading-5 text-right">
            매우
            <br />
            중요하다
          </div>
        </div>
      </div>
    </>
  );
}
