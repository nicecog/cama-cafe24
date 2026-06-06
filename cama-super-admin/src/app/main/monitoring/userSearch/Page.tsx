import Button from "@/components/button/DefaultButton";
import DatePicker from "@/components/Datepicker/DatePicker";
import AgGrid from "@/components/grid/AgGrid";
import useExcelDownload, { ColumnDefsType } from "@/hooks/useExcelDownload";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function UserSearch() {
  const { t, i18n } = useTranslation();
  //   컬럼 header 정의
  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      {
        headerName: t("userSearch.columns.no"),
        field: "no",
        maxWidth: 70,
        valueGetter: "node.rowIndex + 1",
      },
      {
        headerName: t("userSearch.columns.searchDate"),
        field: "searchDt",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("userSearch.columns.userName"),
        field: "name",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("userSearch.columns.cancerType"),
        field: "cancerTypeNm",
        cellStyle: {
          textAlign: "center",
        },
        cellRenderer: (params: any) => {
          return params.data.cancerTypeNm ? params.data.cancerTypeNm : t("userSearch.all");
        },
      },
      {
        headerName: t("userSearch.columns.searchText"),
        field: "searchText",
        flex: 2,
        cellStyle: {
          textAlign: "center",
        },
      },
    ],
    [t, i18n.language]
  );

  const [searchInfo, setSearchInfo] = useState({
    yyyymm: dayjs().format("YYYY-MM"),
    name: "",
  });

  const onChange = (name: string, value: any) => {
    setSearchInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSearch = () => {
    refetch();
  };

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["monitoring", "account", "getSearchTextList"],
    queryFn: async () => {
      const response = await axios
        .post("api/monitoring/account/getSearchTextList", {
          yyyymm: searchInfo.yyyymm.replace("-", ""),
          name: searchInfo.name,
        })
        .then((res) => res.data.response);
      return response;
    },
    initialData: [],
  });

  const { onDownload } = useExcelDownload({
    columnDefs,
    fileName: `사용자별검색어_${searchInfo.yyyymm}.xlsx`,
    rowData: data.map((r: any, idx: number) => ({ ...r, no: idx + 1 })),
    options: {
      headerHeight: 20,
      defaultWidth: 20,
      defaultHeight: 35,
    },
  });

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refetch();
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* 검색영역 */}
        <div className="flex gap-2 w-full flex-none border-b pb-2 border-main">
          {/*  검색어  */}
          <div className="flex items-center gap-5 w-full">
            <div className="flex gap-4 items-center  shrink-0">
              <span className="flex-none pl-2 text-sm font-semibold">
                {t("userSearch.searchPeriod")}
              </span>
              <DatePicker
                showMonthYearPicker
                value={searchInfo.yyyymm}
                name="yyyymm"
                format="YYYY-MM"
                onChange={onChange}
              />
            </div>
            <div className="flex gap-4 items-center     ">
              <span className="flex-none pl-2 text-sm font-semibold">
                {t("userSearch.userName")}
              </span>
              <input
                value={searchInfo.name}
                name="name"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.name, e.target.value)
                }
                onKeyDown={onKeyDownHandler}
                className="p-1.5 border rounded-lg text-sm px-3   w-[300px] "
              />
            </div>
          </div>

          <div className="flex-none flex gap-3">
            <Button onClick={onSearch} className="!text-[16px] !font-thin">
              {t("userSearch.search")}
            </Button>
            <Button className="!bg-white !text-main" onClick={onDownload}>
              {t("userSearch.excelDownload")}
            </Button>
          </div>
        </div>

        <div className="   h-full   mt-4  grow ">
          <AgGrid colDefs={columnDefs} rowData={data} />
        </div>
      </div>
      {/* 마스크와 로딩 바 */}
      {(isLoading || isFetching) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-4 text-white text-lg">{t("userSearch.loading")}</p>
          </div>
        </div>
      )}
    </>
  );
}
