import { createFileRoute } from "@tanstack/react-router";
import { randomFullName, randomGender, randomInt } from "@/lib/demoData";
import { columns, type GridType } from "./-components/Columns";
import { DataTable } from "./-components/DataTable";
export const Route = createFileRoute("/_auth/_layout/table/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data: GridType[] = Array.from({ length: 1020 }, () => ({
    age: randomInt(5, 12),
    name: randomFullName(),
    agency: `하남초등학교병설유치원${randomInt(1, 999)}`,
    gender: randomGender(),
    num: 0,
  })).map((r, idx) => ({ ...r, num: idx + 1 }));

  return <DataTable columns={columns} data={data} />;
}
