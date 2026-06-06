import { ChangeEvent, useEffect } from "react";
import Button from "@/components/button/DefaultButton";
import { Input, Select } from "@/components/forms";
import { useState } from "react";
import axios from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination/Pagination";
import { IoAddCircleOutline } from "react-icons/io5";
export default function ListView(props: any) {
  //  Props
  const { url } = props;
  // Nav
  const navigate = useNavigate();

  const onClick = (info: any) => () => {
    navigate(`./${info.seq}`);
  };

  const [searchInfo, setSearchInfo] = useState({
    searchText: "",
    searchType: "title",
    page: "1",
  });

  const [pageData, setPageData] = useState({
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
  });
  // useEffect
  useEffect(() => {
    onSearch(searchInfo);
  }, []);

  // 검색
  const onSearch = (info: any) => {
    axios.get(url, { params: info }).then(({ data }) => {
      setPageData((s) => ({
        ...s,
        rows: data.response,
        pagination: data.pagination,
      }));
    });
  };
  // OnChange
  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInfo((s) => ({ ...s, [name]: value }));
  };

  // 검색 클릭
  const onClickHandler = (page: any) => {
    onSearch({ ...searchInfo, page });
  };
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex content-center pl-3  pb-2 border-b gap-1 justify-between">
          <div className="flex content-center  gap-1">
            <Select
              options={[
                { label: "제목", value: "title" },
                { label: "내용", value: "content" },
                { label: "작성자", value: "doctorName" },
              ]}
              onChange={onChange}
              name="searchType"
              value={searchInfo.searchType}
              className="w-28"
            />
            <Input
              value={searchInfo.searchText}
              onChange={onChange}
              name="searchText"
              className="w-48"
            />
            <Button onClick={() => onSearch(searchInfo)} className="ml-2">
              검색
            </Button>
          </div>
          <Button
            onClick={() => {
              navigate(`../contentMng/create`);
            }}
            className="flex items-center gap-1  "
          >
            <IoAddCircleOutline className="text-[19px]" />
            신규등록
          </Button>
        </div>

        <div className="relative overflow-y-auto h-[82svh] p-5 my-2 ">
          <div className="w-full">
            {pageData.rows.length === 0 && (
              <div className="p-5 text-center text-sm mt-10">
                조회된 데이터가 없습니다.
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
                        🖋 작성자:{" "}
                        <span className="text-gray-800 font-medium">
                          {i.doctorName}
                        </span>
                      </span>
                      <span>
                        🕒 수정:{" "}
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
        <div className="shrink-0 border-t">
          <Pagination
            startNum={pageData.pagination.startNum}
            displayRow={pageData.pagination.displayRow}
            totalCount={pageData.pagination.totalCount}
            currentPage={pageData.pagination.currentPage}
            onClick={onClickHandler}
          />
        </div>
      </div>
    </>
  );
}
