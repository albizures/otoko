import create from 'zustand';
import { persist } from 'zustand/middleware';
import { views } from '../views';

type Views = typeof views;

interface StackState {
	stack: [keyof Views, object | void][];
	actions: {
		push: <K extends keyof Views>(
			view: K,
			props: Parameters<Views[K]>[0],
		) => void;
		replace: <K extends keyof Views>(
			view: K,
			props: Parameters<Views[K]>[0],
		) => void;
		pop: () => void;
	};
}

export const useStack = create<StackState>(
	// persist<StackState>(
	(set, get) => ({
		stack: [['Home', {}]],
		actions: {
			push(view, props) {
				return set({ stack: [...get().stack, [view, props]] });
			},
			replace(view, props) {
				const removed = get().stack.slice(0, -1);
				return set({ stack: [...removed, [view, props]] });
			},
			pop() {
				return set({ stack: get().stack.slice(0, -1) });
			},
		},
	}),
	// 	{
	// 		name: 'stack',
	// 		merge: (persistedState, currentState) => ({
	// 			...currentState,
	// 			...(persistedState as object),
	// 			actions: currentState.actions,
	// 		}),
	// 	},
	// ),
);

export function useStackViews() {
	return useStack((s) => s.stack);
}

export function useCurrentView() {
	return useStack((s) => s.stack.at(-1)!);
}

export function useStackActions() {
	return useStack((s) => s.actions);
}
