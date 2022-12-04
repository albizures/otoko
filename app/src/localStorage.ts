import { Source } from './sources';

type KeyType = 'search';
interface Key extends String {
	__key: 'key';
}

export function createKey(
	type: KeyType,
	source: Source,
	value: string,
) {
	return `${type}|${source.id}|${value}` as unknown as Key;
}

export function getItem<T>(key: Key): T | null {
	const item = localStorage.getItem(key as unknown as string);

	if (!item) {
		return null;
	}

	const data = JSON.parse(item);
	const date = new Intl.DateTimeFormat('en-US').format(new Date());

	if (date !== data.date) {
		localStorage.removeItem(key as unknown as string);
		return null;
	}

	return JSON.parse(data.value) as T;
}

export function setItem(key: Key, payload: unknown) {
	try {
		const value = JSON.stringify(payload);
		const date = new Intl.DateTimeFormat('en-US').format(new Date());
		const data = {
			date,
			value,
		};

		localStorage.setItem(
			key as unknown as string,
			JSON.stringify(data),
		);
	} catch (error) {
		console.error('Otoko: possible a invalid payload');
		throw error;
	}
}
