import { useState } from "react";
import VirtualKeypad from "@/components/ui/VirtualKeypad";

export default function VirtualKeypadDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col items-start gap-3">
      <VirtualKeypad value={value} onChange={setValue} />
      <p className="text-sm text-slate-600">현재 값: {value || "(비어있음)"}</p>
    </div>
  );
}
