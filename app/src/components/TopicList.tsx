import { Topic } from '../sources';
import { useStackActions } from '../store';

export interface TopicListProps {
	list: Topic[];
}

export function TopicList(props: TopicListProps) {
	const { list } = props;
	const { push } = useStackActions();

	return (
		<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
			{list.map((topic) => {
				const { title, cover, categories, sourceId, id } = topic;
				const url = `/source/${sourceId}/${id}`;

				function onClick() {
					push('TopicView', {
						topicId: id,
					});
				}

				return (
					<li
						key={id}
						className="flex bg-dark-7 border border-black rounded"
					>
						<button
							onClick={onClick}
							style={{
								backgroundImage: `url(${cover})`,
							}}
							className="min-w-20 max-w-20 bg-no-repeat bg-cover min-h-30 max-h-30 overflow-hidden rounded"
						></button>
						<div className="flex flex-col justify-between px-3 py-2">
							<button className="text-left" onClick={onClick}>
								<h3 className="text-xl">{title}</h3>
							</button>
							<div className="">
								{categories.map((category, index) => {
									const { title, url } = category;
									return (
										<button
											key={index}
											className="inline-block rounded dark:bg-gray-6 bg-gray-2 text-xs px-1 py-0.5 mr-1 mb-1"
										>
											{title}
										</button>
									);
								})}
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
