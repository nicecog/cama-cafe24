import { useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export default function SetupPrompt() {
  const navigate = useNavigate();

  return (
    <div className="mt-12 px-5">
      <div className="bg-white rounded-2xl border-2 border-primary p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex-center">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              암정보를 설정해주세요
            </h2>
            <p className="text-gray-600">
              암정보를 설정하시면
              <br />
              맞춤형 건강정보와 일정관리를 제공받으실 수 있습니다.
            </p>
          </div>

          <button
            onClick={() => navigate({ to: "/form" })}
            className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
          >
            암정보 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}
