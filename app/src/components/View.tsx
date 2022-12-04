interface ViewProps {
	children: React.ReactNode;
}

export function View(props: ViewProps) {
	const { children } = props;
	return (
		<div className="inset-0 absolute dark:bg-dark-5 p-5 overflow-y-auto">
			{children}
		</div>
	);
}
