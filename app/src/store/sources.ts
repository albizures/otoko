import create from 'zustand';
import type { Source } from '../bindings';

interface SourceStore {
	list: Source[];
	byUrl: Record<string, Source>;
	byId: Record<string, Source>;
	helpers: {
		upsert: (sources: Source[]) => void;
	};
}

export const useSourceStore = create<SourceStore>((set, get) => ({
	list: [],
	byUrl: {},
	byId: {},
	helpers: {
		upsert(newSources) {
			const { list, byUrl, byId } = get();
			const newList = [...list];
			const newByUrl = { ...byUrl };
			const newById = { ...byId };

			newSources.forEach((source) => {
				const current = newById[source.id];
				if (current) {
					const update = {
						...current,
						...source,
					};
					const index = newList.indexOf(current);

					newList[index] = update;
					newById[source.id] = update;
					newByUrl[source.url] = update;
				} else {
					newList.push(source);
					newById[source.id] = source;
					newByUrl[source.url] = source;
				}
			});

			return set({
				list: newList,
				byUrl: newByUrl,
				byId: newById,
			});
		},
	},
}));

export function useSources() {
	return useSourceStore((s) => s.list);
}

export function getStore(id: number) {}

export function useSource(id: number) {
	const source = useSourceStore((s) => s.byId[id]);

	if (!source) {
		throw new Error(`Source with a '${id}' not found`);
	}

	return source;
}

export function useSourcesHelpers() {
	return useSourceStore((s) => s.helpers);
}
