export type TextareaType = {
  name: string;
  value: string;
  onChange: (e: any) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
};

export default function Textarea(props: TextareaType) {
  const { className, value, name, onChange, rows = 4, placeholder } = props;

  return (
    <>
      <textarea
        name={name}
        value={value}
        rows={rows}
        className={`block p-2 w-full text-sm text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 ${className}`}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
}
