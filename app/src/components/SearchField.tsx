import React from 'react';
import clsx from 'clsx';
import { IoMdCloseCircleOutline } from 'react-icons/io';

interface PropTypes {
	defaultValue?: string;
}

export function SearchField(props: PropTypes) {
	const { defaultValue } = props;
	const ref = React.useRef<HTMLInputElement>(null);
	const [isEmpty, setIsEmpty] = React.useState(true);

	function onInput(event: React.FormEvent<HTMLInputElement>) {
		setIsEmpty(event.currentTarget.value.trim() === '');
	}

	function onReset() {
		setIsEmpty(true);
		ref.current!.value = '';
	}

	return (
		<div className="relative">
			<label>
				<span className="sr-only">Search</span>
				<input
					type="text"
					name="query"
					ref={ref}
					defaultValue={defaultValue}
					onInput={onInput}
					className="py-1 px-2 rounded-md text-sm border border-gray-6 border-b-gray-5 focus:(border-gray outline-none)"
					placeholder="Search"
				/>
			</label>
			<button
				type="button"
				onClick={onReset}
				className={clsx(
					'absolute right-0 inset-y-0 pr-2 opacity-30',
					{
						hidden: isEmpty,
					},
				)}
			>
				<IoMdCloseCircleOutline />
			</button>
		</div>
	);
}
