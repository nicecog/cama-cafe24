export default function Rating(props: any) {
  // props
  const { onChange, value } = props;

  const ratingOption = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}점`,
    value: i + 1,
  }));
  return (
    <>
      <select
        onChange={onChange}
        name="rating"
        value={value}
        className="w-full p-1 max-h-28 rounded-lg  border-[#774F2D] border-2"
      >
        {ratingOption.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </>
  );
}
