import { CheerioAPI } from 'cheerio';
import { satisfies } from '../types';
import { Sources } from './sources';

export interface Category {
	title: string;
	url: string;
}

export const satisfiesSource = satisfies<Source>();

export interface Topic {
	url: string;
	cover: string;
	title: string;
	description: string;
	categories: Category[];
	sourceId: Sources;
	id: string;
}

export interface Issue {
	url: string;
	id: number;
	title: string;
	sourceId: Sources;
	topicId: string;
}

type Langs = 'es' | 'en';

export interface Source {
	base: string;
	title: string;
	id: string;
	lang: Langs;
	searchUrl: (query: string) => string;
	resultsFromSearch: ($: CheerioAPI) => Promise<Topic[]>;
	extractTopic: ($: CheerioAPI) => Promise<Topic | null>;
	extractIssues: ($: CheerioAPI, topic: Topic) => Promise<Issue[]>;
	extractIssueCover: ($: CheerioAPI) => Promise<string>;
	extractIssueItems: ($: CheerioAPI) => Promise<string[]>;
}
