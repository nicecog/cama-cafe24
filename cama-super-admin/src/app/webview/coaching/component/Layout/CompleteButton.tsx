export default function CompleteButton(props: any) {
  const { condition, onSave } = props;

  return (
    <>
      <div className="fixed bottom-0 w-full h-[60px]    border-t">
        {condition ? (
          <button
            className={`w-full h-full bg-[#B20000] text-white font-bold text-xl`}
            onClick={onSave}
          >
            미션도전
          </button>
        ) : (
          <button
            className={`w-full h-full bg-[#BBBBBB] text-white font-bold text-xl`}
          >
            미션도전
          </button>
        )}
      </div>
    </>
  );
}
