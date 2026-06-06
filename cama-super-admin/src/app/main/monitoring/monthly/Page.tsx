import DateRangePicker from "@/components/Datepicker/DateRangePicker";
import GridList from "./GridList";
import ChartArea from "./ChartArea";
import { useMemo, useState } from "react";

import MiniCharts from "./MiniCharts";
import { FaChartLine, FaListUl } from "react-icons/fa6";
import { cn } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

import axios from "@/utils/axios";
import dayjs from "dayjs";
import useCodeApi from "../../api/useCodeApi";
import { useTranslation } from "react-i18next";

export default function Monthly() {
  const { t } = useTranslation();
  const [searchInfo, setSearchInfo] = useState({
    frYearMonth: dayjs().startOf("year").format("YYYY-MM"), // UI 표시용
    toYearMonth: dayjs().endOf("year").format("YYYY-MM"),
    userTypeCd: "99",
  });

  const toDbYearMonth = (ym: string) => ym.replace(/-/g, "");

  const { getCodeList } = useCodeApi("USER_TYPE_CD");
  const { data: userTypeCode } = getCodeList();

  const onChange = (name: string, value: any) => {
    setSearchInfo((prev) => ({ ...prev, [name]: value }));
  };

  const [visible, setVisible] = useState(true);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "monitoring",
      "account",
      "getAccountStatList",
      searchInfo.frYearMonth,
      searchInfo.toYearMonth,
      searchInfo.userTypeCd,
    ],
    queryFn: async () => {
      const response = await axios
        .post("/api/monitoring/account/getAccountStatList", {
          frYearMonth: toDbYearMonth(searchInfo.frYearMonth),
          toYearMonth: toDbYearMonth(searchInfo.toYearMonth),
          userTypeCd: searchInfo.userTypeCd,
        })
        .then((res) => res.data.response);
      return response;
    },

    initialData: [],
    select: (data) =>
      [...data].sort(
        (a, b) => Number(b.yearMonth) - Number(a.yearMonth) // 내림차순
      ),
  });

  const chartData = useMemo(() => {
    const reversed = [...data].reverse(); // 최신 → 과거 → 과거 → 최신 으로 뒤집기

    return {
      categories: reversed.map((r: any) =>
        dayjs(r.yearMonth, "YYYYMM").format("YYYY-MM"),
      ),
      churnRate: reversed.map((r: any) => r.churnRate),
      dau: reversed.map((r: any) => r.dau),
      mau: reversed.map((r: any) => r.mau),
      ancrageRate: reversed.map((r: any) => r.ancrageRate),
    };
  }, [data]);

  return (
    <>
      {/* 마스크와 로딩 바 */}
      {(isLoading || isFetching) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-4 text-white text-lg">{t("monthlyMonitoring.loading")}</p>
          </div>
        </div>
      )}
      <div className=" flex flex-col h-full">
        {/* 검색영역 */}

        <div className="flex  items-center justify-between border-b pb-2 border-main mb-5">
          <div className="w-full flex gap-2">
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex-none pl-2 text-sm font-semibold">
                {t("monthlyMonitoring.searchPeriod")}
              </span>
              <DateRangePicker
                showMonthYearPicker
                stDt={searchInfo.frYearMonth}
                edDt={searchInfo.toYearMonth}
                stDtName="frYearMonth"
                edDtName="toYearMonth"
                onChange={onChange}
              />
            </div>

            <div className="w-full flex items-center gap-2">
              <span className="flex-none pl-2 text-sm font-semibold">
                {t("monthlyMonitoring.userType")}
              </span>
              <select
                className="border text-sm p-1.5 rounded-lg border-gray-300 w-[300px] cursor-pointer"
                name="userTypeCd"
                value={searchInfo.userTypeCd}
                onChange={(e) => onChange(e.target.name, e.target.value)}
              >
                <option value="99">{t("monthlyMonitoring.all")}</option>
                {userTypeCode.map((item: any, idx: number) => (
                  <option key={idx} value={item.cd}>
                    {item.val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="shrink-0 flex justify-between items-center   ">
            <div className="flex gap-1 items-center">
              <button
                className={cn(
                  "p-2 bg-gray-300 rounded-md hover:bg-gray-400",
                  visible && "bg-gray-600 text-white"
                )}
                onClick={() => setVisible(true)}
              >
                <FaListUl />
              </button>
              <button
                className={cn(
                  "p-2 bg-gray-300 rounded-md hover:bg-gray-400",
                  !visible && "!bg-gray-600 !text-white"
                )}
                onClick={() => setVisible(false)}
              >
                <FaChartLine />
              </button>
            </div>
          </div>
        </div>

        {visible ? (
          <div className=" h-full flex flex-col gap-3 ">
            <MiniCharts data={chartData} />

            <div className=" mt-3  h-full">
              <GridList data={data} searchInfo={searchInfo} />
            </div>
          </div>
        ) : (
          <ChartArea data={chartData} />
        )}
      </div>
    </>
  );
}
