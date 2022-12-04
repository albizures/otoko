import { leerManga } from './leerManga';
import { onlineManga } from './onlineManga';

export const sources = {
	[leerManga.id]: leerManga,
	[onlineManga.id]: onlineManga,
} as const;

export type Sources = keyof typeof sources;

export const sourceList = Object.keys(
	sources,
) as unknown as Sources[];
