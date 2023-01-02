import { BiErrorAlt } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../components/BackButton';
import { CoverContainer } from '../components/Cover';
import { FillImage } from '../components/FillImage';
import { getIssueCover, getIssues } from '../sources';
import { useTopics, useTopicSource } from '../store/topics';
import { useStackActions } from '../store';
import { Issue, Source, Topic } from '../bindings';
import { useIssueSource } from '../store/issues';

interface IssueItemProps {
	issue: Issue;
}

export function IssueItem(props: IssueItemProps) {
	const { issue } = props;
	const { id, title, url } = issue;
	const source = useIssueSource(issue);
	const { push } = useStackActions();

	const coverQuery = useQuery({
		queryKey: ['issues', url],
		queryFn: async () => {
			const result = await getIssueCover({ issue, source });
			return result;
		},
	});

	if (coverQuery.isLoading) {
		return <div>loading...</div>;
	}

	if (coverQuery.isError) {
		return (
			<div className="flex border flex-col items-center">
				<div className="flex-1 flex justify-center items-center">
					<BiErrorAlt className="inline-block text-3xl" />
				</div>
				<div className="border-t w-full text-center">Not found</div>
			</div>
		);
	}

	function onRead() {
		push('ReadIssue', { issue });
	}

	return (
		<button
			onClick={onRead}
			className="flex border flex-col items-center"
		>
			<CoverContainer className="bg-red">
				<FillImage
					className="absolute inset-0"
					src={coverQuery.data}
				/>
			</CoverContainer>
			<div className="border-t w-full text-center">{title || id}</div>
		</button>
	);
}

interface IssueListProps {
	topic: Topic;
}

function IssueList(props: IssueListProps) {
	const { topic } = props;
	const source = useTopicSource(topic);

	const issuesQuery = useQuery({
		queryKey: ['issues', topic, source],
		queryFn: async () => {
			const result = await getIssues({
				topic,
				source,
			});

			return result;
		},
		enabled: Boolean(topic),
	});

	if (issuesQuery.isLoading) {
		return <div>loading...</div>;
	}
	if (issuesQuery.isError) {
		return <div>error...</div>;
	}

	return (
		<div className="grid grid-cols-8 gap-4">
			{issuesQuery.data.map((issue, index) => {
				return <IssueItem issue={issue} key={issue.id} />;
			})}
		</div>
	);
}

interface TopicProps {
	topic: Topic;
}

export function TopicView(props: TopicProps) {
	const topics = useTopics();
	const { topic } = props;

	if (!topic) {
		return 'Not Found...';
	}

	const {
		// categories
	} = topic;

	return (
		<>
			<div>
				<BackButton />
			</div>
			<div className="max-w-4xl mx-auto flex space-x-4 mt-3">
				<div>
					<FillImage src={topic.cover} className="w-40 h-60" />
				</div>
				<div className="flex flex-col justify-between">
					<div>
						<h1 className="text-4xl font-bold">{topic.title}</h1>
						<p className="mt-2">{topic.description}</p>
					</div>
					{/* <div className="mt-4">
						{categories.map((category, index) => {
							const { title, url } = category;
							return (
								<button
									key={index}
									className="inline-block rounded dark:bg-gray-6 bg-gray-2 px-2 py-0.5 mr-2 mb-1"
								>
									{title}
								</button>
							);
						})}
					</div> */}
				</div>
			</div>
			<div className="max-w-4xl mx-auto mt-6">
				<IssueList topic={topic} />
			</div>
		</>
	);
}
