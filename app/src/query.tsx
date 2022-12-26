import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

import { createClient } from '@rspc/client';
import { TauriTransport } from '@rspc/tauri';
import { createReactQueryHooks } from '@rspc/react';

import type { Procedures } from './bindings'; // These were the bindings exported from your Rust code!

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
	// Refer to the integration your using for the correct transport.
	transport: new TauriTransport(),
});

const rspc = createReactQueryHooks<Procedures>();

interface QueryProviderProps {
	children: React.ReactNode;
}

export { client, queryClient, rspc };

export function QueryProvider(props: QueryProviderProps) {
	const { children } = props;
	return (
		<QueryClientProvider client={queryClient}>
			<rspc.Provider client={client} queryClient={queryClient}>
				<>{children}</>
			</rspc.Provider>
		</QueryClientProvider>
	);
}
