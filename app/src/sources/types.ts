import { CheerioAPI } from 'cheerio';
import { Issue, Source, Topic } from '../bindings';

export interface Category {
	title: string;
	url: string;
}

// export interface Topic {
// 	url: string;
// 	cover: string;
// 	title: string;
// 	description: string;
// 	categories: Category[];
// 	sourceId: Sources;
// 	id: string;
// }

// export interface Issue {
// 	url: string;
// 	id: number;
// 	title: string;
// 	sourceId: Sources;
// 	topicId: string;
// }

type Langs = 'es' | 'en';

export interface SourceHelper {
	url: string;
	title: string;
	lang: Langs;
	searchUrl: (query: string) => string;
	resultsFromSearch: (
		source: Source,
		$: CheerioAPI,
	) => Promise<Topic[]>;
	extractTopic: (
		source: Source,
		$: CheerioAPI,
	) => Promise<Topic | null>;
	extractIssues: ($: CheerioAPI, topic: Topic) => Promise<Issue[]>;
	extractIssueCover: ($: CheerioAPI) => Promise<string>;
	extractIssueItems: ($: CheerioAPI) => Promise<string[]>;
}
