import { IoIosArrowBack } from 'react-icons/io';
import { useStackActions } from '../store';
interface BackButtonProps {}

export function BackButton(props: BackButtonProps) {
	const { pop } = useStackActions();

	function onBack() {
		pop();
	}

	return (
		<button
			onClick={onBack}
			className="uppercase font-bold dark:hover:bg-dark-3 rounded-md pr-2 py-0.5"
		>
			<IoIosArrowBack className="inline-block text-2xl align-top" />
			back
		</button>
	);
}
