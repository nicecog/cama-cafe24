import ReactPlayer from "react-player";
import MentalButton from "../../component/MentalButton";
const url = "https://youtu.be/o42JtHKTcew?si=kZVQkI_monzCt58E";

export default function Breathing(props: { onComplete: () => void }) {
  return (
    <>
      <div className="w-full h-[300px] mt-5">
        <ReactPlayer url={url} width="100%" height="100%" controls={true} />
      </div>
      <MentalButton onClick={props.onComplete}>완료</MentalButton>
    </>
  );
}
