import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import CarouselTest from "./-carousel";
import Modal from "./-modal";
import Tabs from "./-tabs";
import VirtualKeypadDemo from "./-virtual-keypad";
export const Route = createFileRoute("/_auth/_layout/ui/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Dialog */}
      <ComponentArea title="Alert Dialog">
        <Modal />
      </ComponentArea>
      <ComponentArea title="Carousel" classname="mt-10">
        <CarouselTest />
      </ComponentArea>
      <ComponentArea title="tab" classname="mt-10">
        <Tabs />
      </ComponentArea>
      <ComponentArea title="Virtual Keypad" classname="mt-10">
        <VirtualKeypadDemo />
      </ComponentArea>
    </>
  );
}

function ComponentArea(props: {
  title: string;
  children: ReactNode;
  classname?: string;
}) {
  return (
    <div className={props?.classname}>
      <h2 className="font-bold border-primary border-b pb-1">{props.title}</h2>
      <div className="mt-2">{props.children}</div>
    </div>
  );
}
