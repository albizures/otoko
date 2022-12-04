import create from 'zustand';
import { Topic } from '../sources';

interface TopicStore {
	topics: Partial<Record<string, Topic>>;
	list: string[];
	accessors: {
		map: <T>(mapper: Mapper<T, Topic>) => T[];
	};
	actions: {
		add: (topic: Topic) => void;
	};
}

type Mapper<T, I> = (item: I, index: number) => T;
export const useTopicStore = create<TopicStore>((set, get) => ({
	topics: {},
	list: [],
	accessors: {
		get(id: string) {
			return get().topics[id];
		},
		map(mapper) {
			const { topics, list } = get();
			return list.map((id, index) => {
				const topic = topics[id];
				return mapper(topic!, index);
			});
		},
	},
	actions: {
		add(topic) {
			const { topics, list } = get();

			if (list.includes(topic.id)) {
				return;
			}

			set({
				list: [...list, topic.id],
				topics: {
					...topics,
					[topic.id]: topic,
				},
			});
		},
	},
}));

export const useTopicActions = () => useTopicStore((s) => s.actions);
export const useTopics = () => useTopicStore((s) => s.topics);
