import { useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useRef, type MouseEvent } from "react";
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
  const [reflection, setReflection] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setReflection({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setReflection((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      direction="bottom"
      title="나의 QR코드보기"
    >
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
      `}</style>
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 px-5 pt-6 pb-20 overflow-hidden">
        {/* 사원증 디자인 컨테이너 (3D Perspective) */}
        <div className="relative mt-8" style={{ perspective: "1000px" }}>
          {/* 메인 카드 (Reflective Card) */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative bg-gradient-to-br from-primary via-primary/50 to-primary p-1.5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)]  max-w-[340px] w-[88vw] aspect-[2/3] overflow-hidden transition-transform duration-200 ease-out z-30 cursor-pointer animate-gradient-bg"
            style={{
              transform:
                reflection.opacity > 0
                  ? `rotateX(${-(reflection.y - 50) / 10}deg) rotateY(${(reflection.x - 50) / 10}deg)`
                  : "rotateX(0deg) rotateY(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 반사 광택 효과 오버레이 */}
            <div
              className="pointer-events-none absolute inset-0 z-50 transition-opacity duration-300 rounded-[22px]"
              style={{
                opacity: reflection.opacity,
                background: `radial-gradient(circle 250px at ${reflection.x}% ${reflection.y}%, rgba(255,255,255,0.4), transparent 80%)`,
                mixBlendMode: "overlay",
              }}
            />

            {/* 카드 내부 컨텐츠 */}
            <div className="bg-white/10 backdrop-blur-md w-full h-full rounded-[20px] p-6 flex flex-col items-center relative z-10 border border-white/30 shadow-inner">
              {/* 로고 / 타이틀 */}
              <div className="w-full flex justify-between items-center mb-8">
                <span className="text-white font-black text-sm tracking-widest drop-shadow-md">
                  CAMA+
                </span>
              </div>

              {/* 프로필 이미지 (사원증 사진 역할) */}
              <div className="relative w-24 h-24 rounded-full border-[3px] border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center mb-4 overflow-hidden bg-white/30 backdrop-blur-sm">
                <img
                  src={HeadType5}
                  alt="Profile"
                  className="w-full h-full object-cover p-1 rounded-full"
                />
              </div>

              {/* 유저 정보 */}
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1 drop-shadow-md">
                {userName}
              </h2>
              <p className="text-white/80 text-xs font-medium mb-auto tracking-wide">
                ID: {data?.loginId || "MEMBER"}
              </p>

              {/* QR 코드 블록 */}
              <div className="mt-8 bg-white p-3 rounded-[1.2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative transition-transform hover:scale-105 duration-300">
                <QRCodeSVG
                  value={qrValue}
                  size={180}
                  level="H"
                  imageSettings={{
                    src: HeadType5,
                    height: 40,
                    width: 40,
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
