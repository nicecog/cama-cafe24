export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type PrettifyAction<T, K> = Prettify<T> & { actions: K };
