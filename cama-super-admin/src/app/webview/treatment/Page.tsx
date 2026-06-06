import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import QuillEditer from "@/components/edit/QuillEditer";
import axios from "@/utils/axios";
import useAlert from "@/hooks/useAlert";

const SKIN_GUIDE_SEQ = 906;
const SKIN_GUIDE_URL = "https://huditcntweb.gabia.io/";

const extractTitleAndHashtags = (text: string) => {
	const hashtags = text.match(/#[\w가-힣]+/g) || [];
	const title = text
		.replace(/#[\w가-힣]+/g, "")
		.trim()
		.replace(/[?.]$/, "");
	return { title, hashtags: hashtags.map((tag) => tag.slice(1)) };
};

export default function PatientMonitoring() {
	const navigate = useNavigate();
	const { seq } = useParams<{ seq: string }>();

	const { alert } = useAlert();

	const [fontSize, setFontSize] = useState(18);

	const [state, setState] = useState<any>({
		content: "",
		interest: [],
		careTimeList: [],
		createdAt: "",
		departmentName: "",
		title: "",
		doctorName: "",
	});

	const isSkinGuide = seq !== undefined && Number(seq) === SKIN_GUIDE_SEQ;

	useEffect(() => {
		if (seq === undefined || isNaN(Number(seq))) {
			alert("잘못된 접근입니다.");
			navigate(-1);
			return;
		}

		if (Number(seq) === SKIN_GUIDE_SEQ) {
			return;
		}

		axios.get(`/api/contents/${seq}/webview`).then(({ data }) => {
			const careTimes = JSON.parse(data.response?.disease || "{}");

			setState({
				content: data.response.contents,
				interest: JSON.parse(data.response.interest || "[]") as string[],
				careTimeList:
					careTimes.diseaseTreatment === undefined
						? []
						: careTimes.diseaseTreatment.map((d: any) => d.name),
				createdAt: data.response.createdAt,
				departmentName: data.response.departmentName,
				title: data.response.title,
				doctorName: data.response.doctorName,
			});
		});
	}, []);

	const changeSize = (size: string) => () => {
		setFontSize((currentSize) => {
			if (size === "plus") {
				return Math.min(currentSize + 2, 26); // 최대값 20으로 제한
			} else {
				return Math.max(currentSize - 2, 14); // 최소값 16으로 제한
			}
		});
	};

	// 제목에서 해시태그 추출
	const { title, hashtags } = extractTitleAndHashtags(state.title);

	if (isSkinGuide) {
		return (
			<div className="min-h-dvh bg-black">
				<iframe
					title="Skin Guide"
					src={SKIN_GUIDE_URL}
					className="h-dvh w-full border-0 bg-white"
					allow="clipboard-read; clipboard-write"
				/>
			</div>
		);
	}

	return (
		<>
			<div className="h-full bg-[#F9F9F9] flex">
				<div className="fixed w-full bg-[#F9F9F9] z-50">
					{/* <div className="w-full h-[50px] flex items-center justify-center text-[#444444] text-[16px] border-[#00000029] border-b">
            건강한 식생활과 운동
          </div> */}
					<div className="w-full h-[56px] flex items-center justify-between text-[#444444] text-[16px] border-[#00000029] border-b shadow-md px-[20px]">
						<div className="text-[#777777] text-[14px]">
							글자크기를 조절하세요
						</div>
						<div className="flex gap-4 text-[14px] font-bold text-[#774F2D]">
							<button
								className=" flex  items-center justify-center gap-1"
								onClick={changeSize("minus")}
							>
								작게
								<FiMinusCircle className="text-[19px] " />
							</button>
							<button
								className=" flex  items-center justify-center gap-1"
								onClick={changeSize("plus")}
							>
								크게
								<FiPlusCircle className="text-[19px] " />
							</button>
						</div>
					</div>
				</div>
				{/* Header 끝  */}
				<div className="h-full mt-[56px] flex-grow ">
					{/* Title */}
					<div className="h-[160px] p-[20px] font-bold flex flex-col justify-center bg-white">
						<h1 className={`text-[${fontSize}px] text-[#774F2D]`}>{title}</h1>
						<div className="mt-2">
							{hashtags.map((tag, index) => (
								<span
									key={index}
									className={`text-[#FE8825] text-[${fontSize - 4}px]  mr-3 `}
								>
									#{tag}
								</span>
							))}
						</div>
					</div>
					{/* Title 끝  */}
					<div
						className={`w-full h-[30px] flex justify-between items-center px-[20px]
            text-[#777777]
            font-bold
              text-[${fontSize - 4}px]
            `}
					>
						{/* <p className="">
              <span>{state.doctorName}</span>
              <span className="pl-2  text-gray-400">
                {state.departmentName}
              </span>
            </p>
            <p>{state.createdAt}</p> */}
					</div>

					{/* 에디터 부분  */}
					<div className={`bg-white`}>
						<QuillEditer
							value={state.content}
							readOnly
							className={` ${
								{
									14: "xs",
									16: "sm",
									18: "md",
									20: "lg",
									22: "xl",
									24: "xxl",
									26: "xxxl",
									28: "xxxxl",
								}[fontSize]
							} `}
						/>
					</div>
					<div className={`p-[20px] text-[${fontSize - 4}px] text-[#777777]`}>
						* 본 정보는 질환의 진단과 치료과정에 대한 일반적인 가이드만을
						제공합니다. <br />
						정보의 적용,진단과 치료에 대한 모든 결정은 담당 의료진과 직접
						상의하시기 바랍니다.
					</div>
					<div
						className={`p-[20px] pb-[80px] text-[${fontSize - 2}px] bg-white`}
					>
						<div className="flex justify-start items-center">
							<div className="text-[#444444] w-[90px] px-5 font-bold">시기</div>
							<div className="text-[#774F2D] font-bold w-full">
								{state.careTimeList.join("/")}
							</div>
						</div>
						<div className="flex justify-start items-center mt-3">
							<div className="text-[#444444] w-[90px] px-5 font-bold">영역</div>
							<div className="text-[#774F2D] font-bold w-full">
								{state.interest.join("/")}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
