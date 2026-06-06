import { ReactNode } from "react";

export default function TableElement({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <>
      <tr className="border-b-2">
        <th className="bg-gray-100 p-1 border-r border-b text-xs">{title}</th>
        <td className=" p-2 border-r ">{children}</td>
      </tr>
    </>
  );
}
