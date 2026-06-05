import { useAtomValue } from "jotai";
import { isLoadingAtom } from "@/atoms/CommonAtoms";

export default function Loader() {
  const isLoading = useAtomValue(isLoadingAtom);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-[9999]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg">조회중...</p>
          </div>
        </div>
      )}
    </>
  );
}
