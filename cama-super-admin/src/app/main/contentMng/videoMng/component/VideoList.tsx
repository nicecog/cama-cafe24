export default function VideoList(props: {
  onChange: (e: any) => void;
 
  rowData: any[];
  selectedSeq?: number;
}) {
  const { onChange, rowData,   selectedSeq } = props;

  const handleRowClick = (item: any) => {
    onChange(item);
  };

 
  return (
    <div className="h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50 border-b-2 border-main">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                URL
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                상세설명
              </th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(item)}
          
                className={`border-b border-gray-200 cursor-pointer transition-all ${
                  selectedSeq === item.seq
                    ? 'bg-blue-50 border-l-4 border-l-main shadow-sm'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.url}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.detailDesc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rowData.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-500">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
