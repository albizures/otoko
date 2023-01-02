#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

mod prisma;
mod routes;
mod startup;

use prisma::{new_client, PrismaClient};
use rspc::Router;
use std::sync::Arc;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
	format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() {
	let client = new_client().await.unwrap();

	startup::init(&client).await;

	let router = routes::get_routes();

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
