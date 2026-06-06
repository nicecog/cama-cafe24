import missionChallenge from "@/assets/images/character/missionChallenge.png";

export default function MissionChallengeButton(props: {
  onClick: () => void;
  className?: string;
}) {
  const { onClick, className } = props;
  return (
    <div className={`flex justify-center  items-center ${className}`}>
      <button
        className="border-camaColor1 border-[3px] px-[35px] py-[16px] flex rounded-xl items-center gap-3  bg-camaColor1 "
        onClick={onClick}
      >
        <img src={missionChallenge} alt="clear" className="w-[70px]" />
        <div className="font-oneMobile text-[30px] text-white leading-[32px] flex justify-start flex-col items-start">
          <span>미션</span>
          <span>도전!</span>
        </div>
      </button>
    </div>
  );
}
