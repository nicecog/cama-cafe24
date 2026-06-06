import advice from "@/assets/images/character/advice2.png";
import header from "@/assets/images/character/char4.png";
import { FcApproval, FcIdea, FcManager } from "react-icons/fc";
import { useAtomValue } from "jotai";
import { text2XlAtom, textLgAtom } from "../HelpAtom";

import ImageViewer from "./ImageViewer";
export default function LoginDetail() {
	const textLg = useAtomValue(textLgAtom);
	const text2Lg = useAtomValue(text2XlAtom);

	return (
		<>
			<div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
				<p
					className="flex items-center  font-semibold gap-2 mb-2"
					style={{ fontSize: `${textLg}` }}
				>
					<FcManager style={{ fontSize: `${text2Lg}` }} />
					회원가입 및 로그인 안내
				</p>
				<img src={advice} className="w-20 mb-2" alt="" />
			</div>

			<div className=" px-5  py-2">
				<div className="py-5">
					<p className="text-center">
						<span className="text-camaColor1 font-semibold">CAMA+ </span>는
						간편한 본인인증만으로
					</p>
					<p className="text-center">회원가입과 로그인이 동시에 완료됩니다.</p>
				</div>
				<div className="mt-2 ">
					<ImageViewer type="login" />
				</div>
				<div className="mt-5">
					<p className="flex items-center gap-1">
						<FcApproval style={{ fontSize: `${text2Lg}` }} />
						가입방법
					</p>
					<div className="flex flex-col gap-1 mt-4">
						<p>
							1. 앱 실행후 <span className=" text-camaColor1 ">[로그인]</span>{" "}
							버튼을 눌러주세요.
						</p>
						<p>
							2. 현재 사용중인{" "}
							<span className=" text-camaColor1 ">이동통신사</span> 를 선택해
							주세요.
						</p>
						<p>3. 인증방식 선택</p>
						<p>
							<span className=" text-camaColor1 ">
								- PASS 앱 인증 또는 문자메시지(SMS)인증{" "}
							</span>
						</p>
						<p>원하는 방식을 선택해 본인 인증을 진행합니다.</p>
						<p className="flex items-center mt-5 font-semibold gap-1">
							<FcIdea
								className=" inline-block -mt-1"
								style={{ fontSize: `${text2Lg}` }}
							/>
							인증 완료 시 자동 로그인 및 회원가입 완료!
						</p>
					</div>
				</div>
			</div>

			<div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-center mt-3  bg-opacity-55 ">
				<img src={header} className="w-[90px] mb-2" alt="" />

				<p className="leading-relaxed font-semibold text-center">
					별도의 가입 절차 없이 인증만으로{" "}
				</p>
				<p className="leading-relaxed font-semibold text-center">
					<span className="text-camaColor1 font-semibold">CAMA+</span> 사용을
					시작할 수 있어요.
				</p>
			</div>
		</>
	);
}
