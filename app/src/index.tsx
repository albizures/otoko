import '@unocss/reset/tailwind.css';
import 'uno.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { QueryProvider } from './query';

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<QueryProvider>
				<App />
			</QueryProvider>
		</React.StrictMode>,
	);
}
