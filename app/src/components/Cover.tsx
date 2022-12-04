import clsx from 'clsx';

interface CoverProps {
	children: React.ReactNode;
	className?: string;
	size?: 'normal';
}

export function CoverContainer(props: CoverProps) {
	const { children, size = 'normal', className } = props;
	return (
		<div
			className={clsx(
				'bg-no-repeat bg-cover relative min-h-30 max-h-30 overflow-hidden rounded',
				className,
				{
					'min-w-20 max-w-20 min-h-30 max-h-30': size === 'normal',
				},
			)}
		>
			{children}
		</div>
	);
}
