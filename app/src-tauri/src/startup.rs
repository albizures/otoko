use crate::prisma::{source, PrismaClient};

struct Source {
	title: String,
	url: String,
	lang: String,
}

pub async fn init(client: &PrismaClient) {
	let leer_manga_xyz = Source {
		url: "https://r2.leermanga.xyz".to_string(),
		title: "LeerManga.xyz".to_string(),
		lang: "es".to_string(),
	};

	let online_manga_xyz = Source {
		url: "https://onlinemanga.xyz".to_string(),
		title: "OnlineManga.xyz".to_string(),
		lang: "en".to_string(),
	};

	upsert_source(&client, leer_manga_xyz).await;
	upsert_source(&client, online_manga_xyz).await;
}

async fn upsert_source(client: &PrismaClient, src: Source) {
	client
		.source()
		.upsert(
			source::url::equals(src.url.clone()),
			source::create(src.title, src.url, src.lang, vec![]),
			vec![],
		)
		.exec()
		.await
		.unwrap();
}
