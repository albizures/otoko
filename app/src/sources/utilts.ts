import { load } from 'cheerio';
import { to } from '@await-to/core';
import { fetch, ResponseType } from '@tauri-apps/api/http';

export async function getHTML(url: string) {
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

	const $ = load(result.data.data);

	return $;
}
