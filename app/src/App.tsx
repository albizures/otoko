import React from 'react';

import {
	useCurrentView,
	useStackActions,
	useStackViews,
} from './store';
import { views } from './views';
import { View } from './components/View';
import { BsFolder2 } from 'react-icons/bs';
import { SearchField } from './components/SearchField';
import { rspc } from './query';
import { useSourcesHelpers } from './store/sources';

export function App() {
	const stackViews = useStackViews();
	const [id] = useCurrentView();
	const { push, replace } = useStackActions();
	const sourceHelpers = useSourcesHelpers();

	const sourceQuery = rspc.useQuery(['source.all'], {
		onSuccess(data) {
			sourceHelpers.upsert(data);
		},
	});

	function onSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const elements = event.currentTarget.elements as unknown as {
			query: HTMLInputElement;
		};

		const props = {
			query: elements.query.value,
		};

		if (id === 'Search') {
			replace('Search', props);
		} else {
			push('Search', props);
		}
	}

	return (
		<div className="flex h-full divide-x dark:divide-black">
			<div className="py-2 px-3 dark:bg-dark-4">
				<form onSubmit={onSearch} className="mt-1">
					<SearchField defaultValue={''} />
				</form>
				<span className="dark:text-gray-5 text-xs font-bold">
					Sources
				</span>
				<ul>
					{sourceQuery.isSuccess
						? sourceQuery.data.map((source) => {
								const { title } = source;
								return (
									<li
										key={source.id}
										className="space-x-2 px-1 hover:dark:bg-gray-7 rounded "
									>
										<BsFolder2 className="inline-block fill-amber" />
										<span className="vertical-middle">{title}</span>
									</li>
								);
						  })
						: 'loading...'}
				</ul>
			</div>
			<div className="flex-1 relative">
				{stackViews.map((view, index) => {
					const [key, props] = view;
					const Comp = views[key] as any;
					return (
						<View key={index}>
							<Comp {...props} />
						</View>
					);
				})}
			</div>
		</div>
	);
}
