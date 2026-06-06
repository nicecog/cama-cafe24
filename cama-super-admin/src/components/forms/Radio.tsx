import RadioItem from "./RadioItem";
// Radio Box Component
export default function Radio(props: any) {
  // Props
  const { options, value, onChange, name } = props;

  // Render
  return (
    <>
      <div className="flex py-1">
        {options.map((it: any, idx: number) => (
          <div className="flex items-center mr-3" key={idx}>
            <RadioItem
              name={name}
              checked={value.toString() === it.value}
              onChange={onChange}
              label={it.label}
              value={it.value}
            />
          </div>
        ))}
      </div>
    </>
  );
}
