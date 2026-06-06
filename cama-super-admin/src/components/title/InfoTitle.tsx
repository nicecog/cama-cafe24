import { FiChevronRight } from 'react-icons/fi';

export default function InfoTitle({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="flex font-bold text-[#3F80EA] text-sm tracking-[-0.5px] mb-1 items-center">
				<FiChevronRight className="bg-[#3F80EA] text-white mr-[5px] mt-[2px] text-xs" />
				{children}
			</div>
		</>
	);
}
