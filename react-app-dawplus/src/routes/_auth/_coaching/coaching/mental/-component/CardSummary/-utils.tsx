import type { ReactNode } from "react";
import useMentalType from "@/hooks/useMentalType";
import Popup from "@/components/ui/Popup";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import image63 from "@/assets/images/coaching/mental/63.png";
import { MentalCardBubble, MentalCardPanel } from "../Cards/-components";
import type { CardSummaryTitleType } from "./-types";

const titleMap: Record<CardSummaryTitleType, Record<string, ReactNode>> = {
  card1: {
    전투형: (
      <>
        마음의 휴식을 위한
        <br />
        복식호흡
      </>
    ),
    억압형: (
      <>
        기분을 다스리는
        <br />
        복식호흡
      </>
    ),
    순응형: (
      <>
        기분을 다스리는 <br />
        복식호흡
      </>
    ),
    자포자기형: (
      <>
        마음이 편안해지는 <br />
        복식호흡
      </>
    ),
    걱정형: (
      <>
        마음이 편안해지는 <br />
        복식호흡
      </>
    ),
  },
  card2: {
    전투형: (
      <>
        나를 돌보는
        <br />
        마음 표현하기
      </>
    ),
    억압형: (
      <>
        적극적 대처를 위한
        <br />
        마음 표현하기
      </>
    ),
    순응형: (
      <>
        나를 돌보는
        <br />
        마음 표현하기
      </>
    ),
    자포자기형: (
      <>
        나를 돌보는
        <br />
        마음 표현하기
      </>
    ),
    걱정형: (
      <>
        나를 돌보는
        <br />
        마음 표현하기
      </>
    ),
  },
  card3: {
    전투형: (
      <>
        마음의 휴식을 위한
        <br />
        명상
      </>
    ),
    억압형: (
      <>
        마음을 알아차리는
        <br />
        명상
      </>
    ),
    순응형: (
      <>
        마음을 달래는
        <br />
        명상
      </>
    ),
    자포자기형: (
      <>
        마음의 회복을 돕는
        <br />
        명상
      </>
    ),
    걱정형: (
      <>
        생각을 덜어내기 위한
        <br />
        명상
      </>
    ),
  },
  card4: {
    전투형: (
      <>
        긍정적인 마음을 위한
        <br />
        생각바꾸기
      </>
    ),
    억압형: (
      <>
        기분을 달래는
        <br />
        생각바꾸기
      </>
    ),
    순응형: (
      <>
        긍정적인 마음을 위한
        <br />
        생각바꾸기
      </>
    ),
    자포자기형: (
      <>
        긍정적인 마음을 위한
        <br />
        생각바꾸기
      </>
    ),
    걱정형: (
      <>
        걱정을 줄이기 위한
        <br />
        생각바꾸기
      </>
    ),
  },
};

export function CardSummaryShell({
  cardType,
  children,
}: {
  cardType: CardSummaryTitleType;
  children: ReactNode;
}) {
  const type = useMentalType();
  const title = titleMap[cardType][type] ?? null;

  return (
    <MentalCardPanel>
      <MentalCardBubble>{title}</MentalCardBubble>
      {children}
    </MentalCardPanel>
  );
}

export function CardSummaryPopup({
  children,
  open,
  setOpen,
  afterClose,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  afterClose?: () => void;
}) {
  return (
    <Popup
      open={open}
      setOpen={setOpen}
      afterClose={afterClose}
      title=""
      direction="bottom"
      className="bg-[#f2f7f5]"
    >
      <div className="px-5 pb-8 pt-6">
        <div className="mx-auto max-w-[32rem]">{children}</div>
      </div>
    </Popup>
  );
}

export function EncourageAlertDialog({
  open,
  onConfirm,
}: {
  open: boolean;
  onConfirm: () => void;
}) {
  return (
    <DialogPrimitive.Root open={open} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:duration-200 data-[state=closed]:duration-150" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[301] flex items-center justify-center p-4 focus:outline-none"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            격려 메시지
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            포기하지 않고 시도하는 모습을 격려하는 안내창
          </DialogPrimitive.Description>
          <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-2xl rounded-[2.5rem] p-6 flex flex-col items-center">
            <style>{`
              @keyframes soft-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              }
              .animate-soft-float {
                animation: soft-float 4s ease-in-out infinite;
              }
            `}</style>
            <img
              src={image63}
              alt="격려"
              className="mx-auto w-full max-w-[180px] mb-4 animate-soft-float object-contain"
            />
            <p className="text-slate-800 font-extrabold text-base leading-relaxed text-center break-keep">
              한 번에 다 기억하기 어려울 수 있어요. 그래도 복습하며 여기까지
              온 스스로를 격려해주세요.
            </p>
            
            <p className="mt-5 text-center font-black text-lg text-primary break-keep">
              포기하지 않고 시도하는 모습이 멋져요!
            </p>
            
            <button
              type="button"
              className="mt-6 h-12 w-full rounded-2xl bg-primary text-white text-base font-bold shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              onClick={onConfirm}
            >
              확인
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
