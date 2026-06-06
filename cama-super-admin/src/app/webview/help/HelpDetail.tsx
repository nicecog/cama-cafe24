import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import LoginDetail from "./details/Login";
import Detail2 from "./details/Detail2";
import Detail3 from "./details/Detail3";
import Detail4 from "./details/Detail4";
import Detail5 from "./details/Detail5";
import Detail6 from "./details/Detail6";
import { fontSizeAtom } from "./HelpAtom";
import { useAtom } from "jotai";
import { FaRegPlusSquare, FaRegMinusSquare } from "react-icons/fa";
// const helpMessages: { [key: string]: string } = {
//   "1": "회원가입 및 로그인 안내",
//   "2": "건강 뉴스레터 설정방법",
//   "3": "건강 정보 검색방법",
//   "4": "안녕하세요, 도움말 4번입니다.",
//   "5": "안녕하세요, 도움말 5번입니다.",
//   "6": "안녕하세요, 도움말 6번입니다.",
//   "7": "안녕하세요, 도움말 7번입니다.",
//   "8": "안녕하세요, 도움말 8번입니다.",
//   "9": "안녕하세요, 도움말 9번입니다.",
//   "10": "안녕하세요, 도움말 10번입니다.",
// };
export default function HelpDetail() {
  const { no } = useParams<{ no: string }>(); // no 파라미터를 string 타입으로 받아옴

  const [fontSize, setFSize] = useAtom(fontSizeAtom);

  const navigate = useNavigate();

  const onFontSizeChange = (check: "add" | "subtract") => () => {
    setFSize((prev) =>
      Math.min(22, Math.max(12, prev + (check === "add" ? 2 : -2)))
    );
  };

  const onBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div>
        <div className="fixed top-0 w-full bg-white z-10">
          <div className="bg-white h-[50px] flex justify-between items-center px-3 border-b">
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={onFontSizeChange("add")}
                className="p-1 rounded-md border-[#BFD8AF] border 
               transition-transform duration-150 transform 
               hover:scale-105 
               flex items-center gap-1 text-sm font-notoR font-semibold 
               text-[#3F5E3C]"
              >
                <FaRegPlusSquare className="text-[16px] text-[#3F5E3C]" />
                크게
              </button>

              <button
                onClick={onFontSizeChange("subtract")}
                className="p-1 rounded-md border-[#BFD8AF]   border
               transition-transform duration-150 transform 
               hover:scale-105 
               flex items-center gap-1 text-sm font-notoR font-semibold 
               text-[#3F5E3C]"
              >
                <FaRegMinusSquare className="text-[16px] text-[#3F5E3C]" />
                작게
              </button>
            </div>

            <button onClick={onBack} className="absolute top-3.5 right-2">
              <MdClose className="text-[#BBBBBB] font-extrabold text-[23px]" />
            </button>
            {/* <span className="text-base font-medium text-text">
              {no ? helpMessages[no] : "도움말"}
            </span> */}
          </div>
        </div>
        <div
          className={`  mt-[50px]   w-full overflow-auto `}
          style={{ fontSize: `${fontSize}px` }}
        >
          {
            {
              "1": <LoginDetail />,
              "2": <Detail2 />,
              "3": <Detail3 />,
              "4": <Detail4 />,
              "5": <Detail5 />,
              "6": <Detail6 />,
            }[no || "1"]
          }
        </div>
      </div>
    </>
  );
}
