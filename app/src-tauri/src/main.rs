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
use tauri::{
	api::dir::is_dir,
	http::{ResponseBuilder, Uri},
	Manager, State,
};

// struct DirEntries(Mutex<Vec<PathBuf>>);

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
		// .register_uri_scheme_protocol("otoko", {
		// 	let node = node.clone();
		// 	move |_, req| {
		// 		let url = req.uri().parse::<Uri>().unwrap();
		// 		let mut path = url.path().split('/').collect::<Vec<_>>();
		// 		path[0] = url.host().unwrap(); // The first forward slash causes an empty item and we replace it with the URL's host which you expect to be at the start
		// 		let (status_code, content_type, body) =
		// 			block_in_place(|| block_on(node.handle_custom_uri(path)));
		// 		ResponseBuilder::new()
		// 			.status(status_code)
		// 			.mimetype(content_type)
		// 			.body(body)
		// 	}
		// })
		// .register_uri_scheme_protocol("reqimg", move |app, request| {
		// 	let res_not_img = ResponseBuilder::new().status(404).body(Vec::new());
		// 	if request.method() != "GET" {
		// 		return res_not_img;
		// 	}
		// 	let uri = request.uri();
		// 	let start_pos = match uri.find("?n=") {
		// 		Some(_pos) => _pos + 3,
		// 		None => return res_not_img,
		// 	};
		// 	let end_pos = match uri.find("&") {
		// 		Some(_pos) => _pos,
		// 		None => return res_not_img,
		// 	};
		// 	let entry_num: usize = match &uri[start_pos..end_pos].parse() {
		// 		Ok(_i) => *_i,
		// 		Err(_) => return res_not_img,
		// 	};
		// 	let dir_entries: State<DirEntries> = app.state();
		// 	let v_dirs = &*dir_entries.0.lock().unwrap();
		// 	let target_file = match v_dirs.get(entry_num) {
		// 		Some(_dir) => &v_dirs[entry_num],
		// 		None => return res_not_img,
		// 	};
		// 	let extension = match target_file.extension() {
		// 		Some(_ex) => _ex.to_string_lossy().to_string(),
		// 		None => return res_not_img,
		// 	};
		// 	if !is_img_extension(&extension) {
		// 		return res_not_img;
		// 	}
		// 	println!("🚩Request: {} / {:?}", entry_num, target_file);
		// 	let local_img = if let Ok(data) = read(target_file) {
		// 		tauri::http::ResponseBuilder::new()
		// 			.mimetype(format!("image/{}", &extension).as_str())
		// 			.body(data)
		// 	} else {
		// 		res_not_img
		// 	};
		// 	local_img
		// })
		.invoke_handler(tauri::generate_handler![greet])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

fn is_img_extension(extension: &str) -> bool {
	let ex: [&str; 6] = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
	ex.iter().any(|e| *e == extension.to_lowercase())
}
