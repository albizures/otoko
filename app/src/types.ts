export const satisfies =
	<T>() =>
	<U extends T>(t: U) =>
		t;
