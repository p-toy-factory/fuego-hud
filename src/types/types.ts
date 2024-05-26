export interface Constructor<T> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	new (...args: any[]): T;
	prototype: T;
}
