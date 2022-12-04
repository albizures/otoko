import clsx from 'clsx';

interface FillImageProps {
	src: string;
	className?: string;
}

export function FillImage(props: FillImageProps) {
	const { src, className } = props;
	const style = {
		backgroundImage: `url(${src})`,
	};

	return (
		<span
			style={style}
			className={clsx(
				className,
				'inline-block bg-no-repeat bg-cover',
			)}
		></span>
	);
}
