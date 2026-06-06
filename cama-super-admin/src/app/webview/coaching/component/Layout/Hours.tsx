export default function Hours(props: any) {
  // props
  const { onChange, value, name = "sleep", label = "시간" } = props;

  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${String(i + 1)}${label}`,
    value: String(i + 1),
  }));

  return (
    <>
      <select
        onChange={onChange}
        name={name}
        value={value}
        className="w-full p-1 max-h-28 rounded-lg border-[#774F2D] border-2"
      >
        {hours.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </>
  );
}
