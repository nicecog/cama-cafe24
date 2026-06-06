import AG_GRID_LOCALE_KR from "./locale";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowSelectionOptions } from "ag-grid-community";
import { GridProps } from "./GridTypes";
import { cn } from "@/utils/utils";
import { useMemo } from "react";
export default function Grid(props: GridProps) {
  // Props;
  const {
    colDefs,
    rowData,
    className,
    pagination = true,

    domLayout = "normal",
    defaultColDef,
    rowSelection,
    onSelectionChanged,
    onGridReady,
    onCellClicked,
    onCellDoubleClicked,
  } = props;

  //  Default Column Def
  const _defaultColDef: ColDef = {
    flex: 1,
    cellStyle: { textAlign: "center" },
    ...defaultColDef,
  };

  const rowSelections = useMemo<
    RowSelectionOptions | "single" | "multiple" | undefined
  >(() => {
    return rowSelection
      ? {
          mode: rowSelection === "multiple" ? "multiRow" : "singleRow",
          checkboxes: true,
          headerCheckbox: true,
          enableSelectionWithoutKeys: true,
          enableClickSelection: true,
          selectAll: "currentPage",
        }
      : undefined;
  }, [rowSelection]);

  return (
    <div className=" relative flex flex-col h-full w-full">
      <div
        className={cn(
          `ag-theme-quartz h-full    w-full overflow-auto `,
          className
        )}
      >
        <AgGridReact
          onGridReady={onGridReady}
          rowSelection={rowSelections}
          domLayout={domLayout}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={_defaultColDef}
          pagination={pagination}
          rowHeight={40} // 각 Row 의 높이
          headerHeight={42} // header 의 높이
          paginationPageSize={50} // 한페이지에 보일 항목 갯수
          localeText={AG_GRID_LOCALE_KR}
          onSelectionChanged={onSelectionChanged}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClicked}
        />
      </div>
    </div>
  );
}
