import { Button } from "@/components/button";
import AgGrid from "@/components/grid/AgGrid";
import useExcelDownload, { ColumnDefsType } from "@/hooks/useExcelDownload";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function GridList(props: { data: any[]; searchInfo: any }) {
  const { data, searchInfo } = props;
  const { t , i18n} = useTranslation();
 
  //   컬럼 header 정의
  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      {
        headerName: t("monthlyMonitoring.columns.yearMonth"),
        field: "yearMonth",

        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("monthlyMonitoring.columns.churnRate"),
        field: "churnRate",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("monthlyMonitoring.columns.dau"),
        field: "dau",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("monthlyMonitoring.columns.mau"),
        field: "mau",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        headerName: t("monthlyMonitoring.columns.anchorageRate"),
        field: "ancrageRate",
        cellStyle: {
          textAlign: "center",
        },
      },
    ],
    [t, i18n.language]
  );

  const { onDownload } = useExcelDownload({
    columnDefs,
    fileName: `월평가지표 ${searchInfo.frYearMonth} ~ ${searchInfo.toYearMonth}.xlsx`,
    rowData: data.map((r: any, idx: number) => ({ ...r, no: idx + 1 })),
    options: {
      headerHeight: 20,
      defaultWidth: 20,
      defaultHeight: 35,
    },
  });

  return (
    <>
      <div className="h-full ">
        <AgGrid
          colDefs={columnDefs}
          rowData={data}
          buttons={
            <Button
              onClick={onDownload}
              className="!text-[14px] !font-thin !bg-green-600"
            >
              {t("monthlyMonitoring.excelDownload")}
            </Button>
          }
        />
      </div>
    </>
  );
}
