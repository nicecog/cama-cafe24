import {
  FaRegUserCircle as UserIcon,
  FaPowerOff as LogoutIcon,
  FaSearch,
} from "react-icons/fa";
import { DiAndroid, DiChrome } from "react-icons/di";
import { Tab } from "@headlessui/react";
import CustomSlideShow from "./Carousel";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const slides = [
  {
    title: "기초생활보장",
    date: "2021년 4월 기준",
    data: [
      { label: "수급자수", value: "2,237,896" },
      { label: "수급자수", value: "2,237,896" },
      { label: "수급자수", value: "2,237,896" },
    ],
  },
  {
    title: "노인복지",
    date: "2022년 1월 기준",
    data: [
      { label: "수혜자수", value: "3,456,789" },
      { label: "예산", value: "5,000,000,000" },
      { label: "시설수", value: "1,234" },
    ],
  },
  // 추가 슬라이드...
];
export default function Intro() {
  return (
    <>
      <div className="min-h-screen max-h-screen  h-screen  min-w-[1200px] ">
        <header className="fixed top-0 w-full min-w-[1200px] flex justify-between px-20 h-[63px] shadow-lg items-center text-sm  bg-white">
          <h1 className="text-[22px] text-[#1973b2] font-bold">
            복지정보통계시스템
          </h1>
          {/* 메뉴 영역 */}
          <div className="flex items-center justify-center gap-16 text-[#999]">
            <div className="flex items-center gap-2">
              <div>
                <UserIcon />
              </div>
              <span className="text-[#315c93]">사회보장정보원</span> 님
              환영합니다.
            </div>
            <div className="flex item-center gap-5">
              <button className="flex flex-col items-center gap-1 hover:font-bold hover:text-[#000]">
                <LogoutIcon />
                로그아웃
              </button>
              <button className="flex flex-col items-center gap-1 hover:font-bold hover:text-[#000]">
                <LogoutIcon />
                부서처리건수
              </button>
              <button className="flex flex-col items-center gap-1 hover:font-bold hover:text-[#000]">
                <LogoutIcon />
                외부요청통계
              </button>
              <button className="flex flex-col items-center gap-1 hover:font-bold hover:text-[#000]">
                <LogoutIcon />
                시스템관리
              </button>
            </div>
          </div>
        </header>

        <section className="mt-[63px]    min-w-[1200px]  overflow-auto bg-red-100 ">
          {/* Content 1  */}
          <div className="flex  justify-center bg-[#597bab] py-[60px] gap-5">
            {/* 좌측 영역 */}
            <div className="w-2/5  flex flex-col">
              <h1 className="h-[60px] ">로고</h1>
              <h2 className="text-[40px]  font-bold text-white">
                복지정보통계시스템
              </h2>
              <div className="text-gray-300 mt-[10px] text-[16px] font-semibold">
                보건복지부에서 서비스하는 복지정보통계시스템입니다. <br />
                정형.비정형 보고서 등 정보를 확인하세요.
              </div>
              <div className="h-[300px] mt-16 border bg-[#6a88b4] p-5">
                <Tab.Group>
                  <Tab.List className="w-full border-b border-white mb-1 text-white">
                    {["보고서 즐겨찾기", "업무통계"].map((r, idx, arr) => (
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            " px-10 py-0 text-[16px] mb-2 border-white",
                            arr.length === idx + 1 ? "" : "border-r-2",
                            selected ? "text-yellow-300" : ""
                          )
                        }
                      >
                        {r}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="w-full py-2 text-sm text-white  ">
                        <ul className="flex flex-col gap-4">
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            DW 20.11월 기준 통계제공
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            DW 20.11월 기준 통계제공
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            DW 20.11월 기준 통계제공
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            DW 20.11월 기준 통계제공
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            DW 20.11월 기준 통계제공
                          </li>
                        </ul>
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div className="w-full py-2 text-sm text-white  ">
                        <ul className="flex flex-col gap-4">
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            업무통계123123
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            업무통계123123
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            업무통계123123
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            업무통계123123
                          </li>
                          <li className="hover:text-yellow-300 cursor-pointer hover:underline">
                            업무통계123123
                          </li>
                        </ul>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>

            {/* 우측 영역 */}
            <div className="w-2/5  flex flex-col   pt-[60px]">
              {/* 검색어입력 */}
              <div className="flex items-center">
                <input
                  placeholder="검색어를 입력해 주세요."
                  type="text"
                  className="text-[#1973b2] px-[20px] py-[15px] rounded-ss-full rounded-es-full font-bold w-full focus:outline-0"
                />
                <button
                  className="bg-white  px-[20px] h-[54px] rounded-se-full rounded-ee-full"
                  onClick={() => {
                    alert("검색!");
                  }}
                >
                  <FaSearch className="text-xl text-gray-600" />
                </button>
              </div>
              <div className="p-5 ">
                <ul className="flex gap-5 text-white text-sm w-full justify-center">
                  <li className="border rounded-xl py-0.5 px-4">검색어 예시</li>
                  <li className="py-0.5 px-4 cursor-pointer hover:font-bold">
                    복지
                  </li>
                  <li className="py-0.5 px-4 cursor-pointer hover:font-bold">
                    기초연금
                  </li>
                  <li className="py-0.5 px-4 cursor-pointer hover:font-bold">
                    정형보고서
                  </li>
                  <li className="py-0.5 px-4 cursor-pointer hover:font-bold">
                    비정형보고서
                  </li>
                </ul>
              </div>

              <div className="h-[300px]  mt-[60px] text-white text-center flex flex-col items-center ">
                <CustomSlideShow slides={slides} />
                {/* <div>
                  <div className="flex flex-col w-[200px] justify-center">
                    <div className="flex justify-center items-center text-white ">
                      <motion.div
                        className="relative cursor-pointer"
                        whileHover="hover"
                        initial="initial"
                      >
                        <span className="text-[30px] font-semibold hover:text-yellow-300 ">
                          기초생활보장
                        </span>
                        <motion.div
                          className="absolute bottom-0 left-1/2 h-[2px] bg-yellow-300"
                          variants={{
                            initial: { width: 0, x: "-50%" },
                            hover: { width: "100%", x: "-50%" },
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>
                    <div className="border-t border-b text-center py-1 text-sm text-gray-400 mt-5 ">
                      2021 년 4월 기준
                    </div>
                  </div>
                  <div className="flex items-center w-full mt-14 text-[28px]">
                    <div className="w-full border-r border-dashed p-2">
                      <p className="text-[18px]">수급자수</p>
                      <p className="font-semibold">2,237,896</p>
                    </div>
                    <div className="w-full border-r border-dashed p-2">
                      <p className="text-[18px]">수급자수</p>
                      <p className="font-semibold">2,237,896</p>
                    </div>
                    <div className="w-full border-r border-dashed p-2">
                      <p className="text-[18px]">수급자수</p>
                      <p className="font-semibold">2,237,896</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="w-full py-[50px] bg-white">
            <h1 className="text-center text-[24px] font-bold">
              자주찾는 서비스
            </h1>
            <div className="flex gap-5 items-center justify-center my-10">
              {Array.from({ length: 10 }).map((_) => (
                <button className="flex items-center flex-col gap-1.5">
                  <div className="rounded-full border  p-5 bg-[#f6f7fc] text-[#8e8f92] hover:bg-[#6183b3] hover:text-white border-[#8e8f92] hover:border-[#597bab]">
                    <DiAndroid className="text-[50px] " />
                  </div>
                  <p className="text-sm">결혼중개업</p>
                </button>
              ))}
            </div>
            <div className="flex gap-5 items-center justify-center  my-10">
              {Array.from({ length: 10 }).map((_) => (
                <button className="flex items-center flex-col gap-1.5">
                  <div className="rounded-full border  p-5 bg-[#f6f7fc] text-[#8e8f92] hover:bg-[#6183b3] hover:text-white border-[#8e8f92] hover:border-[#597bab]">
                    <DiAndroid className="text-[50px] " />
                  </div>
                  <p className="text-sm">결혼중개업</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button className="border bg-[#f6f7fc] text-[#8e8f92] px-7 py-2 text-xs hover:font-semibold">
                전체보기
              </button>
            </div>
          </div>
          {/* 정보마당 영역 */}
          <div className="py-20 flex justify-center bg-[#eaedef]">
            <div className="w-[1200px]  ">
              <h1 className="text-[24px] text-black mb-5 font-bold">
                정보마당
              </h1>
              <div className="flex h-[220px] gap-4">
                <div className="w-3/5 h-full  ">
                  <Tab.Group>
                    <Tab.List className="w-full">
                      {[
                        "공지사항",
                        "FAQ",
                        "Q&A",
                        "온라인설문조사",
                        "온라인간행물",
                      ].map((r, idx, arr) => (
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              "bg-white border border-black  px-9 py-2 text-[13px]",
                              arr.length === idx + 1 ? "" : "border-r-0",
                              selected
                                ? "bg-[#eaedef] border-b-0"
                                : "border-gray-400"
                            )
                          }
                        >
                          {r}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels>
                      <Tab.Panel>
                        <div className="w-full py-2 text-sm">
                          <ul className="flex flex-col gap-2">
                            <li>DW 20.11월 기준 통계제공</li>
                            <li>DW 20.11월 기준 통계제공</li>
                            <li>DW 20.11월 기준 통계제공</li>
                            <li>DW 20.11월 기준 통계제공</li>
                            <li>DW 20.11월 기준 통계제공</li>
                          </ul>
                        </div>
                      </Tab.Panel>

                      <Tab.Panel>
                        <ul>
                          <li>우수사례 공모전 사용자 평가 안내</li>
                          <li>우수사례 공모전 사용자 평가 안내</li>
                          <li>우수사례 공모전 사용자 평가 안내</li>
                          <li>우수사례 공모전 사용자 평가 안내</li>
                          <li>우수사례 공모전 사용자 평가 안내</li>
                        </ul>
                      </Tab.Panel>

                      <Tab.Panel>
                        <ul>
                          <li>DW 20.10월 기준 통계 제공</li>
                          <li>DW 20.10월 기준 통계 제공</li>
                          <li>DW 20.10월 기준 통계 제공</li>
                          <li>DW 20.10월 기준 통계 제공</li>
                          <li>DW 20.10월 기준 통계 제공</li>
                        </ul>
                      </Tab.Panel>
                      <Tab.Panel>
                        <ul>
                          <li>시스템 접속 일시 중단 안내</li>
                          <li>시스템 접속 일시 중단 안내</li>
                          <li>시스템 접속 일시 중단 안내</li>
                          <li>시스템 접속 일시 중단 안내</li>
                          <li>시스템 접속 일시 중단 안내</li>
                        </ul>
                      </Tab.Panel>
                      <Tab.Panel>
                        <ul>
                          <li>통계 활용 우수 사례 공모전 안내</li>
                          <li>통계 활용 우수 사례 공모전 안내</li>
                          <li>통계 활용 우수 사례 공모전 안내</li>
                          <li>통계 활용 우수 사례 공모전 안내</li>
                          <li>통계 활용 우수 사례 공모전 안내</li>
                        </ul>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
                <div className="w-1/5 text-white flex flex-col">
                  <div className="bg-[#174075]  p-4">
                    <p className="text-white text-[20px] text-center">
                      온라인 <span className="text-[#7cc8ff]">메뉴얼</span>
                    </p>
                    <p className="text-[#9fb0c6] text-[11px] text-center pt-2 pb-3 border-b border-[#9fb0c6]">
                      복지정보통계시스템 메뉴얼 입니다.{" "}
                    </p>
                    <p className="text-xs text-center mt-3">메뉴얼 보기 ---</p>
                  </div>
                  <div className="flex flex-grow ">
                    <div className="flex flex-col justify-center items-center w-full bg-[#1793d2] ">
                      <DiChrome className="text-[40px]" />
                      GIS 정보
                    </div>
                    <div className="flex flex-col justify-center items-center w-full bg-[#275da9] ">
                      <DiChrome className="text-[40px]" />
                      시각화
                    </div>
                  </div>
                </div>
                <div className="w-1/5  bg-[#ffaa] h-full">복지서비스</div>
              </div>
            </div>
          </div>
        </section>

        <footer className=" w-full h-[95px] bg-[#242220] text-white flex items-center justify-center gap-2 text-[12px] text-opacity-50">
          <div>logo</div>
          <div className="">
            <p>
              04554) 서울 중구 퇴계로 173 (충무로3가) 남산스퀘어빌딩21층 |
              대표전화 02-6360-6114 / 팩스 02-6360-6360 / 당직 02-6360-6100
            </p>
            <p>Copyright ⓒ By SSiS, All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
