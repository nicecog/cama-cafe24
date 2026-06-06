import RadioItem from "../forms/RadioItem";

// Radio CellRenderer
export default function RadioCellRenderer({ node }: any) {
  return (
    <div className="flex justify-center items-center h-full">
      <RadioItem checked={node.isSelected()} readOnly={true} />
    </div>
  );
}
