import create from 'zustand';
import { client } from '../query';
import { Topic } from '../bindings';
import { useSource } from './sources';

interface TopicStore {
	byId: Record<string, Topic>;
	list: number[];
	accessors: {
		map: <T>(mapper: Mapper<T, Topic>) => T[];
	};
	actions: {
		upsert: (topic: Topic) => void;
		add: (topic: Topic) => void;
	};
}

type Mapper<T, I> = (item: I, index: number) => T;

export const useTopicStore = create<TopicStore>((set, get) => ({
	byId: {},
	list: [],
	accessors: {
		get(id: number) {
			return get().byId[id];
		},
		map(mapper) {
			const { byId: topics, list } = get();
			return list.map((id, index) => {
				const topic = topics[id];
				return mapper(topic!, index);
			});
		},
	},
	actions: {
		async upsert(data) {
			const { byId: topics, list } = get();

			const topic = await client.mutation(['topic.upsert', data]);

			const current = topics[topic.id];
			if (current) {
				const didChange =
					current.cover !== topic.cover ||
					current.title !== topic.title ||
					current.description !== topic.description;
				if (didChange) {
					set({
						byId: {
							...topics,
							[topic.id]: topic,
						},
					});
				}
			} else {
				set({
					list: [...list, topic.id],
					byId: {
						...topics,
						[topic.id]: topic,
					},
				});
			}
		},
		async add(topic) {
			const { byId: topics, list } = get();

			if (list.includes(topic.id)) {
				return;
			}

			client.mutation(['topic.upsert', topic]);

			set({
				list: [...list, topic.id],
				byId: {
					...topics,
					[topic.id]: topic,
				},
			});
		},
	},
}));

export function useTopicActions() {
	return useTopicStore((s) => s.actions);
}

export function useTopics() {
	return useTopicStore((s) => s.byId);
}

export function useTopic(id: number) {
	const topic = useTopicStore((s) => s.byId[id]);

	if (!topic) {
		throw new Error(`Topic with a '${id}' not found`);
	}

	return topic;
}

export function useTopicSource(topic: Topic) {
	return useSource(topic.sourceId);
}
