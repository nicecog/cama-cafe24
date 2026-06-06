import { Transition as Trans } from '@headlessui/react';
import { Fragment, useMemo } from 'react';

export type EffectType = {
	enter: string;
	enterFrom: string;
	enterTo: string;
	leave: string;
	leaveFrom: string;
	leaveTo: string;
};
// 모달 효과
const TransitionChild = ({ children, effect }: { children: React.ReactNode; effect: string }) => {
	// 효과 목록
	const _effect = useMemo(() => {
		const effects: Record<string, EffectType> = {
			scale: {
				enter: 'ease-out duration-300',
				enterFrom: 'opacity-0 scale-95',
				enterTo: 'opacity-100 scale-100',
				leave: 'ease-in duration-200',
				leaveFrom: 'opacity-100 scale-100',
				leaveTo: 'opacity-0 scale-95'
			},
			fadeInOut: {
				enter: 'ease-out duration-300',
				enterFrom: 'opacity-0',
				enterTo: 'opacity-100',
				leave: 'ease-in duration-200',
				leaveFrom: 'opacity-100',
				leaveTo: 'opacity-0'
			}
		};
		return effects[effect] || effects.fadeInOut;
	}, [effect]);
	return (
		<>
			<Trans.Child as={Fragment} {..._effect}>
				{children}
			</Trans.Child>
		</>
	);
};
export default TransitionChild;
