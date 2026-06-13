import type5 from "@/assets/images/coaching/main/type5.png";

interface ExerciseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseCompleteModal({
  isOpen,
  onClose,
}: ExerciseCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-sm rounded-md bg-white p-5 shadow-xl">
        <div className="flex justify-center">
          <img src={type5} alt="" aria-hidden="true" className="h-24 w-auto" />
        </div>
        <div className="mt-4 rounded-md border border-primary/15 bg-primary-thin/10 p-4 text-center">
          <p className="text-lg font-bold text-primary">운동 완료!</p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            수고했어요!
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 h-12 w-full rounded-md bg-primary text-sm font-bold text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
