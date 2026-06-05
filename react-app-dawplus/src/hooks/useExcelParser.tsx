import { useState } from "react";
import * as XLSX from "xlsx";

interface UseExcelParserType<T> {
  data: T[];
  error: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useExcelParser<T>(
  headerOption?: number | string[] | "A" | undefined,
): UseExcelParserType<T> {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) throw new Error("파일을 읽을 수 없습니다.");

        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
        const workbook = XLSX.read(uint8Array, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 타입 안전하게 JSON 변환
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, {
          header: headerOption,
          defval: "",
        });

        setData(jsonData);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("엑셀 파일 파싱 중 알 수 없는 오류 발생");
        }
        setData([]);
      }
    };

    reader.readAsArrayBuffer(file);

    // 같은 파일 선택 시 onChange 트리거를 위해 초기화
    e.target.value = "";
  };

  return { data, error, handleFileChange };
}
