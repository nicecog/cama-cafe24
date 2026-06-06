import { ColDef, DomLayoutType } from "ag-grid-community";
import { ReactNode } from "react";

export interface GridProps {
  colDefs: any[];
  rowData: any[];
  className?: string;
  pagination?: boolean;
  height?: string;
  buttons?: ReactNode;
  domLayout?: DomLayoutType;
  showTotal?: boolean;
  defaultColDef?: ColDef;
  onGridReady?: (event: any) => void;
  rowSelection?: "single" | "multiple";
  onSelectionChanged?: (event: any) => void;
  onCellClicked?: (data: any) => void;
  onCellDoubleClicked?: (data: any) => void;
}
