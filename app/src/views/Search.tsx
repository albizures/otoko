import { useQuery } from '@tanstack/react-query';
import { Source } from '../bindings';
import { BackButton } from '../components/BackButton';
import { TopicList } from '../components/TopicList';
import { rspc } from '../query';
import { search, sourceHelpers, SourceHelpers } from '../sources';
import { useSources } from '../store/sources';
import { useTopicActions } from '../store/topics';

export interface SearchProps {
	query: string;
}

export function Search(props: SearchProps) {
	const { query } = props;
	const sourceList = useSources();

	return (
		<>
			<div>
				<BackButton />
			</div>

			{sourceList.map((source) => {
				const { id } = source;
				return <BySource key={id} source={source} query={query} />;
			})}
		</>
	);
}

interface BySourceProps {
	source: Source;
	query: string;
}

function BySource(props: BySourceProps) {
	const { source, query } = props;
	const { upsert: upsertTopic } = useTopicActions();

	const searchQuery = useQuery({
		queryKey: ['search', source, query],
		queryFn: async () => {
			const result = await search(source, query);

			result.map((s) => upsertTopic(s));

			return result;
		},
	});

	if (searchQuery.isLoading) {
		return <div>loading...</div>;
	}
	if (searchQuery.isError) {
		return <div>error...</div>;
	}

	const { title } = source;

	return (
		<div className="mt-3 space-y-3">
			<h3 className="text-3xl border-b-1 dark:border-dark-1">
				{title}
			</h3>
			<TopicList list={searchQuery.data} />
		</div>
	);
}
