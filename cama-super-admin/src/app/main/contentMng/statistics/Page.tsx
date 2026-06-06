import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Detail from "./Detail";
import { useResetState } from "@/hooks/useResetState";
import { useTranslation } from "react-i18next";
import ClientPagination from "@/components/Pagination/ClientPagination";

export default function Statistics() {
  const { t , i18n} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const displayRow = 15;

  const [detail, setDetail, reset] = useResetState<any>({
    visible: false,
    info: {
      contentsSeq: 0,
      title: "",
      contents: "",
      cnt: 0,
    },
  });

  const onDetailClose = () => {
    reset();
  };

  // Query Data
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["contents", "getFavoriteStatList", i18n.language],
    queryFn: async () => {
      const response = await axios
        .post("/api/monitoring/contents/getFavoriteStatList", {
          lang: i18n.language,
        })
        .then((res) => res.data.response);
      return Array.isArray(response) ? response : [];
    },
  });

  const list = data ?? [];

  // Step 1: Sort by `cnt` in descending order
  const sortedContents = useMemo(() => {
    return [...list]
      .sort((a: any, b: any) => b.cnt - a.cnt)
      .slice(0, 3);
  }, [list]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * displayRow;
    const endIndex = startIndex + displayRow;
    return list.slice(startIndex, endIndex);
  }, [list, currentPage, displayRow]);

  const onOpenDetail = (post: any) => {
    setDetail((p: any) => ({ ...p, visible: true, info: post }));
  };

  const rankColors = [
    {
      bg: "bg-[#99d0b1]", // 1등: 더 연한 그린
      border: "border-[#66b49f]", // 더 연한 그린
      hover: "hover:bg-[#66b49f]", // hover 시 더 연한 그린
    }, // 1등

    {
      bg: "bg-[#e5e5e5]", // 2등: 부드러운 회색
      border: "border-[#c6c6c6]", // 조금 더 어두운 회색
      hover: "hover:bg-[#d0d0d0]", // hover 시 밝은 회색
    }, // 2등
    {
      bg: "bg-[#f0f0f0]", // 3등: 더 밝은 회색
      border: "border-[#d0d0d0]", // 더 연한 회색
      hover: "hover:bg-[#e0e0e0]", // hover 시 조금 더 밝은 회색
    }, // 3등
  ];

  return (
    <>
      {(isPending || isFetching) && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-green-600 border-solid rounded-full animate-spin border-t-transparent" />
        </div>
      )}
      <div className="flex flex-col h-full ">
        <div className="shrink-0 ">
          <div className="flex flex-col gap-3 w-full  ">
            <h1 className="text-xl font-extrabold text-gray-800 border-b-2 border-main pb-2 mb-1">
              {t("statistics.title")}
            </h1>

            {sortedContents.map((post: any, index: number) => {
              const rank = index + 1;
              const { bg, border, hover } = rankColors[index] || {
                bg: "bg-white",
                border: "border-gray-200",
                hover: "hover:bg-gray-100",
              };

              return (
                <div
                  key={rank}
                  className={`group flex  items-center ${bg} ${hover} px-3 py-1.5 rounded-md shadow-sm border-l-4 ${border}
                              transition-transform duration-150 transform hover:scale-[1.015] cursor-pointer`}
                  onClick={() => onOpenDetail(post)}
                >
                  <span className="text-lg font-bold text-gray-800 w-8">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <h2 className="font-semibold text-xs sm:text-sm group-hover:underline">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-700">
                      {t("statistics.bookmarkCount")} :{" "}
                      <span className="font-bold underline">{post.cnt}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 mt-10 grow flex flex-col">
          
          {/* Table */}
          <div className="overflow-auto  ">
            <h2 className="text-sm font-extrabold text-gray-800 border-b  text-right pb-0.5">
            총 {list.length} 건
          </h2>
            <table className="w-full border-collapse table-fixed border-t-2 border-main">
              <colgroup>
                <col style={{ width: '100px' }} />
                <col />
                <col style={{ width: '150px' }} />
              </colgroup>
              <thead className="sticky top-0 bg-gray-50 border-b-2 border-main">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("statistics.columns.number")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {t("statistics.columns.contentName")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("statistics.columns.bookmarkCount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row: any, index : number) => (
                  <tr
                    key={row.contentsSeq}
                    onClick={() => onOpenDetail(row)}
                    className="border-b border-gray-200 cursor-pointer transition-all hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {index + 1 }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <span className="hover:underline hover:font-semibold ">
                        {row.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">
                      {row.cnt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedData.length === 0 && !isPending && !isFetching && (
              <div className="flex items-center justify-center h-40 text-gray-500">
                {isError ? "데이터를 불러오지 못했습니다." : "데이터가 없습니다."}
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="mt-4">
            <ClientPagination
              currentPage={currentPage}
              totalCount={list.length || 0}
              displayRow={displayRow}
              onClick={(page: number) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>
      </div>
      <Detail
        visible={detail.visible}
        onClose={onDetailClose}
        info={detail.info}
      />
    </>
  );
}
