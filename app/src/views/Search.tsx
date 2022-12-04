import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../components/BackButton';
import { TopicList } from '../components/TopicList';
import { search, sourceList, sources, Sources } from '../sources';
import { useTopicActions } from '../store/topics';

export interface SearchProps {
	query: string;
}

interface BySourceProps {
	sourceId: Sources;
	query: string;
}
export function Search(props: SearchProps) {
	const { query } = props;

	return (
		<>
			<div>
				<BackButton />
			</div>

			{sourceList.map((sourceId) => {
				return (
					<BySource
						key={sourceId}
						sourceId={sourceId}
						query={query}
					/>
				);
			})}
		</>
	);
}

function BySource(props: BySourceProps) {
	const { sourceId, query } = props;
	const { add } = useTopicActions();

	const searchQuery = useQuery({
		queryKey: ['search', sourceId, query],
		queryFn: async () => {
			const result = await search(sourceId, query);

			result.map((s) => add(s));
			return result;
		},
	});

	if (searchQuery.isLoading) {
		return <div>loading...</div>;
	}
	if (searchQuery.isError) {
		return <div>error...</div>;
	}

	const { title } = sources[sourceId];

	return (
		<div className="mt-3 space-y-3">
			<h3 className="text-3xl border-b-1 dark:border-dark-1">
				{title}
			</h3>
			<TopicList list={searchQuery.data} />
		</div>
	);
}
