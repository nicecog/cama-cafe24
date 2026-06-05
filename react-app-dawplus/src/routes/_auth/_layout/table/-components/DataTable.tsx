import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import React, { useState } from "react";

import { Each } from "@/components/common/Each";
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
  // 	[],
  // );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      // columnFilters,
      columnVisibility,
    },
  });

  const [sortTarget, setSortTarget] = useState<string>("번호");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center py-4">
        <div className="flex-center gap-4">
          <Select
            value={sortTarget}
            onValueChange={(value) => {
              table.getColumn(sortTarget)?.setFilterValue("");
              setSortTarget(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="필터할 컬럼 선택" />
            </SelectTrigger>
            <SelectContent>
              <Each
                of={table
                  .getAllLeafColumns()
                  .filter((col) => col.getCanFilter())}
                render={(col) => (
                  <SelectItem value={col.id}>{col.id}</SelectItem>
                )}
              />
            </SelectContent>
          </Select>

          <Input
            placeholder="검색어를 입력해주세요"
            value={
              (table.getColumn(sortTarget)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(sortTarget)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        {/* <DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu> */}
      </div>
      <Table className="py-5 bg-gray-50/5">
        {/* 헤더: 고정 */}
        <TableHeader className="flex-shrink-0 sticky top-0 z-10   bg-primary-thin ">
          <Each
            of={table.getHeaderGroups()}
            render={(headerGroup) => (
              <TableRow className="">
                <Each
                  of={headerGroup.headers}
                  render={(header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-center text-black",
                        header.index === 0 && "rounded-tl-md",
                        header.index === headerGroup.headers.length - 1 &&
                          "rounded-tr-md",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )}
                />
              </TableRow>
            )}
          />
        </TableHeader>

        <TableBody className="flex-1 overflow-auto h-full py-10 ">
          <Each
            of={table.getRowModel().rows}
            render={(row) => (
              <TableRow data-state={row.getIsSelected() && "selected"}>
                <Each
                  of={row.getVisibleCells()}
                  render={(cell) => (
                    <TableCell className={`text-center `}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )}
                />
              </TableRow>
            )}
            noData={
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            }
          />
        </TableBody>
      </Table>
      <DataTablePagination table={table} className="flex-shrink-0 " />
    </div>
  );
}
