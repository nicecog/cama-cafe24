import { useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { HelpPopupAtom } from "@/atoms/CommonAtoms";
import { HelpMenuList } from "@/components/help/HelpMenuList";
import Popup from "@/components/ui/Popup";

export default function Help() {
  const [open, setOpen] = useAtom(HelpPopupAtom);
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    setOpen(false);
    navigate({ to: "/help/$id", params: { id: String(id) } });
  };

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      title="도움말"
      direction="right"
      className="bg-white"
    >
      <HelpMenuList
        linkBase="/help"
        onItemClick={handleNavigate}
      />
    </Popup>
  );
}
