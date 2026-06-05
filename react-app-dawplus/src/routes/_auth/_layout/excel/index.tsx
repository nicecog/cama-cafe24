import { createFileRoute } from "@tanstack/react-router";
import { useExcelParser } from "@/hooks/useExcelParser";

export const Route = createFileRoute("/_auth/_layout/excel/")({
  component: RouteComponent,
});

interface Employee {
  EEID: string;
  "Full Name": string;
  "Job Title": string;
  Department: string;
  "Business Unit": string;
  Gender: string;
  Ethnicity: string;
  Age: number;
  "Hire Date": number; // Excel 날짜 숫자 (Serial Number)
  "Annual Salary": number;
  "Bonus %": number;
  Country: string;
  City: string;
  "Exit Date"?: number; // optional 가능
}

function RouteComponent() {
  const { data, handleFileChange } = useExcelParser<Employee>();

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
