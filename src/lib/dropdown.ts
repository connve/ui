export const FIELD =
	'input input-sm flex w-full items-center gap-2 border border-base-300 bg-base-100 outline-none focus-within:border-primary';

export const LIST =
	'absolute z-20 max-h-60 w-full overflow-y-auto rounded-lg border border-base-200 bg-base-100 p-1 text-sm shadow-lg';

export const OPTION = 'cursor-pointer rounded-md px-2 py-1.5';

const LIST_HEIGHT = 248;

// Opens upward when the list would run past the bottom of the window.
export function placement(field: HTMLElement | null): string {
	const below = field ? window.innerHeight - field.getBoundingClientRect().bottom : LIST_HEIGHT;
	return below < LIST_HEIGHT ? 'bottom-full mb-1' : 'top-full mt-1';
}
