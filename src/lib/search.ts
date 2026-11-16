/** Whether the reader is on a Mac, where shortcuts use ⌘ rather than Ctrl. */
function isMac(): boolean {
	return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
}

/** The search shortcut as the reader's keyboard shows it. */
export function searchShortcut(): string {
	return isMac() ? '⌘K' : 'Ctrl K';
}

/** The search shortcut for `aria-keyshortcuts`. */
export const SEARCH_KEYS = 'Meta+K Control+K';

/** Whether `event` is the search shortcut, ⌘K or Ctrl+K. */
export function isSearchShortcut(event: KeyboardEvent): boolean {
	return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
}
