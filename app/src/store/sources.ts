import create from 'zustand';
import type { Source } from '../bindings';

interface SourceStore {
	sources: Source[];
	byUrl: Record<string, Source>;
	byId: Record<string, Source>;
	actions: {
		add: (sources: Source[]) => void;
	};
}

function addToRecord<T>(
	record: Record<string, T>,
	items: T[],
	mapper: (item: T) => [string | number, T],
) {
	return {
		...record,
		...Object.fromEntries(items.map(mapper)),
	};
}

export const useSourceStore = create<SourceStore>((set, get) => ({
	sources: [],
	byUrl: {},
	byId: {},
	actions: {
		add(newSources) {
			const { sources, byUrl, byId } = get();
			return set({
				sources: [...sources, ...newSources],
				byUrl: addToRecord(byUrl, newSources, (source) => [
					source.url,
					source,
				]),
				byId: addToRecord(byId, newSources, (source) => [
					source.id,
					source,
				]),
			});
		},
	},
}));

export function useSources() {
	return useSourceStore((s) => s.sources);
}

export function getStore(id: number) {}

export function useSource(id: number) {
	const source = useSourceStore((s) => s.byId[id]);

	if (!source) {
		throw new Error(`Source with a '${id}' not found`);
	}

	return source;
}

export function useSourcesActions() {
	return useSourceStore((s) => s.actions);
}
