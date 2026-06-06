import { useNavigate } from "react-router-dom";
import { Select } from "@/components/forms";
import { ChangeEvent, useState, useMemo, useEffect } from "react";
import Button from "@/components/button/DefaultButton";
import PaginationV2 from "@/components/Pagination/PaginationV2";
import dayjs from "dayjs";
import { IoAddCircleOutline } from "react-icons/io5";
import { FcTouchscreenSmartphone } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { useGetWellbeingResourceList } from "./useWellbeing";
import { type WellbeingType } from "./wellbeingAtom";
import Each from "@/components/common/Each";

export default function Wellbeing() {
  //  Translate
 const { t, i18n } = useTranslation();
  
  // Nav
  const navigate = useNavigate();


  //  Search Options 
  const searchOptions = useMemo(() => [
    { label: t("wellbeing.searchTypes.title"), value: "title" },
    { label: t("wellbeing.searchTypes.companyName"), value: "companyName" },
  ], [t, i18n.language]);

  

  //  이동
  const onClick = (info: any) => () => {
    navigate(`./${info.seq}`);
  };

  const [searchInfo, setSearchInfo] = useState({
    searchText: "",
    searchType: "title",
    page: 1,
  });


  const [params, setParams] = useState({
    searchText: "",
    searchType: "title",
    page: 1,
    lang: i18n.language
  })

  // 언어 변경 시 params 업데이트 (페이지를 1로 리셋)
  useEffect(() => {
    setParams(prev => ({ 
      ...prev, 
      lang: i18n.language,
      page: 1 // 언어 변경 시 첫 페이지로
    }));
  }, [i18n.language]);

  const {data} = useGetWellbeingResourceList(params)
    
  // OnChange
  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInfo((s) => ({ ...s, [name]: value }));
  };

  const onChangePage = (page : number) => {
    setParams((s) => ({ ...s, page }));
  };

  // 검색 클릭
  const onClickHandler = () => {
    setParams(prev=> ({...prev, ...searchInfo, page: 1}));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setParams(prev=> ({...prev, ...searchInfo, page : 1}));
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex content-center border-b border-main gap-1 justify-between pb-2">
          <div className="flex content-center ">
            <Select
              options={searchOptions}
              onChange={onChange}
              name="searchType"
              value={searchInfo.searchType}
              className="w-28 flex-1"
            />
            <input
              type="text"
              value={searchInfo.searchText}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              name="searchText"
              className="block p-1 text-gray-900 border border-gray-300 rounded-sm bg-white sm:text-xs focus:outline-none  w-48"
            />

            <Button onClick={() => onClickHandler()} className="ml-2">
              {t("wellbeing.searchButton")}
            </Button>
          </div>
          <Button
            onClick={() => {
              navigate(`../contentMng/wellbeing/create`);
            }}
            className="flex items-center gap-1  "
          >
            <IoAddCircleOutline className="text-[19px]" />
            {t("wellbeing.newRegistration")}
          </Button>
        </div>

        <div className="relative overflow-y-auto h-[82svh] p-5 my-2 ">
          <div className="w-full">
            <Each
              of={data?.response}
              keyItem={(item, index) => item.seq ?? index}
              noData={
                <div className="p-5 text-center text-sm mt-10">
                  {t("wellbeing.noData")}
                </div>
              }
              render={(i: WellbeingType, index: number) => (
              <div
                className="my-2 cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                key={index}
                onClick={onClick(i)}
              >
                <div className="flex bg-white border border-main rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  {/* 섬네일 */}
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center shrink-0">
                    <img
                      src={i.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover  "
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex p-4 grow ">
                    <div className="w-5/12 flex flex-col gap-3">
                      <h2 className="text-md font-semibold text-gray-800 mb-1  ">
                        <span className="mr-1 text-main font-bold">
                          [{` ${i.wellbeingCategoryNm} `}]
                        </span>
                        {i.title}
                      </h2>
                      {/* 작성정보 */}
                      <div className="text-sm text-gray-600 flex gap-4  ">
                        <span>
                          🖋 {t("wellbeing.createdDate")}:{" "}
                          <span className="text-gray-800 font-medium">
                            {dayjs(i.createdAt).format("YYYY-MM-DD")}
                          </span>
                        </span>
                        <span>
                          🕒 {t("wellbeing.modified")}:{" "}
                          <span className="text-gray-800 font-medium">
                            {dayjs(i.updatedAt).format("YYYY-MM-DD")}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* 회사 정보 가로 배치 */}
                      <div className=" text-sm text-gray-600 w-7/12">
                        <div className="mb-1">
                          <p>
                            <span className="font-semibold">{t("wellbeing.companyName")} :</span>{" "}
                            {i.companyName}
                          </p>
                          <p>
                            <span className="font-semibold">{t("wellbeing.introduction")}:</span>{" "}
                            {i.companyDescription.length > 70
                              ? i.companyDescription.slice(0, 70) + "..."
                              : i.companyDescription}
                          </p>
                          <p>
                            <span className="font-semibold">{t("wellbeing.address")}:</span>{" "}
                            {i.address}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            <span className="font-semibold">{t("wellbeing.contact")}:</span>{" "}
                            {i.phoneNumber}
                          </p>
                          {i.sns && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">SNS:</span>
                              <a
                                href={
                                  i.sns?.startsWith("http")
                                    ? i.sns
                                    : `http://${i.sns}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:font-bold flex items-center gap-1"
                              >
                                <FcTouchscreenSmartphone className="text-[19px]" />
                                SNS
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{t("wellbeing.homepage")}:</span>
                            <a
                              href={
                                i.homepage?.startsWith("http")
                                  ? i.homepage
                                  : `http://${i.homepage}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              {i.homepage?.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            )}
            />
          </div>
        </div>
        {data?.pagination && (
          <div className="shrink-0 border-t border-main">
            <PaginationV2
              pagination={data.pagination}
              onPageChange={onChangePage}
            />
          </div>
        )}
      </div>
    </>
  );
}
