#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use std::sync::Arc;
mod prisma;
use prisma::{new_client, source, PrismaClient};
use rspc::{Config, Router};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
	format!("Hello, {}! You've been greeted from Rust!", name)
}

struct Source {
	title: String,
	url: String,
	lang: String,
}

#[tokio::main]
async fn main() {
	let client = new_client().await.unwrap();

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

	let router = Router::<Arc<PrismaClient>>::new()
		.config(Config::new().export_ts_bindings("../src/bindings.ts"))
		.query("source", |t| {
			t(|db, _name: String| async move {
				let sources = db.source().find_many(vec![]).exec().await?;
				Ok(sources)
			})
		})
		.build()
		.arced();

	create_app(router, client).await;
}

async fn create_app(router: Arc<Router<Arc<PrismaClient>>>, client: PrismaClient) {
	let test = Arc::new(client);
	tauri::Builder::default()
		.plugin(rspc::integrations::tauri::plugin(router, move || {
			Arc::clone(&test)
		}))
		.invoke_handler(tauri::generate_handler![greet])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
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
