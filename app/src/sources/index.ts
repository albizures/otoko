import { to } from '@await-to/core';

import { Issue, Source, Topic } from '../bindings';
import { SourceHelper } from './types';

import { createKey, getItem, setItem } from '../localStorage';
import { sourceHelpers, SourceHelpers, getHelper } from './sources';
import { getHTML } from './utilts';

export * from './types';
export * from './sources';

interface SearchInSourcesArgs {
	sourceList: Source[];
	query: string;
}

export async function searchInSources(args: SearchInSourcesArgs) {
	const { sourceList, query } = args;
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
	source: Source,
	rawQuery: string,
): Promise<Topic[]> {
	const query = rawQuery.toLowerCase();
	const helper = getHelper(source);
	const url = helper.searchUrl(query);

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

	const search = await helper.resultsFromSearch(source, result.data);

	setItem(searchKey, search);

	return search;
}

interface GetIssuesArgs {
	topic: Topic;
	source: Source;
}

export async function getIssues(args: GetIssuesArgs) {
	const { topic, source } = args;

	const helper = getHelper(source);

	const result = await to(getHTML(topic.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the issues of ${topic.title}`,
		);
		throw result.error;
	}

	return helper.extractIssues(result.data, topic);
}

interface GetIssueCoverArgs {
	source: Source;
	issue: Issue;
}

export async function getIssueCover(args: GetIssueCoverArgs) {
	const { issue, source } = args;
	const result = await to(getHTML(issue.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the cover of ${issue.title}`,
		);
		throw result.error;
	}

	const helper = getHelper(source);

	return helper.extractIssueCover(result.data);
}

interface GetIssueItemsArgs {
	source: Source;
	issue: Issue;
}

export async function getIssueItems(args: GetIssueItemsArgs) {
	const { issue, source } = args;
	const result = await to(getHTML(issue.url));

	if (!result.ok) {
		console.error(
			`Error getting the html for getting the items of ${issue.title}`,
		);
		throw result.error;
	}

	const helper = getHelper(source);

	return helper.extractIssueItems(result.data);
}
