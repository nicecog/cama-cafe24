import { Button } from "@/components/ui/Button";
import { useDialog } from "@/hooks/useDialog";
export default function ModalComponent() {
  const { alert, confirm } = useDialog();

  const onOk = () => {
    alert("OK");
  };
  const onCancel = () => {
    alert("Cancel");
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        className="bg-primary hover:bg-primary-hover"
        onClick={() => {
          alert("Confirm Test", onOk);
        }}
      >
        Alert
      </Button>
      <Button
        className="bg-primary hover:bg-primary-hover"
        onClick={() => {
          confirm("Confirm Test", onOk, onCancel);
        }}
      >
        Confirm
      </Button>
    </div>
  );
}
