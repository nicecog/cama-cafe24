import { Search } from "lucide-react";

export default function ListInfo() {
  return (
    <div className="px-5">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="암정보를 직접 찾아보세요"
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white focus:ring-2 focus:ring-primary-thin focus:outline-none transition-all duration-200 placeholder:text-gray-400 shadow-lg"
        />
      </div>
    </div>
  );
}
