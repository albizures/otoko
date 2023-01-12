import { to } from '@await-to/core';
import { fs, path } from '@tauri-apps/api';
import { fetch, ResponseType } from '@tauri-apps/api/http';
import { BaseDirectory } from '@tauri-apps/api/path';

export async function pathExists(
	path: string,
	baseDir?: BaseDirectory,
) {
	const exists = await to(fs.exists(path, { dir: baseDir }));

	if (!exists.ok) {
		throw exists.error;
	}

	return exists.data;
}

export async function createImagesFolder() {
	await fs.createDir('img', {
		dir: BaseDirectory.AppData,
		recursive: true,
	});
}

export async function saveImage(
	filename: string,
	content: fs.BinaryFileContents,
) {
	console.log(BaseDirectory.AppData, `/img/${filename}`);

	try {
		await fs.writeBinaryFile(`img/${filename}`, content, {
			dir: BaseDirectory.AppData,
		});
	} catch (e) {
		console.log(e);
	}
}

export async function downloadImg(url: string) {
	const content = await to(
		fetch<fs.BinaryFileContents>(url, {
			method: 'GET',
			responseType: ResponseType.Binary,
		}),
	);

	if (content.ok) {
		return content.data.data;
	}

	console.log(content.error);

	throw new Error('Error while downloading the file');
}
