import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GridType = {
  num: number;
  name: string;
  age: number;
  gender: string;
  agency: string;
};

export const columns: ColumnDef<GridType>[] = [
  {
    accessorKey: "num",
    header: ({ column }) => {
      return (
        <button
          type="button"
          className="w-full flex-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          번호
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </button>
      );
    },
    size: 50,
    id: "번호",
  },
  {
    id: "이름",
    accessorKey: "name",
    header: ({ column }) => {
      return <>이름 {column.getIsSorted()}</>;
    },
  },
  { accessorKey: "age", header: "나이", id: "나이" },
  { accessorKey: "gender", header: "성별", id: "성별" },
  { accessorKey: "agency", header: "검사기관", id: "검사기관" },
  {
    id: "보기",
    header: "보기",
    cell: () => {
      return (
        <div className="flex-center gap-2">
          <button
            type="button"
            className="bg-primary text-white p-1 rounded-md hover:bg-primary-hover"
          >
            Chart
          </button>
          <button
            type="button"
            className="bg-primary text-white p-1 rounded-md hover:bg-primary-hover"
          >
            Chart2
          </button>
        </div>
      );
    },
  },
];
