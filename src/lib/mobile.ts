/** Below Tailwind's `md` breakpoint, where side panes open over the page instead of beside it and start closed. */
export const MOBILE_QUERY = '(max-width: 767px)';

export function isMobile(): boolean {
	return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
}

/** Classes that lay an open side pane over the page on mobile. */
export const PANE_OVER_PAGE =
	'max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-30 max-md:w-72! max-md:max-w-[85vw] max-md:shadow-xl';
