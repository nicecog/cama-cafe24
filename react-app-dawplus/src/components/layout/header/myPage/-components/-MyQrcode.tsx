import { useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import Popup from "@/components/ui/Popup";
import HeadType5 from "@/assets/images/character/head/type5.png";

interface MyQrcodeProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MyQrcode({ open, setOpen }: MyQrcodeProps) {
  const { data } = useAtomValue(accountMeAtom);
  const userName = data?.name ?? "";
  const qrValue = `user:${data?.loginId || userName}`;

  // 마우스 움직임에 따른 반사(Reflective) 효과 및 3D 틸트 효과 상태
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      direction="bottom"
      title="나의 QR코드보기"
    >
      <div className="flex flex-col items-center pt-10 h-full bg-slate-50 px-5 pb-15 overflow-hidden">
        {/* 사원증 디자인 컨테이너 (3D Perspective) */}
        <div className="relative mt-8" style={{ perspective: "1000px" }}>
          {/* 메인 카드 (Reflective Card) */}
          <div
            ref={cardRef}
            className="relative bg-gradient-to-br from-primary via-primary/50 to-primary p-1.5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-[340px] w-[88vw] h-[460px] sm:h-[500px] overflow-hidden transition-transform duration-200 ease-out z-30 cursor-pointer animate-gradient-bg [touch-action:none] [will-change:transform]"
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
          >
            {/* 반사 광택 효과 오버레이 */}
            <div className="pointer-events-none absolute inset-0 z-50 transition-opacity duration-300 rounded-[22px]" />

            {/* 카드 내부 컨텐츠 */}
            <div className="bg-white/10 backdrop-blur-md w-full h-full rounded-[20px] p-5 sm:p-6 flex flex-col items-center justify-between relative z-10 border border-white/30 shadow-inner">
              {/* 로고 / 타이틀 */}
              <div className="w-full flex justify-between items-center">
                <span className="text-white font-black text-sm tracking-widest drop-shadow-md">
                  CAMA+
                </span>
              </div>

              {/* 프로필 및 유저 정보 */}
              <div className="flex flex-col items-center">
                {/* 프로필 이미지 (사원증 사진 역할) */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center mb-3 sm:mb-4 overflow-hidden bg-white/30 backdrop-blur-sm">
                  <img
                    src={HeadType5}
                    alt="Profile"
                    className="w-full h-full object-cover p-1 rounded-full"
                  />
                </div>

                {/* 유저 정보 */}
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-0.5 sm:mb-1 drop-shadow-md">
                  {userName}
                </h2>
                <p className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide">
                  ID: {data?.loginId || "MEMBER"}
                </p>
              </div>

              {/* QR 코드 블록 */}
              <div className="bg-white p-2.5 sm:p-3 rounded-[1.2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative transition-transform hover:scale-105 duration-300">
                <QRCodeSVG
                  value={qrValue}
                  size={150}
                  level="H"
                  imageSettings={{
                    src: HeadType5,
                    height: 34,
                    width: 34,
                    excavate: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
