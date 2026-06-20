import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    direction={direction}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-[250] bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  variant?: "default" | "full";
  direction?: "top" | "bottom" | "left" | "right";
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      variant = "default",
      direction = "bottom",
      ...props
    },
    ref,
  ) => {
    // direction에 따른 위치 및 rounded 스타일
    const directionStyles = {
      bottom:
        variant === "full"
          ? "inset-x-0 bottom-0 min-h-screen max-h-screen rounded-none"
          : "inset-x-0 bottom-0 mt-24 h-[96vh] rounded-t-[10px]",
      top:
        variant === "full"
          ? "inset-x-0 top-0 min-h-screen max-h-screen rounded-none"
          : "inset-x-0 top-0 mb-24 h-[96vh] rounded-b-[10px]",
      left:
        variant === "full"
          ? "inset-y-0 left-0 w-screen rounded-none"
          : "inset-y-0 left-0 mr-24 w-[96vw] rounded-r-[10px]",
      right:
        variant === "full"
          ? "inset-y-0 right-0 w-screen rounded-none"
          : "inset-y-0 right-0 ml-24 w-[96vw] rounded-l-[10px]",
    };

    // direction에 따른 드래그 핸들 위치
    const handlePosition = {
      bottom: "mx-auto mt-4 h-2 w-[100px]",
      top: "mx-auto mb-4 h-2 w-[100px]",
      left: "my-auto ml-4 w-2 h-[100px]",
      right: "my-auto mr-4 w-2 h-[100px]",
    };

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            "fixed z-[251] flex flex-col border bg-background",
            direction === "bottom" && "pb-safe",
            directionStyles[direction],
            className,
          )}
          {...props}
        >
          {variant === "default" && (
            <div
              className={cn("rounded-full bg-muted", handlePosition[direction])}
            />
          )}
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "grid gap-1.5 p-4 pt-safe text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
