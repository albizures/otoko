import create from 'zustand';
import type { Source } from '../bindings';

interface SourceStore {
	sources: Source[];
}

export const sourceStore = create<SourceStore>((set, get) => ({
	sources: [],
}));
