import { ChangeEvent, useMemo } from "react";
import Button from "@/components/button/DefaultButton";
import { Input, Select } from "@/components/forms";
import { useState } from "react";
import axios from "@/utils/axios";
import Pagination from "@/components/Pagination/Pagination";
import { IoAddCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import DetailModal from "./DetailModal";
import NewModal from "./NewModal";

export default function ListView() {
  const { t, i18n } = useTranslation();

  const searchOptions = useMemo(() => [
    { label: t("treatmentInfo.searchTypes.title"), value: "title" },
    { label: t("treatmentInfo.searchTypes.content"), value: "content" },
    { label: t("treatmentInfo.searchTypes.author"), value: "doctorName" },
  ], [t, i18n.language]);

  const [visible, setVisible] = useState(false);
  const [selectedSeq, setSelectedSeq] = useState<string>("");
  const [newModalVisible, setNewModalVisible] = useState(false);

  const onClick = (info: any) => () => {
    setSelectedSeq(info.seq);
    setVisible(true);
  };

  // 입력용 state (타이핑할 때 사용)
  const [searchInput, setSearchInput] = useState({
    searchText: "",
    searchType: "title",
    page: "1",
  });

  // 실제 쿼리용 state (검색 버튼 클릭 시 업데이트)
  const [queryParams, setQueryParams] = useState({
    searchText: "",
    searchType: "title",
    page: "1",
  });

  // React Query를 사용한 데이터 fetching
  const { data } = useQuery({
    queryKey: ["disabledTreatment", queryParams, i18n.language],
    queryFn: async () => {
      const response = await axios.get("/api/doctor/disable/contents", { 
        params: { ...queryParams, lang: i18n.language } 
      });
      return {
        rows: response.data.response,
        pagination: response.data.pagination,
      };
    },
    placeholderData: keepPreviousData, // 이전 데이터 유지
  });

  const pageData = data || {
    rows: [],
    pagination: {
      beginPage: 1,
      currentPage: 1,
      displayPage: 5,
      displayRow: 10,
      endNum: 10,
      endPage: 0,
      nextPage: 0,
      prevPage: 1,
      startNum: 0,
      totalCount: 0,
      totalPage: 0,
    },
  };

  // OnChange
  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInput((s) => ({ ...s, [name]: value }));
  };

  // 검색 버튼 클릭
  const onSearchClick = () => {
    setQueryParams(searchInput);
  };

  // 페이지네이션 클릭
  const onClickHandler = (page: any) => {
    setQueryParams({ ...queryParams, page });
  };

  // 초기화 버튼
  const onReset = () => {
    const initialState = {
      searchText: "",
      searchType: "title",
      page: "1",
    };
    setSearchInput(initialState);
    setQueryParams(initialState);
  };

  // Enter 키 핸들러
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchClick();
    }
  };

  return (
    <>
      <DetailModal 
        visible={visible} 
        onClose={() => setVisible(false)} 
        seq={selectedSeq}
      />
      <NewModal 
        visible={newModalVisible} 
        onClose={() => setNewModalVisible(false)} 
      />
      
      <div className="h-full flex flex-col">
        <div className="flex content-center  pb-2 border-b gap-1 justify-between border-main">
          <div className="flex content-center  gap-1">
            <Select
              options={searchOptions}
              onChange={onChange}
              name="searchType"
              value={searchInput.searchType}
              className="w-28"
            />
            <Input
              value={searchInput.searchText}
              onChange={onChange}
              onKeyDown={onKeyDown}
              name="searchText"
              className="w-48"
            />
            <button
              type="button"
              className={`bg-main text-white px-4 rounded-sm text-sm font-scDream  `}
              onClick={onSearchClick}
            >
              {t("treatmentInfo.searchButton")}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 rounded-sm text-sm font-scDream hover:bg-gray-300"
              onClick={onReset}
            >
              {t("treatmentInfo.resetButton")}
            </button>
          </div>
          <Button
            onClick={() => {
              setNewModalVisible(true);
            }}
            className="flex items-center gap-1  "
          >
            <IoAddCircleOutline className="text-[19px]" />
            {t("treatmentInfo.newRegistration")}
          </Button>
        </div>

        {/* 총 개수 표시 */}
        <div className="py-2 px-1 text-sm text-gray-600 text-right">
          {t("treatmentInfo.totalCountPrefix")} <span className="font-semibold text-main">{pageData.pagination.totalCount}</span>{t("treatmentInfo.totalCountSuffix")}
        </div>

        <div className="relative overflow-y-auto h-[82svh] p-5 my-2 ">
          <div className="w-full">
            {pageData.rows.length === 0 && (
              <div className="p-5 text-center text-sm mt-10">
                {t("treatmentInfo.noData")}
              </div>
            )}
            {pageData.rows.map((i: any, index: number) => (
              <div
                className="my-2 cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                key={index}
                onClick={onClick(i)}
              >
                <div className="flex bg-white border border-main rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  {/* 섬네일 */}
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                    <img
                      src={i.image}
                      alt="Thumbnail"
                      className="w-full h-full object-cover aspect-[4/3]"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex flex-col justify-between p-4 grow">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                      {i.title}
                    </h2>

                    <div className="text-xs text-gray-600 flex gap-4">
                      <span>
                        🖋 {t("treatmentInfo.author")}:{" "}
                        <span className="text-gray-800 font-medium">
                          {i.doctorName}
                        </span>
                      </span>
                      <span>
                        🕒 {t("treatmentInfo.modified")}:{" "}
                        <span className="text-gray-800 font-medium">
                          {i.updatedAt}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 border-t border-main">
          <Pagination
            startNum={pageData.pagination.startNum}
            displayRow={pageData.pagination.displayRow}
            totalCount={pageData.pagination.totalCount}
            totalPage={pageData.pagination.totalPage}
            currentPage={pageData.pagination.currentPage}
            onClick={onClickHandler}
          />
        </div>
      </div>
    </>
  );
}
