import { ColDef } from "ag-grid-community";
import RadioCellRenderer from "./RadioCellRender";

type GenerateNumberRowType = {
  headerName: string;
  valueGetter: string;
  resizable: boolean;
  sortable: boolean;
  width: number;
  maxWidth: number;
  minWidth: number;
  filter: boolean;
};

export const generateNumberRow = (opt?: Partial<GenerateNumberRowType>) => ({
  headerName: "No",
  valueGetter: "node.rowIndex + 1",
  resizable: false,
  sortable: false,
  width: 60,
  maxWidth: 60,
  minWidth: 60,
  filter: false,
  cellStyle: { textAlign: "center" },
  ...opt,
});

export const getnerateSelectRow = (opt?: Partial<GenerateNumberRowType>) => ({
  headerName: "선택",
  resizable: false,
  sortable: false,
  filter: false,
  width: 60,
  maxWidth: 60,
  minWidth: 60,
  ...opt,
  cellRenderer: RadioCellRenderer,
});

export const enhanceColDef = (colDef: Partial<ColDef>) => {
  const { width, ...rest } = colDef;
  const enhancedColDef = {
    ...rest,
    ...(width ? { maxWidth: width, minWidth: width } : {}),
  };
  return enhancedColDef;
};
