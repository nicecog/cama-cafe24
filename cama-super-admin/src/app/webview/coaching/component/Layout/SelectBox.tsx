// Selectbox
export default function SelectBox(props: any) {
  const { onChange, value, name, options, className } = props;

  return (
    <>
      <select
        onChange={onChange}
        name={name}
        value={value}
        className={`w-full border p-1 max-h-28 ${className}`}
      >
        {options.map((i: { value: string; label: string }) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </>
  );
}
