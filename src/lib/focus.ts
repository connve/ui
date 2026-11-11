const FOCUSABLE = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'summary',
	'iframe',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/** The elements Tab reaches inside `container`, in order; hidden and inert ones are skipped. */
function tabbable(container: HTMLElement): HTMLElement[] {
	return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
		(el) => !el.closest('[inert]') && el.checkVisibility({ visibilityProperty: true })
	);
}

/** Keeps Tab and Shift+Tab inside `container`, for a panel that covers the page; the container itself may hold focus. */
export function keepFocusWithin(event: KeyboardEvent, container: HTMLElement) {
	if (event.key !== 'Tab') return;
	const focusable = tabbable(container);
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (!first) {
		event.preventDefault();
		return;
	}
	const atStart = document.activeElement === first || document.activeElement === container;
	if (event.shiftKey && atStart) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
}
