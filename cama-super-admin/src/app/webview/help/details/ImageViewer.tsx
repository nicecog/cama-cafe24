// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import login1 from "./images/login.png";
import login2 from "./images/login2.png";

import detail2_1 from "./images/detail2_1.png";
import detail2_2 from "./images/detail2_2.png";
import detail2_3 from "./images/detail2_3.png";
import detail2_4 from "./images/detail2_4.png";
import detail2_5 from "./images/detail2_5.png";

import detail3_1 from "../details/images/detail3_1.png";
import detail3_2 from "../details/images/detail3_2.png";

import detail4_1 from "../details/images/detail4_1.png";
import detail4_2 from "../details/images/detail4_2.png";

import detail6_1 from "../details/images/detail6_1.png";
import detail6_2 from "../details/images/detail6_2.png";
import detail6_3 from "../details/images/detail6_3.png";
import detail6_4 from "../details/images/detail6_4.png";

import { useMemo } from "react";

export default function ImageViewer({ type }: { type: string }) {
  const slideList = useMemo(() => {
    const login = [login1, login2];
    const type2_1 = [detail2_1, detail2_2];
    const type2_2 = [detail2_3, detail2_4, detail2_5];
    const type3 = [detail3_1, detail3_2];
    const type4 = [detail4_1, detail4_2];
    const type6 = [detail6_1, detail6_2, detail6_3, detail6_4];

    switch (type) {
      case "login":
        return login;
      case "type2_1":
        return type2_1;
      case "type2_2":
        return type2_2;
      case "type3":
        return type3;
      case "type4":
        return type4;
      case "type6":
        return type6;
      default:
        return [];
    }
  }, [type]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full   ">
        {slideList.map((src, index) => (
          <img
            src={src}
            key={index}
            alt={`slide-${index}`}
            className={`max-w-[340px] ${index > 0 && "mt-5"} w-full`}
          />
        ))}
      </div>
      {/* <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        loop={true}
        modules={[Pagination]}
        className="mySwiper pb-10 max-w-[330px]"
      >
        {slideList.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`slide-${index}`} className="w-full" />
          </SwiperSlide>
        ))}
      </Swiper> */}
    </>
  );
}
