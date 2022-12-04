import { to } from '@await-to/core';

import { Issue, Source, Topic } from './types';

import { createKey, getItem, setItem } from '../localStorage';
import { sourceList, sources, Sources } from './sources';
import { getHTML } from './utilts';

export * from './types';
export * from './sources';

export async function searchInSources(query: string) {
	return Promise.all(
		sourceList.map(async (sourceId) => {
			const result = await search(sourceId, query);

			return {
				sourceId,
				result,
			};
		}),
	);
}

export async function search(
	sourceId: Sources,
	rawQuery: string,
): Promise<Topic[]> {
	const query = rawQuery.toLowerCase();
	const source = sources[sourceId];
	const url = source.searchUrl(query);

	const searchKey = createKey('search', source, query);

	const savedSearch = getItem<Topic[]>(searchKey);

	if (savedSearch) {
		return savedSearch;
	}

	console.info('Searching at:', url);

	const result = await to(getHTML(url));

	if (!result.ok) {
		console.error(`Error getting the html searching for ${query}`);
		throw result.error;
	}

	const search = await source.resultsFromSearch(result.data);

	setItem(searchKey, search);

	return search;
}

interface GetIssuesArgs {
	topic: Topic;
	source: Source;
}

export async function getIssues(args: GetIssuesArgs) {
	const { topic, source } = args;

	const result = await to(getHTML(topic.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the issues of ${topic.title}`,
		);
		throw result.error;
	}

	return source.extractIssues(result.data, topic);
}

export async function getIssueCover(issue: Issue) {
	const result = await to(getHTML(issue.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the cover of ${issue.title}`,
		);
		throw result.error;
	}

	const source = sources[issue.sourceId];

	return source.extractIssueCover(result.data);
}

export async function getIssueItems(issue: Issue) {
	const result = await to(getHTML(issue.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the items of ${issue.title}`,
		);
		throw result.error;
	}

	const source = sources[issue.sourceId];

	return source.extractIssueItems(result.data);
}
