import * as cheerio from 'cheerio';
import { fetch, ResponseType } from '@tauri-apps/api/http';
import { Issue, satisfiesSource, Source, Topic } from './types';
import { to } from '@await-to/core';

function createSource() {
	const base = 'https://onlinemanga.xyz';

	const source = {
		id: 'onlineManga.xyz',
		title: 'OnlineManga.xyz',
		lang: 'en',
		base,
		searchUrl(query: string) {
			return `${base}/search?query=${encodeURIComponent(query)}`;
		},
		resultsFromSearch,
		extractTopic,
		extractIssues,
		extractIssueCover,
		extractIssueItems,
	} as const;

	satisfiesSource(source);

	return source;
}

export const onlineManga = createSource();
const source = onlineManga;

// #region
async function extractIssueCover($: cheerio.CheerioAPI) {
	const $cover = $('#nanoGallery3').find('a').first();

	const url = $cover.attr('href');
	return url!;
}

async function extractIssueItems($: cheerio.CheerioAPI) {
	return $('#nanoGallery3')
		.find('a')
		.toArray()
		.map((link) => {
			const $link = $(link);
			return $link.attr('href')!;
		});
}

async function extractIssues($: cheerio.CheerioAPI, topic: Topic) {
	return $('#chaptersTable > tbody > tr')
		.toArray()
		.map((row, index) => {
			const $row = $(row);

			if ($row.children().length === 0) {
				return null;
			}

			const $title = $row.find('td').last();
			const $link = $row.find('a');
			const href = $link.attr('href')!;

			const issue: Issue = {
				id: index,
				topicId: topic.id,
				sourceId: topic.sourceId,
				title: $title.text().trim(),
				url: `${source.base}${href}`,
			};

			return issue;
		})
		.filter((item: Issue | null): item is Issue => item !== null);
}

async function extractTopic(
	$: cheerio.CheerioAPI,
): Promise<Topic | null> {
	const $card = $('.row[itemscope]').parents('.card');
	const $title = $card.find('[itemprop="name"]');

	if ($card.length === 0 || $title.length === 0) {
		return null;
	}

	const $cover = $card.find('[itemprop="image"]');
	const $link = $cover.parent();
	const $description = $card.find('[itemprop="description"]');

	const $categories = $card
		.find('[itemprop="genre"]')
		.toArray()
		.map((el) => $(el));

	const title = $title.text();
	const href = $link.attr('href')!;
	const description = $description.text();
	const cover = $cover.attr('src')!;

	const categories = $categories.map(($category) => {
		const $link = $category.parent();
		const href = $link.attr('href')!;
		return {
			url: `${source.base}${href}`,
			title: $category.text(),
		};
	});

	const url = `${source.base}${href}`;

	return {
		id: url,
		title,
		url,
		description,
		cover,
		sourceId: source.id,
		categories,
	};
}

async function resultsFromSearch(
	$: cheerio.CheerioAPI,
): Promise<Topic[]> {
	const $elements = $('.container .card .card-body');

	return (
		await Promise.all(
			$elements.toArray().map((el) => {
				return getTopicFromCard($(el).parent('.card'));
			}),
		)
	).filter((item: unknown): item is Topic => item !== null);
}

async function getTopicFromCard(
	$card: cheerio.Cheerio<cheerio.Element>,
) {
	const $title = $card.find('[itemprop="name"]');

	if ($title.length === 0) {
		return null;
	}

	const $link = $title.parent();
	const href = $link.attr('href')!;
	const url = `${source.base}${href}`;

	const result = await to(
		fetch<string>(url, {
			responseType: ResponseType.Text,
			method: 'GET',
			headers: {
				'Content-Type': 'text/plain',
			},
		}),
	);

	if (!result.ok) {
		throw result.error;
	}

	if (!result.data.ok) {
		throw result.data.data;
	}

	const $ = cheerio.load(result.data.data);

	return extractTopic($);
}

// #endregion
