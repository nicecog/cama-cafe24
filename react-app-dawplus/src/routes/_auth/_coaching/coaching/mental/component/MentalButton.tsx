import { Button } from "@/components/ui/Button";

export default function MentalButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button type="button" className="mt-6 h-14 w-full rounded-2xl text-base font-extrabold" onClick={onClick}>
      {children}
    </Button>
  );
}
