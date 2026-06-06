import { useMemo } from "react";
import * as XLSX from "xlsx-js-style";
import useAlert from "./useAlert";

export type ColumnDefsType = {
  headerName: string;
  field: string;
  width?: number;
  align?: string;
};

export type ExcelDownloadType = {
  columnDefs: ColumnDefsType[];
  rowData: any[];
  options?: {
    headerHeight: number;
    defaultWidth: number;
    defaultHeight: number;
  };
  fileName?: string;
  sheetName?: string;
};

const useExcelDownload = (props: ExcelDownloadType) => {
  const { alert } = useAlert();
  const {
    columnDefs,
    rowData,
    options = {},
    sheetName = "sheet1",
    fileName = "textExcel.xlsx",
  } = props;

  // 기본 Style
  const defaultStyle = useMemo(
    () => ({
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: true,
      },
      font: {
        sz: 10,
        name: "굴림",
        color: { rgb: "364152" },
      },
      border: {
        bottom: { style: "thin", color: { rgb: "666666" } },
        top: { style: "thin", color: { rgb: "666666" } },
        left: { style: "thin", color: { rgb: "666666" } },
        right: { style: "thin", color: { rgb: "666666" } },
      },
    }),
    []
  );

  // Header Style
  const headerStyle = useMemo(
    () => ({
      ...defaultStyle,
      font: {
        ...defaultStyle.font,
        bold: true,
      },
      fill: { fgColor: { rgb: "d9d9d9" }, patternType: "solid" },
    }),
    []
  );

  const onDownload = () => {
    if (rowData.length === 0) {
      alert("다운로드할 Data가 없습니다.");
      return;
    }

    const _options = {
      headerHeight: 26,
      defaultWidth: 12,
      defaultHeight: 150,
      ...options,
    };

    // 엑셀 Header
    const excelHeader = columnDefs.map((i: ColumnDefsType) => ({
      t: "s",
      v: i.headerName,
      s: headerStyle,
    }));

    const excelData = rowData
      .map((item: any) =>
        Object.fromEntries(
          columnDefs.map((column: ColumnDefsType) => [
            column.field,
            item[column.field],
          ])
        )
      )
      .map((i: any) => Object.values(i))
      .map((i: any) =>
        i.map((it: string, idx: number) => ({
          v: it ? String(it).replace(/\n/g, "") : "", //Value 값만
          t: "s", // 타입은 String
          s: {
            ...defaultStyle,
            alignment: {
              ...defaultStyle.alignment,
              horizontal: columnDefs[idx]?.align
                ? columnDefs[idx]?.align
                : "center",
            },
          }, // 스타일
        }))
      );

    // Excel 생성 부분
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([excelHeader, ...excelData]);

    // Header 는 고정
    ws["!rows"] = [
      { hpx: _options.headerHeight },
      ...Array(excelData.length).fill({ hpx: _options.defaultHeight }),
    ];
    ws["!cols"] = columnDefs.map((i: ColumnDefsType) => ({
      wch: i.width ? i.width : _options.defaultWidth,
    }));

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, fileName);
  };

  return {
    onDownload,
  };
};

export default useExcelDownload;
