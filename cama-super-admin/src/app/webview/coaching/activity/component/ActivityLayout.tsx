import useAlert from "@/hooks/useAlert";
import { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import image from "@/assets/images/character/mission.png";

export default function ActivityLayout(props: {
  children: ReactNode;
  title?: string;
  onNext?: string | null;
  onPrev?: () => void;
  isClass?: boolean;
}) {
  const { confirm } = useAlert();

  // Login Id
  const { loginId } = useParams();
  // Nav
  const navigate = useNavigate();
  // Back
  const onBack = () => {
    confirm("초기메뉴로 돌아갑니다.", () => {
      navigate(`../${loginId}`, { state: { reload: true } });
    });
  };

  const onClick = () => {
    confirm(
      {
        title: "진행하시겠습니까?",
        html: `평가를 다시 진행할 경우 <br/>운동이 변경될 수 있습니다.`,
        confirmButtonText: "평가시작",
      },
      () => {
        navigate(`../E/eval/${loginId}`);
      }
    );
  };

  return (
    <>
      <div className="flex flex-col h-dvh">
        <div className="fixed top-0 w-full bg-white z-10">
          <div className="bg-white h-[50px] flex justify-center items-center px-3 border-b">
            <button onClick={onBack} className="absolute top-3.5 left-2">
              <MdClose className="text-[#BBBBBB] font-extrabold text-[23px]" />
            </button>
            <span className="text-base font-medium text-text">
              {props.title}
            </span>
          </div>
        </div>
        {/* content */}
        <div
          className={`flex-grow bg-[#F9F9F9] mt-[50px]  pb-[10px] pt-2 w-full overflow-auto ${
            props.isClass && "mb-[60px] "
          }`}
        >
          <div className="px-[20px] py-5 h-full flex flex-col  ">
            {props.children}
          </div>
        </div>
        {/* Content End */}
        {props.isClass && (
          <div className="fixed bottom-0 w-full h-[60px] bg-white border-t left-0">
            <div className="flex justify-center items-center h-full w-full px-8">
              <button
                className={`text-camaColor text-f4 font-oneMobile border-2 border-camaColor w-[200px] py-2 rounded-lg flex justify-center items-end gap-1 `}
                onClick={onClick}
              >
                <img src={image} alt="btn" className="w-[27px]" />
                운동평가 다시하기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
