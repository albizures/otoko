import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../components/BackButton';
import { getIssueItems, Issue } from '../sources';

interface IssueListProps {
	issue: Issue;
}

export function IssueList(props: IssueListProps) {
	const { issue } = props;
	const itemsQuery = useQuery({
		queryKey: ['issue.items', issue.url],
		queryFn: async () => {
			const result = await getIssueItems(issue);

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
