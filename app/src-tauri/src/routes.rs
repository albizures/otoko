use crate::prisma::{issue as Issue, source as Source, topic as Topic, PrismaClient};
use std::sync::Arc;

use rspc::{Config, Router};

pub fn get_routes() -> Arc<Router<Arc<PrismaClient>>> {
	let source_router = Router::<Arc<PrismaClient>>::new().query("all", |t| {
		t(|db, _: ()| async move {
			let sources = db.source().find_many(vec![]).exec().await?;
			Ok(sources)
		})
	});

	let topic_router = Router::<Arc<PrismaClient>>::new()
		.query("bySource", |t| {
			t(|db, source: Source::Data| async move {
				let issues = db
					.topic()
					.find_many(vec![Topic::source::is(vec![Source::id::equals(source.id)])])
					.exec()
					.await?;
				Ok(issues)
			})
		})
		.mutation("upsert", |t| {
			t(|db, topic: Topic::Data| async move {
				let data: Topic::Data = db
					.topic()
					.upsert(
						Topic::url::equals(topic.url.clone()),
						Topic::create(
							topic.title.clone(),
							topic.description.clone(),
							topic.url,
							Source::id::equals(topic.source_id),
							topic.cover.clone(),
							vec![],
						),
						vec![
							Topic::title::set(topic.title),
							Topic::cover::set(topic.cover),
							Topic::cover::set(topic.description),
						],
					)
					.exec()
					.await?;

				Ok(data)
			})
		});

	let issue_router = Router::<Arc<PrismaClient>>::new()
		.query("byTopic", |t| {
			t(|db, topic: Topic::Data| async move {
				let issues = db
					.issue()
					.find_many(vec![Issue::topic::is(vec![Topic::id::equals(topic.id)])])
					.exec()
					.await?;
				Ok(issues)
			})
		})
		.mutation("upsert", |t| {
			t(|db, issue: Issue::Data| async move {
				let data: Issue::Data = db
					.issue()
					.upsert(
						Issue::url::equals(issue.url.clone()),
						Issue::create(
							issue.url.clone(),
							issue.title.clone(),
							Topic::id::equals(issue.topic_id),
							vec![],
						),
						vec![Issue::title::set(issue.title)],
					)
					.exec()
					.await?;

				Ok(data)
			})
		});

	let router = Router::<Arc<PrismaClient>>::new()
		.config(Config::new().export_ts_bindings("../src/bindings.ts"))
		.merge("source.", source_router)
		.merge("topic.", topic_router)
		.merge("issue.", issue_router)
		.build()
		.arced();

	router
}
