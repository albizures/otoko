import { Issue } from '../bindings';
import { useSource } from './sources';
import { useTopic } from './topics';

export function useIssueSource(issue: Issue) {
	const topic = useTopic(issue.topicId);
	return useSource(topic.sourceId);
}
