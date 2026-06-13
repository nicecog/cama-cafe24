import { cn } from "@/lib/utils";

export default function ImageBox({
  imgSrc,
  className,
  containerClassName,
}: {
  imgSrc: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div className={cn("flex justify-center", containerClassName)}>
      <img src={imgSrc} alt="" className={cn("h-auto w-[120px] object-contain", className)} />
    </div>
  );
}
