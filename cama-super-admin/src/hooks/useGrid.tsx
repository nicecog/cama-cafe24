import { useState } from "react";
import { GridApi } from "ag-grid-community";

// Grid Hoos Type
export type useGridReturn<T> = {
  gridApi: any;
  onGridReady: (api: GridApi, rowData: any[]) => void;
  addRow: () => void;
  deleteRows: () => void;
  getRowData: () => T[];
  refreshCells: () => void;
  setRowDatas: (rowData: any[]) => void;
  sizeColumnsToFit: () => void;
};

// Use Grid Cutom Hooks
const useGrid = <T = any,>(): useGridReturn<T> => {
  // Grid API 을 담을 State
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  // 실제 Row Data
  const [rowData, setRowData] = useState<any[] | null>(null);

  // Grid Ready 시 GridAPI 가져옴
  const onGridReady = (params: any, _rowData: any[]) => {
    setGridApi((_) => params);
    setRowData((_) => _rowData);
  };
  // Grid Add Row  - 목록하나 추가
  const addRow = () => {
    gridApi?.applyTransaction?.({
      add: [{} as T],
    })!;
  };
  //  현재 그리드 Data 가져옴
  const getRowData = () => {
    const updatedRowData: T[] = [];
    gridApi?.forEachNode((node: any) => {
      updatedRowData.push(node.data);
    });
    gridApi?.setGridOption("rowData", updatedRowData);
    return updatedRowData;
  };
  // 선택된 그리드 Row 삭제
  const deleteRows = () => {
    gridApi?.applyTransaction?.({
      remove: gridApi?.getSelectedRows?.(),
    })!;
    gridApi?.refreshCells();
  };

  const setRowDatas = (rowData: any[]) => {
    gridApi?.setGridOption("rowData", rowData);
  };

  const sizeColumnsToFit = () => {
    if (!gridApi?.isDestroyed()) {
      gridApi?.sizeColumnsToFit();
    }
  };

  const refreshCells = () => {
    gridApi?.setGridOption("rowData", rowData);
  };

  // TODO 계속 기능 추가 예정
  return {
    gridApi,
    onGridReady,
    addRow,
    getRowData,
    deleteRows,
    refreshCells,
    setRowDatas,
    sizeColumnsToFit,
  };
};

export default useGrid;
