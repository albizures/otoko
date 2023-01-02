import { Source } from '../bindings';
import { leerManga } from './leerManga';
import { onlineManga } from './onlineManga';

export const sourceHelpers = {
	[leerManga.url]: leerManga,
	[onlineManga.url]: onlineManga,
} as const;

export function getHelper(source: Source) {
	const helper = sourceHelpers[source.url];

	if (!helper) {
		throw new Error(`No helper found for "${source.title}" source`);
	}

	return helper;
}

export type SourceHelpers = keyof typeof sourceHelpers;
