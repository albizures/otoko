import { useQuery } from '@tanstack/react-query';
import { Issue, Source } from '../bindings';
import { BackButton } from '../components/BackButton';
import { getIssueItems } from '../sources';
import { useIssueSource } from '../store/issues';

interface IssueListProps {
	issue: Issue;
}

export function IssueList(props: IssueListProps) {
	const { issue } = props;
	const source = useIssueSource(issue);

	const itemsQuery = useQuery({
		queryKey: ['issue.items', issue.url],
		queryFn: async () => {
			const result = await getIssueItems({ issue, source });

			return result;
		},
	});

	if (itemsQuery.isLoading) {
		return <div>loading...</div>;
	}

	if (itemsQuery.isError) {
		return <div>error...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto items-center mt-3">
			{itemsQuery.data.map((src) => {
				return <img className="w-full mt-3" src={src} />;
			})}
		</div>
	);
}

interface ReadIssueProps {
	issue: Issue;
}

export function ReadIssue(props: ReadIssueProps) {
	const { issue } = props;

	return (
		<>
			<div>
				<BackButton />
			</div>
			<IssueList issue={issue} />
		</>
	);
}
