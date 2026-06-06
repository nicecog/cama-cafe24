import axios from "@/utils/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { wellbeingSearchInfoAtom, wellbeingSearchText } from "./wellbeingAtom";
import { useNavigate, useParams } from "react-router-dom";
import Clear from "@/assets/images/character/type1.png";
import ImageBox from "../component/ImageBox";
import mission from "@/assets/images/character/mission.png";
export default function WellbeingList() {
  const { loginId } = useParams();

  const navigate = useNavigate();

  const filter = useAtomValue(wellbeingSearchInfoAtom);
  const searchText = useAtomValue(wellbeingSearchText);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["projects", searchText, filter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios
        .post("/api/contents/wellbeing/resources/getWellbeingResourceList", {
          searchType: "title",
          searchText: searchText,
          wellbeingCategoryCd: filter,
          page: pageParam,
        })
        .then((res) => res.data.response);

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined; // No more pages to fetch
      }
      return allPages.length + 1; // Move to the next page number
    },
    initialPageParam: 1,
  });

  return (
    // <RemoveScroll>
    <div className="relative h-full  w-full px-5 bg-white pt-5 overflow-y-auto ">
      {/* If no data exists */}
      {data?.pages[0]?.length === 0 && (
        <div className="p-5 text-center  mt-10 font-oneMobile">
          <ImageBox imgSrc={Clear} className="w-[80px]" />
          조회된 데이터가 없습니다.
        </div>
      )}
      <AnimatePresence initial={false}>
        {/* Render all pages of data */}
        {data?.pages.map((page: any, idx: number) => (
          <React.Fragment key={idx}>
            {page.map((i: any, index: number) => (
              <motion.div
                className="my-4 border cursor-pointer rounded-md shadow-md w-full"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }} // duration을 0.3초로 설정
                whileTap={{ scale: 1.05 }}
                key={index}
                onClick={() =>
                  navigate(`/webview/coaching/wellbeing/${i.seq}/${loginId}`)
                }
              >
                <div className="flex bg-white rounded-lg p-2 gap-3 h-full w-full">
                  <div className="flex flex-col items-center w-[120px]">
                    <img
                      src={i.thumbnail ? i.thumbnail : mission}
                      alt="Thumbnail"
                      className={`rounded-lg  w-[75px] h-[75px]`}
                    />
                  </div>
                  <div className="  p-2 w-full flex flex-col  overflow-hidden">
                    <p className="text-sm text-camaColor font-bold font-notoB">
                      {i.companyName}
                    </p>
                    <h1 className="font-bold text-[16px] w-full text-ellipsis text-nowrap overflow-hidden mt-1.5">
                      {i.title}
                    </h1>
                    {/* truncate 추가 */}
                  </div>
                </div>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
      <div className="pb-20">
        {hasNextPage && (
          <motion.button
            className="w-full  bg-camaColorLight bg-opacity-80 text-gray-900 p-2 rounded-lg shadow-lg font-oneMobile hover:shadow-xl hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
            viewport={{ once: true, margin: "-20px" }}
            whileTap={{ scale: 1.05 }}
            onViewportEnter={() => fetchNextPage()}
            onClick={() => fetchNextPage()}
          >
            불러오는중...
          </motion.button>
        )}
      </div>
    </div>
    // </RemoveScroll>
  );
}
