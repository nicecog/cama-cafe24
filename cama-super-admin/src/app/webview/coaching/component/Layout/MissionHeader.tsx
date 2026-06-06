import Mission from "@/assets/images/character/mission.png";
import useFontSize from "@/hooks/useFontSize";

export default function MissionHeader() {
  const [sm, xl] = useFontSize([-4, 2]);

  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-white py-4  border-[#E8E8E8]  rounded-2xl border-[3px]">
        <img src={Mission} alt="mission" className="h-[60px]" />
        <div className="">
          <p
            className=" font-gmarket text-[#969696] tracking-[-0.28]  text-center"
            style={{ fontSize: sm }}
          >
            Today's Mission
          </p>
          <p
            className=" font-oneMobile -mt-1 text-center text-camaColorLight"
            style={{ fontSize: xl }}
          >
            오늘의 미션!
          </p>
        </div>
      </div>
    </>
  );
}
