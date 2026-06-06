import { useNavigate } from "react-router-dom";
import advice from "@/assets/images/character/advice3.png";

import {
  FcCloseUpMode,
  FcLike,
  FcManager,
  FcSearch,
  FcSettings,
  FcSportsMode,
} from "react-icons/fc";

export default function HelpPage() {
  const navigate = useNavigate();

  const onDetail = (index: any) => () => {
    navigate(`./${index}`);
  };

  return (
    <>
      <div className="bg-[#d0e7d3] py-10 flex items-center justify-center gap-4  ">
        <img src={advice} className="h-28" />
        <div className="text-[17px]">
          <p className="text-camaColor1 text-2xl font-bold ">CAMA+</p>
          <p className="font-semibold ">이용에 도움이 필요하신가요?</p>
        </div>
      </div>
      <div className="max-w-md mx-auto p-5  h-full ">
        <div className="grid grid-cols-2  gap-4">
          {/* 메뉴1  */}
          <div
            className="group flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(1)}
          >
            <div className="font-notoR  font-semibold ">
              <p>회원가입 </p>
              <p>로그인 </p>
            </div>
            <div className="flex justify-end">
              <FcManager className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}

          {/* 메뉴1  */}
          <div
            className="group  flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(2)}
          >
            <div className="font-notoR  font-semibold  ">
              <p>건강 뉴스레터 </p>
              <p>설정방법 </p>
            </div>
            <div className="flex justify-end">
              <FcSettings className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}
          {/* 메뉴1  */}
          <div
            className="group  flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(3)}
          >
            <div className="font-notoR  font-semibold ">
              <p>건강 정보</p>
              <p>검색방법 </p>
            </div>
            <div className="flex justify-end">
              <FcSearch className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}
          {/* 메뉴1  */}
          <div
            className="group  flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(4)}
          >
            <div className="font-notoR  font-semibold ">
              <p>건강 정보콘텐츠 </p>
              <p>즐겨찾기 </p>
            </div>
            <div className="flex justify-end">
              <FcLike className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}
          {/* 메뉴1  */}
          <div
            className="group  flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(5)}
          >
            <div className="font-notoR  font-semibold ">
              <p>웰빙자원 </p>
              <p>안내 </p>
            </div>
            <div className="flex justify-end">
              <FcCloseUpMode className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}
          {/* 메뉴1  */}
          <div
            className="group  flex flex-col justify-between h-[134px] rounded-md shadow-lg bg-[#d0e7d3] bg-opacity-15  border-[#d0e7d3] border p-3.5 transition-transform duration-200 ease-in-out active:scale-105 will-change-transform"
            onClick={onDetail(6)}
          >
            <div className="font-notoR  font-semibold ">
              <p>건강코칭 </p>
              <p>사용법 </p>
            </div>
            <div className="flex justify-end">
              <FcSportsMode className="text-[34px]" />
            </div>
          </div>
          {/* 메뉴1  끝*/}
        </div>
      </div>
    </>
  );
}
