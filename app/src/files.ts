import { fs, path } from '@tauri-apps/api';
import { to } from '@await-to/core';
import { BaseDirectory } from '@tauri-apps/api/path';

export const pathExists = async (
	path: string,
	baseDir?: BaseDirectory,
) => {
	const exists = await to(fs.exists(path, { dir: baseDir }));

	if (!exists.ok) {
		throw exists.error;
	}

	return exists.data;
};

export const createImagesFolder = async () => {
	await fs.createDir('/img', {
		dir: BaseDirectory.App,
		recursive: true,
	});
};
