import Infomation from "@/assets/images/character/infomation.png";
import useFontSize from "@/hooks/useFontSize";

export default function InfomationHeader() {
  const [sm, xl] = useFontSize([-2, 2]);

  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-white py-4 border-[#E8E8E8]  rounded-2xl border-[3px]">
        <img src={Infomation} alt="mission" className="h-[60px]" />
        <div className=" ">
          <p
            className=" font-gmarket text-[#969696] text-center"
            style={{ fontSize: sm }}
          >
            Health Tips
          </p>
          <p
            className=" font-oneMobile -mt-1 text-center text-camaColorLight"
            style={{ fontSize: xl }}
          >
            함께 알아볼까요?
          </p>
        </div>
      </div>
    </>
  );
}
